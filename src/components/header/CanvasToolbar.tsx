'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { useCanvas } from '@/contexts/CanvasContext';
import { IconMusic, IconPaint, IconCanvasClear } from '../MarCYKIcons';
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
  const [noteHistory, setNoteHistory] = useState<string[]>([]);

  const [canvasDirty, setCanvasDirty] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteRef = useRef<HTMLDivElement>(null);
  const songListRef = useRef<HTMLDivElement>(null);
  const infoRowRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsubscribers = [
      on('canvasDirty', (detail) => setCanvasDirty(detail.dirty)),
      on('musicToggle', (detail) => {
        setMusicActive(detail.active);
        if (!detail.active) setNoteHistory([]);
      }),
      on('songChanged', (detail) => setCurrentSongId(detail.songId)),
      on('notePlayed', (detail) => {
        setNoteHistory((prev) => [...prev, detail.note].slice(-4));
      }),

      on('sunsetToggle', (detail) => {
        if (!detail.active && paletteOpen) {
          setPaletteOpen(false);
          emit('paintToggle', { active: false });
        }
      }),
      on('paintToggle', (detail) => setPaletteOpen(detail.active)),
    ];

    return () => {
      unsubscribers.forEach((unsubscribe) => unsubscribe());
    };
  }, [on, emit, paletteOpen]);

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

  // Marquee overflow detection: only scroll when text is wider than its
  // container. Duration scales with text length so reading speed is
  // consistent across songs. Re-measures on song change, widget open,
  // and viewport resize (via ResizeObserver).
  useEffect(() => {
    if (!songListOpen) return;
    const infoRow = infoRowRef.current;
    const marquee = marqueeRef.current;
    if (!infoRow || !marquee) return;

    const measure = () => {
      const containerWidth = infoRow.clientWidth;
      if (containerWidth === 0) return;
      // Marquee contains two identical copies. Half the scroll width
      // is one copy — if that exceeds the container, text overflows.
      const copyWidth = marquee.scrollWidth / 2;
      if (copyWidth > containerWidth) {
        const duration = Math.max(4, Math.min(15, copyWidth / 40));
        marquee.style.setProperty('--marquee-duration', `${duration}s`);
        marquee.classList.add('marquee-scrolling');
      } else {
        marquee.classList.remove('marquee-scrolling');
      }
    };

    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(infoRow);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [songListOpen, currentSongId]);

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
      <div className={`music-wrapper relative flex items-center justify-center ${songListOpen ? 'music-focused' : ''}`} ref={songListRef}>
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

        {musicActive && noteHistory.length > 0 && (
          <span id="header-chord" className="song-notes">
            {noteHistory.join(' · ')}
          </span>
        )}

        <div id="song-list" className={`absolute bottom-full md:bottom-auto md:top-full right-0 pb-2 md:pb-0 md:pt-2 z-10 ${songListOpen ? '' : 'song-list-hidden'}`}>
          <div className="color-palette-inner song-widget">
            <div className="song-widget-info-row" ref={infoRowRef}>
              <span className="song-marquee" ref={marqueeRef}>
                <span className="song-title">{currentSong.title}</span>
                <span className="song-dot">·</span>
                <span className="song-artist">{currentSong.artist}</span>
                <span className="song-spacer" />
                <span className="song-title">{currentSong.title}</span>
                <span className="song-dot">·</span>
                <span className="song-artist">{currentSong.artist}</span>
                <span className="song-spacer" />
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
      </div>

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

      <div className="paint-wrapper relative flex items-center justify-center" ref={paletteRef}>
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
