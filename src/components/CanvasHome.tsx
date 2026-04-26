'use client';

import { useEffect, useRef } from 'react';
import { computeRows } from '@/lib/song-data';
import { createAudioState, initAudio, playNote } from '@/lib/audio';
import type { CanvasTheme } from '@/lib/canvas-engine';
import { createCanvasState, drawFrame, getRowAtY, updateRows } from '@/lib/canvas-engine';
import { useCanvas } from '@/contexts/CanvasContext';

export default function CanvasHome() {
  const { emit, on } = useCanvas();
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

    const stopDrawing = () => {
      isDrawing = false;
      lastRow = -1;
    };

    function handleDraw(_clientX: number, clientY: number) {
      const row = getRowAtY(canvas.height, clientY, state.rows);
      if (row < 0 || row >= state.rows) return;

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
      await initAudio(audio);
      handleDraw(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) => {
      if (isDrawing) handleDraw(event.clientX, event.clientY);
    };

    // Touch events
    const onTouchStart = async (event: TouchEvent) => {
      isDrawing = true;
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
      if (state.musicPlaying && audio.audioCtx) {
        state.musicStartTime = audio.audioCtx.currentTime;
        state.lastMusicElapsed = -1;
      }
    });
    const unsubDisco = on('discoToggle', (detail) => {
      state.discoMode = detail.active;
    });
    const unsubSunset = on('sunsetToggle', (detail) => {
      state.sunsetMode = detail.active;
    });
    const unsubCanvasClear = on('canvasClear', () => {
      state.energy.fill(0);
      state.rowGlow.fill(0);
      canvasDirty = false;
      emit('canvasDirty', { dirty: false });
    });
    const unsubColor = on('colorChange', (detail) => {
      state.customStrokeColor = detail.color === 'default' ? null : detail.color;
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
      unsubMusic();
      unsubDisco();
      unsubSunset();
      unsubCanvasClear();
      unsubColor();
      unsubSound();
      unsubTheme();
    };
  }, [emit, on]);

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
