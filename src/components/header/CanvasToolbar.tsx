'use client';

import { useEffect, useRef, useState } from 'react';
import { AudioLines, Music, Paintbrush, Rainbow, Trash2 } from 'lucide-react';
import { useCanvas } from '@/contexts/CanvasContext';

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
  const [spokenActive, setSpokenActive] = useState(false);
  const [sunsetActive, setSunsetActive] = useState(false);
  const [canvasDirty, setCanvasDirty] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribers = [
      on('canvasDirty', (detail) => setCanvasDirty(detail.dirty)),
      on('musicToggle', (detail) => setMusicActive(detail.active)),
      on('spokenToggle', (detail) => setSpokenActive(detail.active)),
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
        setPaletteOpen(false);
        emit('paintToggle', { active: false });
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [emit]);

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
    if (next && spokenActive) emit('spokenToggle', { active: false });
    emit('musicToggle', { active: next });
  };

  const toggleSpokenWord = () => {
    if (spokenActive) {
      emit('spokenToggle', { active: false });
      return;
    }

    if (musicActive) emit('musicToggle', { active: false });
    ensureSoundOn();
    emit('spokenToggle', { active: true });
  };

  const toggleSunset = () => {
    const next = !sunsetActive;
    emit('sunsetToggle', { active: next });

    if (!next) {
      emit('canvasClear', undefined);
      setCanvasDirty(false);
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
        className={`header-icon ${musicActive ? 'active' : ''}`}
        onClick={toggleMusic}
        aria-label="Toggle music"
      >
        <Music size={18} />
      </button>
      <button
        id="spoken-toggle"
        type="button"
        className={`header-icon ${spokenActive ? 'active' : ''}`}
        onClick={toggleSpokenWord}
        aria-label="Toggle spoken word"
        aria-pressed={spokenActive}
        data-tooltip={spokenActive ? 'Stop reading' : 'Spoken word'}
      >
        <AudioLines size={18} />
      </button>
      <button
        id="sunset-toggle"
        type="button"
        className={`header-icon ${sunsetActive ? 'active' : ''}`}
        onClick={toggleSunset}
        aria-label="Toggle sunset"
      >
        <Rainbow size={18} />
      </button>
      <div className="relative" ref={paletteRef}>
        <button
          id="paint-toggle"
          type="button"
          className={`header-icon ${paletteOpen ? 'active' : ''}`}
          onClick={togglePaint}
          aria-label="Toggle paint"
        >
          <Paintbrush size={18} />
        </button>
        <div id="color-palette" className={`color-palette ${paletteOpen ? '' : 'hidden'}`}>
          <div className="color-palette-inner">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch.color}
                type="button"
                className={`color-swatch ${paintColor === swatch.color ? 'active' : ''}`}
                style={{ background: swatch.background }}
                onClick={() => selectSwatch(swatch.color)}
                aria-label={swatch.label}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        id="canvas-clear"
        type="button"
        className={`canvas-clear-btn header-icon ${canvasDirty || paletteOpen ? 'visible' : ''}`}
        onClick={clearCanvas}
        aria-label="Clear canvas"
      >
        <Trash2 size={18} />
      </button>
    </>
  );
}
