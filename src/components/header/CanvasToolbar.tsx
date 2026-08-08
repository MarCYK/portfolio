'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Disc3 } from 'lucide-react';
import { useCanvas } from '@/contexts/CanvasContext';
import { IconMusic, IconSunset, IconPaint, IconCanvasClear } from '../MarCYKIcons';
import { SONGS, DEFAULT_SONG_ID } from '@/lib/songs';

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
  const [songListOpen, setSongListOpen] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(DEFAULT_SONG_ID);

  const [sunsetActive, setSunsetActive] = useState(false);
  const [canvasDirty, setCanvasDirty] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  const songListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribers = [
      on('canvasDirty', (detail) => setCanvasDirty(detail.dirty)),
      on('musicToggle', (detail) => setMusicActive(detail.active)),
      on('songChanged', (detail) => setCurrentSongId(detail.songId)),

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

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!songListRef.current) return;
      if (songListRef.current.offsetParent === null) return;

      if (!songListRef.current.contains(event.target as Node)) {
        if (songListOpen) {
          setSongListOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [songListOpen]);

  const ensureSoundOn = () => {
    emit('soundToggle', { enabled: true });
    try {
      localStorage.setItem('sound', 'on');
    } catch {
      // Ignore persistence failures; event bus still updates in-memory state.
    }
  };

  const toggleMusic = () => {
    const next = !songListOpen;
    setSongListOpen(next);
    if (next && paletteOpen) {
      setPaletteOpen(false);
      emit('paintToggle', { active: false });
    }
  };

  const currentSong = SONGS.find((s) => s.id === currentSongId) ?? SONGS[0];
  const currentIdx = SONGS.findIndex((s) => s.id === currentSongId);

  const prevSong = () => {
    const prev = SONGS[(currentIdx - 1 + SONGS.length) % SONGS.length];
    emit('songSelect', { songId: prev.id });
  };

  const nextSong = () => {
    const next = SONGS[(currentIdx + 1) % SONGS.length];
    emit('songSelect', { songId: next.id });
  };

  const togglePlay = () => {
    emit('musicToggle', { active: !musicActive });
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
    if (next && songListOpen) {
      setSongListOpen(false);
    }
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
      <div className="music-wrapper relative flex items-center justify-center" ref={songListRef}>
        <div id="song-list" className={`absolute bottom-full md:bottom-auto md:top-full right-0 pb-2 md:pb-0 md:pt-2 z-10 ${songListOpen ? '' : 'song-list-hidden'}`}>
          <div className="color-palette-inner song-widget">
            <Disc3 size={36} className={`song-disk ${musicActive ? 'spinning' : ''}`} />
            <div className="song-widget-info-row">
              <span className="song-marquee">
                <span className="song-title">{currentSong.title}</span>
                <span className="song-dot">·</span>
                <span className="song-artist">{currentSong.artist}</span>
              </span>
            </div>
            <div className="song-widget-controls">
              <button
                type="button"
                className="song-nav-btn"
                onClick={prevSong}
                aria-label="Previous song"
              >
                <SkipBack size={13} />
              </button>
              <button
                type="button"
                className="song-play-btn"
                onClick={togglePlay}
                aria-label={musicActive ? 'Pause' : 'Play'}
              >
                {musicActive ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button
                type="button"
                className="song-nav-btn"
                onClick={nextSong}
                aria-label="Next song"
              >
                <SkipForward size={13} />
              </button>
            </div>
          </div>
        </div>

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
      </div>

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
