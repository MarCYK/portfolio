'use client';

import { useEffect, useRef } from 'react';
import { computeRows } from '@/lib/song-data';
import { createAudioState, initAudio, playNote } from '@/lib/audio';
import type { CanvasTheme } from '@/lib/canvas-engine';
import { createCanvasState, drawFrame, getRowAtY, updateRows } from '@/lib/canvas-engine';
import { useCanvas } from '@/contexts/CanvasContext';

const SPOKEN_AUDIO_SRC = 'https://www.zchry.org/audio/siddhartha-spoken-ai.mp3';

export default function CanvasHome() {
  const { emit, on, getPaintColor } = useCanvas();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctxEl = canvasEl.getContext('2d');
    if (!ctxEl) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    const audio = createAudioState();
    const initialTheme: CanvasTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const state = createCanvasState(initialTheme);
    const initialPaintColor = getPaintColor();
    state.customStrokeColor = initialPaintColor === '' ? null : initialPaintColor;

    let spokenAudio: HTMLAudioElement | null = null;
    let spokenSource: MediaElementAudioSourceNode | null = null;
    let spokenAnalyser: AnalyserNode | null = null;
    let spokenData: Uint8Array | null = null;
    let spokenFrameId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const drawableHeight = Math.max(0, canvas.height - 52);
      updateRows(state, computeRows(drawableHeight));
    };
    resize();
    window.addEventListener('resize', resize);

    let animFrameId: number;
    let isDrawing = false;
    let canvasDirty = false;
    let lastRow = -1;
    let strokePaintColor: string | null = null;

    const toRgb = (hex: string) => {
      const normalized = hex.replace('#', '');
      const value = normalized.length === 3
        ? normalized.split('').map((char) => `${char}${char}`).join('')
        : normalized;
      if (value.length !== 6) return null;
      const r = Number.parseInt(value.slice(0, 2), 16);
      const g = Number.parseInt(value.slice(2, 4), 16);
      const b = Number.parseInt(value.slice(4, 6), 16);
      if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return null;
      return { r, g, b };
    };

    const applyPaintToRow = (row: number) => {
      if (state.sunsetMode) return;
      if (row < 0 || row >= state.rows) return;

      if (!strokePaintColor) {
        state.rowPaintMask[row] = 0;
        state.rowPaintR[row] = 0;
        state.rowPaintG[row] = 0;
        state.rowPaintB[row] = 0;
        return;
      }

      const rgb = toRgb(strokePaintColor);
      if (!rgb) return;

      state.rowPaintMask[row] = 1;
      state.rowPaintR[row] = rgb.r;
      state.rowPaintG[row] = rgb.g;
      state.rowPaintB[row] = rgb.b;
    };

    const stopSpokenWord = () => {
      state.spokenMode = false;
      state.spokenLevel = 0;

      if (spokenFrameId) {
        cancelAnimationFrame(spokenFrameId);
        spokenFrameId = 0;
      }

      if (spokenAudio) {
        spokenAudio.pause();
        spokenAudio.currentTime = 0;
      }
    };

    const updateSpokenLevel = () => {
      if (!state.spokenMode || !spokenAnalyser || !spokenData) return;

      spokenAnalyser.getByteTimeDomainData(spokenData as Uint8Array<ArrayBuffer>);

      let sum = 0;
      for (let i = 0; i < spokenData.length; i += 1) {
        sum += Math.abs(spokenData[i] - 128);
      }

      const energy = Math.min(1, (sum / spokenData.length) / 46);
      state.spokenLevel = state.spokenLevel * 0.94 + energy * 0.06;
      spokenFrameId = requestAnimationFrame(updateSpokenLevel);
    };

    const startSpokenWord = async () => {
      await initAudio(audio);
      if (!audio.audioCtx) return;

      if (audio.audioCtx.state === 'suspended') {
        await audio.audioCtx.resume();
      }

      state.musicPlaying = false;
      state.lastMusicElapsed = -1;
      state.spokenMode = true;
      state.spokenLevel = 0;

      if (!spokenAudio) {
        spokenAudio = new Audio(SPOKEN_AUDIO_SRC);
        spokenAudio.preload = 'auto';
      }

      spokenAudio.src = SPOKEN_AUDIO_SRC;

      if (!spokenSource) {
        spokenSource = audio.audioCtx.createMediaElementSource(spokenAudio);
        spokenAnalyser = audio.audioCtx.createAnalyser();
        spokenAnalyser.fftSize = 1024;
        spokenAnalyser.smoothingTimeConstant = 0.72;
        spokenData = new Uint8Array(spokenAnalyser.frequencyBinCount);
        spokenSource.connect(spokenAnalyser);
        spokenAnalyser.connect(audio.audioCtx.destination);
      }

      spokenAudio.onended = () => {
        stopSpokenWord();
        emit('spokenToggle', { active: false });
      };

      spokenAudio.onerror = () => {
        stopSpokenWord();
        emit('spokenToggle', { active: false });
      };

      const playPromise = spokenAudio.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          stopSpokenWord();
          emit('spokenToggle', { active: false });
        });
      }

      if (spokenFrameId) {
        cancelAnimationFrame(spokenFrameId);
      }
      spokenFrameId = requestAnimationFrame(updateSpokenLevel);
    };

    const stopDrawing = () => {
      isDrawing = false;
      lastRow = -1;
      strokePaintColor = null;
    };

    function handleDraw(_clientX: number, clientY: number) {
      const row = getRowAtY(canvas.height, clientY, state.rows);
      if (row < 0 || row >= state.rows) return;

      applyPaintToRow(row);

      // Pluck on row crossing — fire once per string, like strumming
      if (row !== lastRow) {
        state.rowGlow[row] = 1.0;
        if (audio.soundEnabled) {
          const velocity = lastRow === -1 ? 0.7 : Math.min(0.4 + Math.abs(row - lastRow) * 0.1, 0.9);
          playNote(audio, row, velocity, state.rows);
        }
        lastRow = row;
      }

      if (!canvasDirty) {
        canvasDirty = true;
        emit('canvasDirty', { dirty: true });
      }
    }

    function animate() {
      drawFrame(canvas, ctx, state, audio);
      animFrameId = requestAnimationFrame(animate);
    }

    // Mouse events
    const onMouseDown = async (event: MouseEvent) => {
      isDrawing = true;
      strokePaintColor = state.customStrokeColor;
      await initAudio(audio);
      handleDraw(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) => {
      if (isDrawing) handleDraw(event.clientX, event.clientY);
    };

    // Touch events
    const onTouchStart = async (event: TouchEvent) => {
      isDrawing = true;
      strokePaintColor = state.customStrokeColor;
      await initAudio(audio);
      handleDraw(event.touches[0].clientX, event.touches[0].clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (isDrawing) handleDraw(event.touches[0].clientX, event.touches[0].clientY);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseup', stopDrawing);
    window.addEventListener('touchend', stopDrawing);
    window.addEventListener('touchcancel', stopDrawing);
    window.addEventListener('blur', stopDrawing);

    // Custom event handlers for header controls
    const unsubMusic = on('musicToggle', async (detail) => {
      await initAudio(audio);
      state.musicPlaying = detail.active;
      if (detail.active) {
        if (state.spokenMode) stopSpokenWord();
      }
      if (state.musicPlaying && audio.audioCtx) {
        state.musicStartTime = audio.audioCtx.currentTime;
        state.lastMusicElapsed = -1;
      }
    });
    const unsubSpoken = on('spokenToggle', (detail) => {
      if (detail.active) {
        startSpokenWord().catch(() => {
          stopSpokenWord();
          emit('spokenToggle', { active: false });
        });
      } else {
        stopSpokenWord();
      }
    });
    const unsubSunset = on('sunsetToggle', (detail) => {
      state.sunsetMode = detail.active;
    });
    const unsubCanvasClear = on('canvasClear', () => {
      state.energy.fill(0);
      state.rowGlow.fill(0);
      state.rowPaintMask.fill(0);
      state.rowPaintR.fill(0);
      state.rowPaintG.fill(0);
      state.rowPaintB.fill(0);
      canvasDirty = false;
      emit('canvasDirty', { dirty: false });
    });
    const unsubColor = on('colorChange', (detail) => {
      state.customStrokeColor = detail.color === '' ? null : detail.color;
    });
    const unsubSound = on('soundToggle', (detail) => {
      audio.soundEnabled = detail.enabled;
    });
    const unsubTheme = on('themeChange', (detail) => {
      const theme = detail.theme;
      if (theme === 'dark' || theme === 'light') {
        state.theme = theme;
      }
    });

    const onWindowNotePlayed = (event: Event) => {
      const detail = (event as CustomEvent<{ note: string }>).detail;
      emit('notePlayed', detail);
    };

    window.addEventListener('notePlayed', onWindowNotePlayed as EventListener);

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', stopDrawing);
      window.removeEventListener('touchend', stopDrawing);
      window.removeEventListener('touchcancel', stopDrawing);
      window.removeEventListener('blur', stopDrawing);
      window.removeEventListener('notePlayed', onWindowNotePlayed as EventListener);
      stopSpokenWord();
      unsubMusic();
      unsubSpoken();
      unsubSunset();
      unsubCanvasClear();
      unsubColor();
      unsubSound();
      unsubTheme();
    };
  }, [emit, on, getPaintColor]);

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
