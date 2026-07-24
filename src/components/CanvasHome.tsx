'use client';

import { useEffect, useRef } from 'react';
import { computeRows } from '@/lib/song-data';
import { createAudioState, initAudio, playNote } from '@/lib/audio';
import { pluckDecision } from '@/lib/pluck';
import type { CanvasTheme } from '@/lib/canvas-engine';
import { createCanvasState, drawFrame, getRowAtY, updateRows } from '@/lib/canvas-engine';
import { tryParseHex } from '@/lib/color-math';
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
    const initialPaintColor = getPaintColor();
    state.customStrokeColor = initialPaintColor === '' ? null : initialPaintColor;



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

    const applyPaintToRow = (row: number) => {
      if (state.sunsetMode) return;
      if (row < 0 || row >= state.rows) return;

      if (!strokePaintColor) {
        const rowT = row / state.rows;
        const bandDistance = Math.abs(rowT - 0.5);
        const middleBandRadius = 0.28;
        const bandFade = Math.max(0, 1 - bandDistance / middleBandRadius);
        const fade = Math.pow(bandFade, 1.8);
        
        const lightness = state.theme === 'dark'
          ? 14 + fade * 68
          : 12 + fade * 42;
          
        const rgbVal = Math.floor((lightness / 100) * 255);
        
        state.rowPaintMask[row] = 1;
        state.rowPaintR[row] = rgbVal;
        state.rowPaintG[row] = rgbVal;
        state.rowPaintB[row] = rgbVal;
        return;
      }

      const rgb = tryParseHex(strokePaintColor);
      if (!rgb) return;

      state.rowPaintMask[row] = 1;
      state.rowPaintR[row] = rgb.r;
      state.rowPaintG[row] = rgb.g;
      state.rowPaintB[row] = rgb.b;
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

      // Pluck on row crossing — one note per string at fixed velocity,
      // matching zchry.org playRowNote. No chord, no speed scaling.
      const pluck = pluckDecision(lastRow, row);
      if (pluck.shouldPlay) {
        state.rowGlow[row] = 1.0;
        if (audio.soundEnabled) {
          playNote(audio, row, pluck.velocity, state.rows, pluck.duration);
        }
        lastRow = row;
      }

      if (!canvasDirty) {
        canvasDirty = true;
        emit('canvasDirty', { dirty: true });
      }
    }

    function animate() {
      drawFrame(canvas, ctx, state, audio, (note) => emit('notePlayed', { note }));
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
      }
      if (state.musicPlaying && audio.audioCtx) {
        state.musicStartTime = audio.audioCtx.currentTime;
        state.lastMusicElapsed = -1;
        state.seqStep = 0;
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
