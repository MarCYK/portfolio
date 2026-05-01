'use client';

import { useEffect, useRef } from 'react';
import { computeRows } from '@/lib/song-data';
import { createAudioState, initAudio, playNote } from '@/lib/audio';
import type { CanvasTheme } from '@/lib/canvas-engine';
import { createCanvasState, drawFrame, getRowAtY, updateRows } from '@/lib/canvas-engine';
import { useCanvas } from '@/contexts/CanvasContext';

const SPOKEN_AUDIO_SRC = 'https://www.zchry.org/audio/siddhartha-spoken-ai.mp3';
const AIR_FRAME_WIDTH = 128;
const AIR_FRAME_HEIGHT = 96;

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

    let spokenAudio: HTMLAudioElement | null = null;
    let spokenSource: MediaElementAudioSourceNode | null = null;
    let spokenAnalyser: AnalyserNode | null = null;
    let spokenData: Uint8Array | null = null;
    let spokenFrameId = 0;

    let airVideo: HTMLVideoElement | null = null;
    let airCanvas: HTMLCanvasElement | null = null;
    let airStream: MediaStream | null = null;
    let airPrevFrame: Uint8Array | null = null;
    let airFrameId = 0;
    let airOscillator: OscillatorNode | null = null;
    let airGain: GainNode | null = null;

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

    const stopAirSynth = () => {
      if (airOscillator) {
        try {
          airOscillator.stop();
        } catch {
          // Oscillator may already be stopped.
        }
        airOscillator.disconnect();
      }

      if (airGain) {
        airGain.disconnect();
      }

      airOscillator = null;
      airGain = null;
    };

    const syncAirSynth = () => {
      if (!audio.audioCtx) return;

      const now = audio.audioCtx.currentTime;
      const isAudible = state.airMode && audio.soundEnabled;

      if (!isAudible) {
        if (airGain) {
          airGain.gain.setTargetAtTime(0, now, 0.05);
        }
        return;
      }

      if (!airOscillator || !airGain) {
        airOscillator = audio.audioCtx.createOscillator();
        airGain = audio.audioCtx.createGain();
        airOscillator.type = 'sine';
        airGain.gain.value = 0;
        airOscillator.connect(airGain);
        airGain.connect(audio.audioCtx.destination);
        airOscillator.start();
      }

      const targetFrequency = 220 + (1 - state.airY) * 1100;
      const targetGain = Math.min(0.16, Math.max(0, state.airEnergy * 0.18));

      airOscillator.frequency.setTargetAtTime(targetFrequency, now, 0.08);
      airGain.gain.setTargetAtTime(targetGain, now, 0.08);
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

      if (state.airMode || airStream) {
        stopAirCamera();
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

    function stopAirCamera() {
      state.airMode = false;
      state.airEnergy = 0;
      state.airX = 0.78;
      state.airY = 0.52;

      if (airFrameId) {
        cancelAnimationFrame(airFrameId);
        airFrameId = 0;
      }

      if (airStream) {
        airStream.getTracks().forEach((track) => track.stop());
        airStream = null;
      }

      if (airVideo) {
        airVideo.srcObject = null;
        airVideo.remove();
        airVideo = null;
      }

      airPrevFrame = null;
      syncAirSynth();
    }

    const processAirFrame = () => {
      if (!state.airMode || !airVideo || !airCanvas) return;
      if (airVideo.readyState < 2) {
        airFrameId = requestAnimationFrame(processAirFrame);
        return;
      }

      const offscreenCtx = airCanvas.getContext('2d', { willReadFrequently: true });
      if (!offscreenCtx) {
        airFrameId = requestAnimationFrame(processAirFrame);
        return;
      }

      const width = airCanvas.width;
      const height = airCanvas.height;

      offscreenCtx.save();
      offscreenCtx.scale(-1, 1);
      offscreenCtx.drawImage(airVideo, -width, 0, width, height);
      offscreenCtx.restore();

      const image = offscreenCtx.getImageData(0, 0, width, height).data;
      const grayscale = new Uint8Array(width * height);

      let weightedX = 0;
      let weightedY = 0;
      let diffSum = 0;

      for (let i = 0; i < grayscale.length; i += 1) {
        const dataIndex = i * 4;
        const lum = (image[dataIndex] * 0.299 + image[dataIndex + 1] * 0.587 + image[dataIndex + 2] * 0.114) | 0;
        grayscale[i] = lum;

        if (!airPrevFrame) continue;

        const diff = Math.abs(lum - airPrevFrame[i]);
        if (diff < 12) continue;

        const x = i % width;
        const y = (i / width) | 0;
        weightedX += x * diff;
        weightedY += y * diff;
        diffSum += diff;
      }

      airPrevFrame = grayscale;

      if (diffSum > 0) {
        const targetX = Math.max(0, Math.min(1, weightedX / diffSum / width));
        const targetY = Math.max(0, Math.min(1, weightedY / diffSum / height));
        const targetEnergy = Math.min(1, diffSum / (width * height * 22));

        state.airX = state.airX * 0.82 + targetX * 0.18;
        state.airY = state.airY * 0.78 + targetY * 0.22;
        state.airEnergy = state.airEnergy * 0.86 + targetEnergy * 0.14;
      } else {
        state.airEnergy *= 0.95;
      }

      syncAirSynth();
      airFrameId = requestAnimationFrame(processAirFrame);
    };

    const startAirCamera = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        emit('airStatus', { error: 'Camera is not available in this browser' });
        emit('airToggle', { active: false });
        return;
      }

      await initAudio(audio);
      emit('airStatus', { error: null });

      if (!airVideo) {
        airVideo = document.createElement('video');
        airVideo.autoplay = true;
        airVideo.muted = true;
        airVideo.playsInline = true;
        airVideo.style.cssText = 'position:fixed;width:1px;height:1px;opacity:0;pointer-events:none;left:-9999px;top:-9999px;';
        document.body.appendChild(airVideo);
      }

      if (!airCanvas) {
        airCanvas = document.createElement('canvas');
        airCanvas.width = AIR_FRAME_WIDTH;
        airCanvas.height = AIR_FRAME_HEIGHT;
      }

      try {
        airStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 320 },
            height: { ideal: 240 },
          },
          audio: false,
        });

        airVideo.srcObject = airStream;
        await airVideo.play().catch(() => undefined);

        state.musicPlaying = false;
        state.lastMusicElapsed = -1;
        state.spokenMode = false;
        state.spokenLevel = 0;
        state.airMode = true;
        state.airEnergy = 0;
        airPrevFrame = null;

        stopSpokenWord();
        syncAirSynth();
        emit('airStatus', { error: null });
        airFrameId = requestAnimationFrame(processAirFrame);
      } catch {
        emit('airStatus', { error: 'Camera permission denied' });
        emit('airToggle', { active: false });
      }
    };

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
      if (!state.airMode) {
        syncAirSynth();
      }
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
      if (detail.active) {
        if (state.spokenMode) stopSpokenWord();
        if (state.airMode || airStream) stopAirCamera();
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
    const unsubAir = on('airToggle', (detail) => {
      if (detail.active) {
        startAirCamera().catch(() => {
          emit('airStatus', { error: 'Unable to start camera' });
          emit('airToggle', { active: false });
        });
      } else {
        stopAirCamera();
      }
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
      state.customStrokeColor = detail.color === '' || detail.color === 'default' ? null : detail.color;
    });
    const unsubSound = on('soundToggle', (detail) => {
      audio.soundEnabled = detail.enabled;
      syncAirSynth();
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
      stopAirCamera();
      stopAirSynth();
      unsubMusic();
      unsubSpoken();
      unsubAir();
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
