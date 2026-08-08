'use client';

import { useEffect, useRef, useState } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';
import { IconMusic, IconSunset, IconPaint, IconCanvasClear } from '../MarCYKIcons';

const SWATCHES = [
  { color: '', background: 'linear-gradient(135deg, #fff 50%, #000 50%)', label: 'Default color' },
  { color: '#ef4444', background: '#ef4444', label: 'Red' },
  { color: '#f97316', background: '#f97316', label: 'Orange' },
  { color: '#eab308', background: '#eab308', label: 'Yellow' },
  { color: '#22c55e', background: '#22c55e', label: 'Green' },
  { color: '#3b82f6', background: '#3b82f6', label: 'Blue' },
  { color: '#8b5cf6', background: '#8b5cf6', label: 'Purple' },
  { color: '#ec4899', background: '#ec4899', label: 'Pink' },
];

export default function CanvasToolbar() {
  const { emit, on, paintColor, setPaintColor, resetPaintColor } = useCanvas();
  const [musicActive, setMusicActive] = useState(false);

  const [sunsetActive, setSunsetActive] = useState(false);
  const [canvasDirty, setCanvasDirty] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribers = [
      on('canvasDirty', (detail) => setCanvasDirty(detail.dirty)),
      on('musicToggle', (detail) => setMusicActive(detail.active)),

      on('sunsetToggle', (detail) => setSunsetActive(detail.active)),
      on('paintToggle', (detail) => setPaletteOpen(detail.active)),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [on]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!paletteRef.current) return;
      // Skip if this toolbar instance is hidden (e.g. mobile bar on desktop)
      if (paletteRef.current.offsetParent === null) return;
      
      if (!paletteRef.current.contains(event.target as Node)) {
        if (paletteOpen) {
          setPaletteOpen(false);
          emit('paintToggle', { active: false });
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [emit, paletteOpen]);

  const ensureSoundOn = () => {
    emit('soundToggle', { enabled: true });
    try {
      localStorage.setItem('sound', 'on');
    } catch {
      // Ignore persistence failures; event bus still updates in-memory state.
    }
  };

  const toggleMusic = () => {
    const next = !musicActive;
    emit('musicToggle', { active: next });
  };



  const toggleSunset = () => {
    const next = !sunsetActive;
    emit('sunsetToggle', { active: next });

    if (!next) {
      emit('canvasClear', undefined);
      setCanvasDirty(false);
      resetPaintColor();
      if (paletteOpen) {
        setPaletteOpen(false);
        emit('paintToggle', { active: false });
      }
    }

    if (next) {
      document.body.classList.add('sunset-active');
    } else {
      document.body.classList.remove('sunset-active');
    }
  };

  const togglePaint = () => {
    const next = !paletteOpen;
    setPaletteOpen(next);
    emit('paintToggle', { active: next });
  };

  const clearCanvas = () => {
    emit('canvasClear', undefined);
    setCanvasDirty(false);
    resetPaintColor();
  };

  const selectSwatch = (color: string) => {
    setPaintColor(color);
  };

  return (
    <>
      <button
        id="music-toggle"
        type="button"
        className={`header-icon has-tooltip ${musicActive ? 'active' : ''} group`}
        data-tooltip="Music"
        onClick={toggleMusic}
        aria-label="Toggle music"
      >
        <IconMusic />
      </button>

      <button
        id="sunset-toggle"
        type="button"
        className={`header-icon has-tooltip ${sunsetActive ? 'active' : ''} group`}
        data-tooltip="Sunset"
        onClick={toggleSunset}
        aria-label="Toggle sunset"
      >
        <IconSunset />
      </button>
      <button
        id="canvas-clear"
        type="button"
        className={`canvas-clear-btn header-icon has-tooltip ${canvasDirty || paletteOpen ? 'visible' : ''} group`}
        data-tooltip="Clear canvas"
        onClick={clearCanvas}
        aria-label="Clear canvas"
      >
        <IconCanvasClear />
      </button>
      
      <div className="relative flex items-center justify-center" ref={paletteRef}>
        <div id="color-palette" className={`absolute bottom-full md:bottom-auto md:top-full right-0 pb-2 md:pb-0 md:pt-2 z-10 ${paletteOpen ? '' : 'hidden'}`}>
          <div className="color-palette-inner flex items-center gap-1.5">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch.color}
                type="button"
                className={`color-swatch ${paintColor === swatch.color ? 'active' : ''}`}
                onClick={() => selectSwatch(swatch.color)}
                aria-label={swatch.label}
              >
                <span className="swatch-inner" style={{ background: swatch.background }} />
              </button>
            ))}
          </div>
        </div>

        <button
          id="paint-toggle"
          type="button"
          className={`header-icon has-tooltip ${paletteOpen ? 'active' : ''} group`}
          data-tooltip="Paint"
          onClick={togglePaint}
          aria-label="Toggle paint"
        >
          <IconPaint />
        </button>
      </div>
    </>
  );
}
