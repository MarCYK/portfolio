'use client';

import { useEffect, useRef } from 'react';
import { ROWS } from '@/lib/song-data';
import { createAudioState, initAudio, playNote } from '@/lib/audio';
import type { CanvasTheme } from '@/lib/canvas-engine';
import { createCanvasState, drawFrame, getRowAtY } from '@/lib/canvas-engine';

export default function CanvasHome() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctxEl = canvasEl.getContext('2d');
    if (!ctxEl) return;

    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = ctxEl;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const audio = createAudioState();
    const initialTheme: CanvasTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const state = createCanvasState(initialTheme);
    let animFrameId: number;
    let isDrawing = false;
    let canvasDirty = false;

    const stopDrawing = () => {
      isDrawing = false;
    };

    function handleDraw(_clientX: number, clientY: number) {
      const row = getRowAtY(canvas.height, clientY);
      if (row < 0 || row >= ROWS) return;

      const prev = state.energy[row];
      state.energy[row] = Math.min(prev + 0.6, 3);
      if (audio.soundEnabled && prev < 1.0 && state.energy[row] >= 1.0) playNote(audio, row, 0.7);

      if (!canvasDirty) {
        canvasDirty = true;
        window.dispatchEvent(new CustomEvent('canvasDirty', { detail: { dirty: true } }));
      }
    }

    function animate() {
      drawFrame(canvas, ctx, state, audio);
      animFrameId = requestAnimationFrame(animate);
    }

    // Mouse events
    const onMouseDown = (event: MouseEvent) => {
      isDrawing = true;
      initAudio(audio);
      handleDraw(event.clientX, event.clientY);
    };
    const onMouseMove = (event: MouseEvent) => {
      if (isDrawing) handleDraw(event.clientX, event.clientY);
    };

    // Touch events
    const onTouchStart = (event: TouchEvent) => {
      isDrawing = true;
      initAudio(audio);
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
    const onMusicToggle = async (event: Event) => {
      await initAudio(audio);
      state.musicPlaying = (event as CustomEvent).detail.active;
      if (state.musicPlaying && audio.audioCtx) {
        state.musicStartTime = audio.audioCtx.currentTime;
        state.lastMusicElapsed = -1;
      }
    };
    const onDiscoToggle = (event: Event) => {
      state.discoMode = (event as CustomEvent).detail.active;
    };
    const onSunsetToggle = (event: Event) => {
      state.sunsetMode = (event as CustomEvent).detail.active;
    };
    const onCanvasClear = () => {
      state.energy.fill(0);
      canvasDirty = false;
      window.dispatchEvent(new CustomEvent('canvasDirty', { detail: { dirty: false } }));
    };
    const onColorChange = (event: Event) => {
      const color = (event as CustomEvent).detail.color;
      state.customStrokeColor = color === 'default' ? null : color;
    };
    const onSoundToggle = (event: Event) => {
      audio.soundEnabled = (event as CustomEvent).detail.enabled;
    };
    const onThemeChange = (event: Event) => {
      const theme = (event as CustomEvent<{ theme?: CanvasTheme }>).detail.theme;
      if (theme === 'dark' || theme === 'light') {
        state.theme = theme;
      }
    };

    window.addEventListener('musicToggle', onMusicToggle);
    window.addEventListener('discoToggle', onDiscoToggle);
    window.addEventListener('sunsetToggle', onSunsetToggle);
    window.addEventListener('canvasClear', onCanvasClear);
    window.addEventListener('colorChange', onColorChange);
    window.addEventListener('soundToggle', onSoundToggle);
    window.addEventListener('themeChange', onThemeChange);

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
      window.removeEventListener('musicToggle', onMusicToggle);
      window.removeEventListener('discoToggle', onDiscoToggle);
      window.removeEventListener('sunsetToggle', onSunsetToggle);
      window.removeEventListener('canvasClear', onCanvasClear);
      window.removeEventListener('colorChange', onColorChange);
      window.removeEventListener('soundToggle', onSoundToggle);
      window.removeEventListener('themeChange', onThemeChange);
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
