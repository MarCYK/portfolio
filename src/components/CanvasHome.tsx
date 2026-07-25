'use client';

import { useEffect, useRef } from 'react';
import { computeRows } from '@/lib/song-data';
import { createAudioState, initAudio, playNote } from '@/lib/audio';
import { pluckDecision } from '@/lib/pluck';
import type { CanvasTheme } from '@/lib/canvas-engine';
import { createCanvasState, drawFrame, getDefaultCanvasColors, getRowAtY, updateRows } from '@/lib/canvas-engine';
import { useCanvas } from '@/contexts/CanvasContext';



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
    state.paintColor = getPaintColor();

    // DPR-aware resize matches zchry.org: scale backing store by devicePixelRatio
    // (capped at 2x) so waveforms stay crisp on Retina displays.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      updateRows(state, computeRows(window.innerHeight));
    };
    resize();
    window.addEventListener('resize', resize);

    let animFrameId: number;
    let lastDrawTime = 0;
    let isDrawing = false;
    let lastRow = -1;
    let strokePaintColor = '';

    const stopDrawing = () => {
      isDrawing = false;
      lastRow = -1;
      strokePaintColor = '';
    };

    // Matches zchry.org paint-on-row-cross behavior: each new row entered
    // while the mouse is down gets the current paint color (or "default").
    const applyPaintToRow = (row: number) => {
      if (state.sunsetStrength > 0) return;
      if (row < 0 || row >= state.rows) return;
      if (!isDrawing) return;
      state.rowColors[row] = strokePaintColor === '' ? 'default' : strokePaintColor;
    };

    function handleDraw(_clientX: number, clientY: number) {
      const row = getRowAtY(canvas.height, clientY, state.rows);
      if (row < 0 || row >= state.rows) return;

      // Track hover row even when not drawing, so the hover stroke lights up.
      state.hoverRow = row;
      applyPaintToRow(row);

      // Pluck on row crossing: one note per string at fixed velocity,
      // matching zchry.org playRowNote. No chord, no speed scaling.
      const pluck = pluckDecision(lastRow, row);
      if (pluck.shouldPlay) {
        state.rowGlow[row] = 1.0;
        state.rowMidi[row] = 0;
        if (audio.soundEnabled) {
          playNote(audio, row, pluck.velocity, state.rows, pluck.duration);
        }
        lastRow = row;
      }

      if (isDrawing) {
        emit('canvasDirty', { dirty: true });
      }
    }

    function animate() {
      const now = performance.now();
      // Frame-rate cap matches zchry.org: 33ms (~30fps) normally, 22ms
      // (~45fps) while music plays. The wave's time advancement is tied
      // to real performance.now(), so skipping frames doesn't slow it.
      const minFrameMs = state.musicPlaying ? 22 : 33;
      if (lastDrawTime > 0 && now - lastDrawTime < minFrameMs) {
        animFrameId = requestAnimationFrame(animate);
        return;
      }
      lastDrawTime = now;
      drawFrame(canvas, ctx, state, audio, (note) => emit('notePlayed', { note }), now);
      animFrameId = requestAnimationFrame(animate);
    }

    // Mouse events
    const onMouseDown = async (event: MouseEvent) => {
      isDrawing = true;
      strokePaintColor = state.paintColor;
      await initAudio(audio);
      handleDraw(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) => {
      handleDraw(event.clientX, event.clientY);
    };

    // Touch events
    const onTouchStart = async (event: TouchEvent) => {
      isDrawing = true;
      strokePaintColor = state.paintColor;
      await initAudio(audio);
      handleDraw(event.touches[0].clientX, event.touches[0].clientY);
    };
    const onTouchMove = (event: TouchEvent) => {
      handleDraw(event.touches[0].clientX, event.touches[0].clientY);
    };
    const onMouseLeave = () => {
      state.hoverRow = -1;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
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
      if (state.musicPlaying && audio.audioCtx) {
        state.musicStartTime = audio.audioCtx.currentTime;
        state.lastMusicElapsed = -1;
        state.seqStep = 0;
      }
    });

    const unsubSunset = on('sunsetToggle', (detail) => {
      state.sunsetStrength = detail.active ? 1 : 0;
    });
    const unsubCanvasClear = on('canvasClear', () => {
      state.energy.fill(0);
      state.rowGlow.fill(0);
      state.rowColors.fill(null);
      state.rowMidi.fill(0);
      state.rowNoteEnd.fill(0);
      emit('canvasDirty', { dirty: false });
    });
    const unsubColor = on('colorChange', (detail) => {
      state.paintColor = detail.color;
    });
    const unsubSound = on('soundToggle', (detail) => {
      audio.soundEnabled = detail.enabled;
    });
    const unsubTheme = on('themeChange', (detail) => {
      const theme = detail.theme;
      if (theme === 'dark' || theme === 'light') {
        state.theme = theme;
        const defaults = getDefaultCanvasColors(theme);
        state.bgColor = defaults.bgColor;
        state.strokeColor = defaults.strokeColor;
      }
    });

    animFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseup', stopDrawing);
      window.removeEventListener('touchend', stopDrawing);
      window.removeEventListener('touchcancel', stopDrawing);
      window.removeEventListener('blur', stopDrawing);
      unsubMusic();
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
