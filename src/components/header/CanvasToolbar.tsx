'use client';

import { useState, useEffect, useRef } from 'react';
import { Music, Paintbrush, Radio, Sunrise, Trash2 } from 'lucide-react';
import { canvasEvents } from '@/lib/canvas-events';

const SWATCHES = [
  { color: 'default', background: 'linear-gradient(135deg, #fff 50%, #000 50%)' },
  { color: '#ef4444', background: '#ef4444' },
  { color: '#f97316', background: '#f97316' },
  { color: '#eab308', background: '#eab308' },
  { color: '#22c55e', background: '#22c55e' },
  { color: '#3b82f6', background: '#3b82f6' },
  { color: '#8b5cf6', background: '#8b5cf6' },
  { color: '#ec4899', background: '#ec4899' },
];

export default function CanvasToolbar() {
  const [musicActive, setMusicActive] = useState(false);
  const [discoActive, setDiscoActive] = useState(false);
  const [sunsetActive, setSunsetActive] = useState(false);
  const [canvasDirty, setCanvasDirty] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState('default');
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return canvasEvents.on('canvasDirty', (detail) => setCanvasDirty(detail.dirty));
  }, []);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
        setPaletteOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleMusic = () => {
    const newActive = !musicActive;
    setMusicActive(newActive);
    canvasEvents.emit('musicToggle', { active: newActive });
  };

  const toggleDisco = () => {
    const newActive = !discoActive;
    setDiscoActive(newActive);
    canvasEvents.emit('discoToggle', { active: newActive });
  };

  const toggleSunset = () => {
    const newActive = !sunsetActive;
    setSunsetActive(newActive);
    canvasEvents.emit('sunsetToggle', { active: newActive });
    if (newActive) {
      document.body.classList.add('sunset-active');
    } else {
      document.body.classList.remove('sunset-active');
    }
  };

  const clearCanvas = () => {
    canvasEvents.emit('canvasClear', undefined);
    setCanvasDirty(false);
  };

  const selectSwatch = (color: string) => {
    setActiveSwatch(color);
    canvasEvents.emit('colorChange', { color });
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
        id="disco-toggle"
        type="button"
        className={`header-icon ${discoActive ? 'active' : ''}`}
        onClick={toggleDisco}
        aria-label="Toggle disco mode"
      >
        <Radio size={18} />
      </button>
      <button
        id="sunset-toggle"
        type="button"
        className={`header-icon ${sunsetActive ? 'active' : ''}`}
        onClick={toggleSunset}
        aria-label="Toggle sunset mode"
      >
        <Sunrise size={18} />
      </button>
      <div className="relative" ref={paletteRef}>
        <button
          type="button"
          className={`header-icon ${paletteOpen ? 'active' : ''}`}
          onClick={() => setPaletteOpen(!paletteOpen)}
          aria-label="Choose canvas color"
        >
          <Paintbrush size={18} />
        </button>
        <div id="color-palette" className={`color-palette ${paletteOpen ? '' : 'hidden'}`}>
          <div className="color-palette-inner">
            {SWATCHES.map((swatch) => (
              <button
                key={swatch.color}
                type="button"
                className={`color-swatch ${activeSwatch === swatch.color ? 'active' : ''}`}
                style={{ background: swatch.background }}
                onClick={() => selectSwatch(swatch.color)}
                aria-label={`Select ${swatch.color} color`}
              />
            ))}
          </div>
        </div>
      </div>
      <button
        id="canvas-clear-btn"
        type="button"
        className={`canvas-clear-btn header-icon ${canvasDirty ? 'visible' : ''}`}
        onClick={clearCanvas}
        aria-label="Clear canvas"
      >
        <Trash2 size={18} />
      </button>
    </>
  );
}
