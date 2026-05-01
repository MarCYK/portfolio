'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Music, Paintbrush, Radio, Sunrise, Trash2, X } from 'lucide-react';
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
  const { emit, on } = useCanvas();
  const [musicActive, setMusicActive] = useState(false);
  const [spokenActive, setSpokenActive] = useState(false);
  const [airActive, setAirActive] = useState(false);
  const [airStarting, setAirStarting] = useState(false);
  const [airModalOpen, setAirModalOpen] = useState(false);
  const [airError, setAirError] = useState<string | null>(null);
  const [sunsetActive, setSunsetActive] = useState(false);
  const [canvasDirty, setCanvasDirty] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState('');
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribers = [
      on('canvasDirty', (detail) => setCanvasDirty(detail.dirty)),
      on('musicToggle', (detail) => setMusicActive(detail.active)),
      on('spokenToggle', (detail) => setSpokenActive(detail.active)),
      on('airToggle', (detail) => {
        setAirActive(detail.active);
        if (detail.active) {
          setAirStarting(false);
          setAirError(null);
        } else {
          setAirStarting(false);
        }
      }),
      on('airStatus', (detail) => {
        if (detail.error) {
          setAirError(detail.error);
          setAirStarting(false);
        } else {
          setAirError(null);
        }
      }),
      on('sunsetToggle', (detail) => setSunsetActive(detail.active)),
      on('paintToggle', (detail) => setPaletteOpen(detail.active)),
      on('colorChange', (detail) => setActiveSwatch(detail.color || '')),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [on]);

  useEffect(() => {
    if (!airModalOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setAirModalOpen(false);
      setAirStarting(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [airModalOpen]);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (paletteRef.current && !paletteRef.current.contains(event.target as Node)) {
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
    if (next && airActive) emit('airToggle', { active: false });
    emit('musicToggle', { active: next });
  };

  const toggleSpokenWord = () => {
    if (spokenActive) {
      emit('spokenToggle', { active: false });
      return;
    }

    if (musicActive) emit('musicToggle', { active: false });
    if (airActive) emit('airToggle', { active: false });
    ensureSoundOn();
    emit('spokenToggle', { active: true });
  };

  const closeAirModal = () => {
    setAirModalOpen(false);
    setAirStarting(false);
  };

  const startAirMode = () => {
    if (musicActive) emit('musicToggle', { active: false });
    if (spokenActive) emit('spokenToggle', { active: false });
    setAirModalOpen(false);
    setAirStarting(true);
    setAirError(null);
    emit('airStatus', { error: null });
    emit('airToggle', { active: true });
  };

  const toggleAirMode = () => {
    if (airActive) {
      emit('airToggle', { active: false });
      closeAirModal();
      return;
    }

    setAirError(null);
    setAirModalOpen(true);
    setAirStarting(true);
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
  };

  const selectSwatch = (color: string) => {
    setActiveSwatch(color);
    emit('colorChange', { color });
  };

  const airPressed = airActive || airStarting || airModalOpen;
  const airTooltip = airError || (airActive ? 'Stop Theramin' : 'Theramin');

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
        <Mic size={18} />
      </button>
      <button
        id="air-toggle"
        type="button"
        className={`header-icon ${airPressed ? 'active' : ''}`}
        onClick={toggleAirMode}
        aria-label="Toggle Theramin Mode"
        aria-pressed={airPressed}
        data-tooltip={airTooltip}
      >
        <Radio size={18} />
      </button>
      <button
        id="sunset-toggle"
        type="button"
        className={`header-icon ${sunsetActive ? 'active' : ''}`}
        onClick={toggleSunset}
        aria-label="Toggle sunset"
      >
        <Sunrise size={18} />
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
                className={`color-swatch ${activeSwatch === swatch.color ? 'active' : ''}`}
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

      <div
        id="air-modal"
        className={`air-modal ${airModalOpen ? 'open' : ''}`}
        aria-hidden={!airModalOpen}
        hidden={!airModalOpen}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeAirModal();
        }}
      >
        <div className="air-modal-card" role="dialog" aria-modal="true" aria-labelledby="air-modal-title">
          <button
            id="air-modal-close"
            type="button"
            aria-label="Close Theramin Mode intro"
            className="air-modal-close header-icon"
            onClick={closeAirModal}
          >
            <X size={16} />
          </button>
          <h2 id="air-modal-title">Theramin Mode</h2>
          <p>
            Nothing is recorded or sent anywhere. It all happens locally in your browser.
          </p>
          {airError && <p className="air-modal-error">{airError}</p>}
          <div className="air-modal-actions">
            <button id="air-modal-start" type="button" className="air-modal-start" onClick={startAirMode}>
              Start camera
            </button>
            <button id="air-modal-cancel" type="button" className="air-modal-cancel" onClick={closeAirModal}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
