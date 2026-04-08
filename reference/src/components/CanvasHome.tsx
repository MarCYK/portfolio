'use client';
import { useEffect, useRef } from 'react';

export default function CanvasHome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctxEl = canvasEl.getContext('2d');
    if (!ctxEl) return;

    // Non-nullable aliases for closure capture
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    // Resize canvas to fill viewport
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // === CONFIG ===
    const ROWS = 30;
    const energy = new Float32Array(ROWS); // 0..3+
    let timeOffset = 0;
    let animFrameId: number;
    let isDrawing = false;
    let canvasDirty = false;

    // === COLOR STATE ===
    let strokeColor = 'rgba(255, 255, 255, 0.85)';
    let bgColor = '#0a0a0a';
    let discoMode = false;
    let discoHue = 0;
    let sunsetMode = false;

    // === AUDIO STATE ===
    let soundEnabled = localStorage.getItem('sound') !== 'disabled';
    let musicPlaying = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let player: any = null;
    let audioCtx: AudioContext | null = null;

    // === PENTATONIC SCALE (C3-G6) ===
    const PENTATONIC_NOTES = [
      'C3','E3','G3','B3','D4','E4','G4','B4',
      'D5','E5','G5','B5','D6','E6','G6','B6',
      'D7','E7','G7','B7','C8'
    ];

    function rowToNote(rowIndex: number): string {
      const noteIndex = ROWS - 1 - rowIndex;
      return PENTATONIC_NOTES[Math.min(noteIndex, PENTATONIC_NOTES.length - 1)];
    }

    // Init audio lazily on first user interaction
    async function initAudio() {
      if (audioCtx) return;
      audioCtx = new AudioContext();
      try {
        const Soundfont = (await import('soundfont-player')).default;
        player = await Soundfont.instrument(audioCtx, 'acoustic_grand_piano', {
          soundfont: 'MusyngKite'
        });
      } catch (e) {
        console.warn('Audio init failed:', e);
      }
    }

    function playNote(rowIndex: number, velocity = 0.8) {
      if (!player || !soundEnabled || !audioCtx) return;
      const note = rowToNote(rowIndex);
      try {
        player.play(note, audioCtx.currentTime, { duration: 0.6, gain: velocity });
      } catch {
        // ignore
      }
    }

    // === MUSIC MODE - simplified piano sequence ===
    // A representative piano sequence in the style of "Where Is My Mind?" at 80 BPM
    // Format: [timeInSeconds, midiPitch, velocity]
    const MIDI_NOTES: [number, number, number][] = [
      [0.0,64,0.7],[0.0,52,0.4],[0.75,62,0.7],[0.75,50,0.4],
      [1.5,60,0.7],[1.5,48,0.4],[2.25,59,0.65],[3.0,57,0.7],[3.0,45,0.4],
      [3.75,55,0.65],[4.5,57,0.7],[5.25,59,0.65],[6.0,60,0.75],[6.0,48,0.4],
      [6.75,62,0.7],[7.5,64,0.75],[8.25,62,0.7],[9.0,60,0.7],[9.0,48,0.4],
      [9.75,59,0.65],[10.5,57,0.7],[10.5,45,0.4],[11.25,55,0.65],
      [12.0,52,0.7],[12.0,40,0.4],[12.75,54,0.65],[13.5,55,0.7],
      [14.25,57,0.65],[15.0,59,0.7],[15.0,47,0.4],[15.75,57,0.65],
      [16.5,55,0.7],[17.25,54,0.65],[18.0,52,0.75],[18.0,40,0.4],
      [18.75,54,0.7],[19.5,55,0.7],[20.25,57,0.65],[21.0,59,0.7],[21.0,47,0.4],
      [21.75,60,0.7],[22.5,62,0.75],[23.25,64,0.8],[24.0,62,0.7],[24.0,50,0.4],
      [24.75,60,0.7],[25.5,59,0.65],[26.25,57,0.65],[27.0,55,0.7],[27.0,43,0.4],
      [27.75,54,0.65],[28.5,52,0.7],[29.25,50,0.65],[30.0,52,0.7],[30.0,40,0.4],
      [30.75,54,0.65],[31.5,55,0.7],[32.25,57,0.65],[33.0,59,0.7],[33.0,47,0.4],
      [33.75,60,0.7],[34.5,62,0.7],[35.25,60,0.65],[36.0,59,0.7],[36.0,47,0.4],
      [36.75,57,0.65],[37.5,55,0.7],[38.25,54,0.65],[39.0,52,0.7],[39.0,40,0.4],
    ];
    const SONG_DURATION = 40; // loop every 40 seconds

    let musicStartTime = 0;
    let lastMusicElapsed = -1;

    function midiPitchToRow(midi: number): number {
      // MIDI 48 (C3) = bottom row, MIDI 96 (C7) = top row
      const normalized = Math.max(0, Math.min(1, (midi - 48) / 48));
      return Math.floor((1 - normalized) * (ROWS - 1));
    }

    function tickMusic() {
      if (!musicPlaying || !audioCtx) return;
      const elapsed = (audioCtx.currentTime - musicStartTime) % SONG_DURATION;

      for (const [noteTime, midiPitch, velocity] of MIDI_NOTES) {
        if (noteTime <= elapsed && noteTime > lastMusicElapsed) {
          if (player) {
            const midiNote = midiToName(midiPitch);
            try {
              player.play(midiNote, audioCtx.currentTime, { duration: 0.5, gain: velocity });
            } catch (e) { /* ignore */ }
          }
          const rowIndex = midiPitchToRow(midiPitch);
          energy[rowIndex] = Math.min(energy[rowIndex] + velocity * 1.5, 4);
        }
      }
      lastMusicElapsed = elapsed;
    }

    function midiToName(midi: number): string {
      const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
      const octave = Math.floor(midi / 12) - 1;
      return notes[midi % 12] + octave;
    }

    // === DRAWING ===
    function drawFrame() {
      const w = canvas.width;
      const h = canvas.height;

      // Original uses full height as baseY for row spacing
      const baseY = h;
      const rowSpacing = baseY / ROWS;
      // Fill extends 3x rowSpacing below baseline (matches original)
      const fillExtend = rowSpacing * 3;

      // Amplitude: center rows have largest amplitude (verticalMult bell curve)
      const maxAmpBase = w < 640 ? w * 0.14 : Math.min(w, h) * 0.12;
      // Edge power for horizontal fade
      const edgePow = w < 640 ? 1.5 : w < 1024 ? 3 : w > 1800 ? 7 : 5;

      // Update colors based on mode
      if (sunsetMode) {
        bgColor = '#fff8e8';
        strokeColor = discoMode
          ? `hsl(${discoHue}, 80%, 35%)`
          : 'rgba(80, 40, 0, 0.85)';
      } else {
        bgColor = '#0a0a0a';
        strokeColor = discoMode
          ? `hsl(${discoHue}, 100%, 70%)`
          : 'rgba(255, 255, 255, 0.85)';
      }

      if (discoMode) {
        discoHue = (discoHue + 0.8) % 360;
      }

      // Decay energy
      for (let i = 0; i < ROWS; i++) {
        energy[i] *= 0.96;
        // Bleed to neighbors
        if (i > 0) energy[i - 1] += energy[i] * 0.015;
        if (i < ROWS - 1) energy[i + 1] += energy[i] * 0.015;
      }

      // Clear canvas (original uses clearRect, not fillRect)
      ctx.clearRect(0, 0, w, h);

      // Draw rows TOP to BOTTOM (r=0 first, r=ROWS-1 last)
      // Each row's fill covers the area below it (bgColor), occluding rows drawn earlier
      // This means lower rows appear in front — matching the Joy Division layered look
      const steps = Math.ceil(w / 3);
      const t = timeOffset;

      for (let r = 0; r < ROWS; r++) {
        // lineY is the BASELINE of this row (bottom edge), wave goes upward from it
        const lineY = (r + 1) * rowSpacing;

        // Vertical amplitude multiplier: bell curve centered at middle rows
        const rowT = ROWS > 1 ? r / (ROWS - 1) : 0.5;
        const verticalDist = Math.abs(rowT - 0.5) * 2;
        const verticalMult = Math.pow(Math.max(0, 1 - verticalDist * 1.6), 2);
        const maxAmp = maxAmpBase * verticalMult * (1 + energy[r] * 0.5);

        // Build wave points — wave goes UPWARD from lineY
        const ptsX: number[] = [];
        const ptsY: number[] = [];
        for (let s = 0; s <= steps; s++) {
          const nx = s / steps;
          const x = nx * w;
          // Edge fade: taper amplitude near left/right edges
          const edgeFade = Math.pow(Math.sin(nx * Math.PI), edgePow);

          // Multi-octave noise matching original's computeNoise function exactly.
          // The Math.max(0, sin - threshold) * gain terms produce rectified spikes
          // that create the sharp mountain peaks of the Joy Division look.
          let noise = 0;
          noise += Math.sin(nx * 15 + r * 0.9 + t) * 0.2;
          noise += Math.sin(nx * 33 + r * 1.6 + t * 1.5) * 0.15;
          noise += Math.sin(nx * 70 + r * 2.5 + t * 0.3) * 0.1;
          noise += Math.sin(nx * 120 + r * 3.1 + t * 0.7) * 0.06;
          noise += Math.sin(nx * 8 + r * 0.4 + t * 0.6) * 0.25;
          noise += Math.max(0, Math.sin(nx * 22 + r * 1.2 + t * 1.0) - 0.2) * 1.6;
          noise += Math.max(0, Math.sin(nx * 45 + r * 2.0 + t * 0.7) - 0.35) * 1.2;
          noise += Math.max(0, Math.sin(nx * 11 + r * 0.35 + t * 1.3) - 0.3) * 1.3;
          noise += Math.max(0, Math.sin(nx * 65 + r * 2.8 + t * 0.5) - 0.5) * 0.7;

          const amp = noise * edgeFade * maxAmp;
          ptsX.push(x);
          ptsY.push(lineY - amp); // wave goes upward (subtract from lineY)
        }

        // Fill region: from wave curve down to lineY + fillExtend
        // This occludes the rows drawn before this one that fall below this row's baseline
        ctx.beginPath();
        ctx.moveTo(ptsX[0], ptsY[0]);
        for (let s = 1; s <= steps; s++) ctx.lineTo(ptsX[s], ptsY[s]);
        ctx.lineTo(w, lineY + fillExtend);
        ctx.lineTo(0, lineY + fillExtend);
        ctx.closePath();
        ctx.fillStyle = bgColor;
        ctx.fill();

        // Stroke the wave line
        ctx.beginPath();
        ctx.moveTo(ptsX[0], ptsY[0]);
        for (let s = 1; s <= steps; s++) ctx.lineTo(ptsX[s], ptsY[s]);
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      timeOffset += 0.004;

      // Music tick
      if (musicPlaying) tickMusic();

      animFrameId = requestAnimationFrame(drawFrame);
    }

    // === INTERACTION ===
    function getRowAtY(clientY: number) {
      const rowSpacing = canvas.height / ROWS;
      return Math.floor(clientY / rowSpacing);
    }

    function handleDraw(_clientX: number, clientY: number) {
      const row = getRowAtY(clientY);
      if (row < 0 || row >= ROWS) return;
      energy[row] = Math.min(energy[row] + 0.6, 3);
      if (soundEnabled) playNote(row, 0.7);
      if (!canvasDirty) {
        canvasDirty = true;
        window.dispatchEvent(new CustomEvent('canvasDirty', { detail: { dirty: true } }));
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      isDrawing = true;
      initAudio();
      handleDraw(e.clientX, e.clientY);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDrawing) handleDraw(e.clientX, e.clientY);
    };
    const onMouseUp = () => { isDrawing = false; };
    const onTouchStart = (e: TouchEvent) => {
      isDrawing = true;
      initAudio();
      handleDraw(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (isDrawing) handleDraw(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => { isDrawing = false; };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // === CUSTOM EVENTS ===
    const onMusicToggle = async (e: Event) => {
      await initAudio();
      musicPlaying = (e as CustomEvent).detail.active;
      if (musicPlaying && audioCtx) {
        musicStartTime = audioCtx.currentTime;
        lastMusicElapsed = -1;
      }
    };
    const onDiscoToggle = (e: Event) => {
      discoMode = (e as CustomEvent).detail.active;
    };
    const onSunsetToggle = (e: Event) => {
      sunsetMode = (e as CustomEvent).detail.active;
    };
    const onCanvasClear = () => {
      energy.fill(0);
      canvasDirty = false;
      window.dispatchEvent(new CustomEvent('canvasDirty', { detail: { dirty: false } }));
    };
    const onColorChange = (e: Event) => {
      const color = (e as CustomEvent).detail.color;
      if (color === 'default') {
        strokeColor = 'rgba(255, 255, 255, 0.85)';
      } else {
        strokeColor = color;
      }
    };
    const onSoundToggle = (e: Event) => {
      soundEnabled = (e as CustomEvent).detail.enabled;
    };

    window.addEventListener('musicToggle', onMusicToggle);
    window.addEventListener('discoToggle', onDiscoToggle);
    window.addEventListener('sunsetToggle', onSunsetToggle);
    window.addEventListener('canvasClear', onCanvasClear);
    window.addEventListener('colorChange', onColorChange);
    window.addEventListener('soundToggle', onSoundToggle);

    // Start animation
    animFrameId = requestAnimationFrame(drawFrame);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('musicToggle', onMusicToggle);
      window.removeEventListener('discoToggle', onDiscoToggle);
      window.removeEventListener('sunsetToggle', onSunsetToggle);
      window.removeEventListener('canvasClear', onCanvasClear);
      window.removeEventListener('colorChange', onColorChange);
      window.removeEventListener('soundToggle', onSoundToggle);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="grid-canvas"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        cursor: 'crosshair',
        pointerEvents: 'auto',
      }}
    />
  );
}
