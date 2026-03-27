'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BroadcastFillIcon,
  BroadcastOutlineIcon,
  EnvelopeFillIcon,
  EnvelopeOutlineIcon,
  HamburgerIcon,
  HomeOutlineIcon,
  LogoDiamond,
  MoonOutlineIcon,
  MusicNoteFillIcon,
  MusicNoteOutlineIcon,
  PaintBrushFillIcon,
  PaintBrushOutlineIcon,
  SpeakerFillIcon,
  SpeakerOutlineIcon,
  SpeakerSlashOutlineIcon,
  SunHorizonFillIcon,
  SunHorizonOutlineIcon,
  SunOutlineIcon,
  TrashOutlineIcon,
} from './icons';
import { NAV_LINKS } from '@/data/navigation';

export default function SiteHeader({ isHomePage = false }: { isHomePage?: boolean }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicActive, setMusicActive] = useState(false);
  const [discoActive, setDiscoActive] = useState(false);
  const [sunsetActive, setSunsetActive] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [canvasDirty, setCanvasDirty] = useState(false);
  const [activeSwatch, setActiveSwatch] = useState('default');
  const paletteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }

    const sound = localStorage.getItem('sound');
    if (sound === 'disabled') {
      setSoundEnabled(false);
    }
  }, []);

  useEffect(() => {
    const handler = (event: Event) => setCanvasDirty((event as CustomEvent).detail.dirty);
    window.addEventListener('canvasDirty', handler);
    return () => window.removeEventListener('canvasDirty', handler);
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

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);

    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    localStorage.setItem('sound', newEnabled ? 'enabled' : 'disabled');
    window.dispatchEvent(new CustomEvent('soundToggle', { detail: { enabled: newEnabled } }));
  };

  const toggleMusic = () => {
    const newActive = !musicActive;
    setMusicActive(newActive);
    window.dispatchEvent(new CustomEvent('musicToggle', { detail: { active: newActive } }));
  };

  const toggleDisco = () => {
    const newActive = !discoActive;
    setDiscoActive(newActive);
    window.dispatchEvent(new CustomEvent('discoToggle', { detail: { active: newActive } }));
  };

  const toggleSunset = () => {
    const newActive = !sunsetActive;
    setSunsetActive(newActive);
    window.dispatchEvent(new CustomEvent('sunsetToggle', { detail: { active: newActive } }));

    if (newActive) {
      document.body.classList.add('sunset-active');
    } else {
      document.body.classList.remove('sunset-active');
    }
  };

  const clearCanvas = () => {
    window.dispatchEvent(new CustomEvent('canvasClear'));
    setCanvasDirty(false);
  };

  const openMenu = () => {
    window.dispatchEvent(new CustomEvent('menuToggle'));
  };

  const swatches = [
    { color: 'default', background: 'linear-gradient(135deg, #fff 50%, #000 50%)' },
    { color: '#ef4444', background: '#ef4444' },
    { color: '#f97316', background: '#f97316' },
    { color: '#eab308', background: '#eab308' },
    { color: '#22c55e', background: '#22c55e' },
    { color: '#3b82f6', background: '#3b82f6' },
    { color: '#8b5cf6', background: '#8b5cf6' },
    { color: '#ec4899', background: '#ec4899' },
  ];

  const selectSwatch = (color: string) => {
    setActiveSwatch(color);
    window.dispatchEvent(new CustomEvent('colorChange', { detail: { color } }));
  };

  const iconBarContent = (
    <>
      <a href="mailto:zach@wvrk.org" className="header-icon" aria-label="Email Zachary">
        <EnvelopeOutlineIcon className="icon-outline" />
        <EnvelopeFillIcon className="icon-fill" />
      </a>
      <span id="header-chord" className="hidden font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
      {isHomePage && (
        <>
          <button
            id="music-toggle"
            type="button"
            className={`header-icon ${musicActive ? 'active' : ''}`}
            onClick={toggleMusic}
            aria-label="Toggle music"
          >
            <MusicNoteOutlineIcon className="icon-outline" />
            <MusicNoteFillIcon className="icon-fill" />
          </button>
          <button
            id="disco-toggle"
            type="button"
            className={`header-icon ${discoActive ? 'active' : ''}`}
            onClick={toggleDisco}
            aria-label="Toggle disco mode"
          >
            <BroadcastOutlineIcon className="icon-outline" />
            <BroadcastFillIcon className="icon-fill" />
          </button>
          <button
            id="sunset-toggle"
            type="button"
            className={`header-icon ${sunsetActive ? 'active' : ''}`}
            onClick={toggleSunset}
            aria-label="Toggle sunset mode"
          >
            <SunHorizonOutlineIcon className="icon-outline" />
            <SunHorizonFillIcon className="icon-fill" />
          </button>
          <div className="relative" ref={paletteRef}>
            <button
              type="button"
              className={`header-icon ${paletteOpen ? 'active' : ''}`}
              onClick={() => setPaletteOpen(!paletteOpen)}
              aria-label="Choose canvas color"
            >
              <PaintBrushOutlineIcon className="icon-outline" />
              <PaintBrushFillIcon className="icon-fill" />
            </button>
            <div id="color-palette" className={`color-palette ${paletteOpen ? '' : 'hidden'}`}>
              <div className="color-palette-inner">
                {swatches.map((swatch) => (
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
            <TrashOutlineIcon />
          </button>
        </>
      )}
      <button
        id="sound-toggle"
        type="button"
        className={`header-icon ${soundEnabled ? 'active' : ''}`}
        onClick={toggleSound}
        aria-label="Toggle sound"
      >
        {soundEnabled ? (
          <>
            <SpeakerOutlineIcon className="icon-outline" />
            <SpeakerFillIcon className="icon-fill" />
          </>
        ) : (
          <SpeakerSlashOutlineIcon />
        )}
      </button>
      <button id="theme-toggle" type="button" className="header-icon" onClick={toggleTheme} aria-label="Toggle theme">
        {isDark ? <SunOutlineIcon /> : <MoonOutlineIcon />}
      </button>
    </>
  );

  return (
    <>
      <header
        className={`header-nav flex flex-row items-center justify-between px-6 ${isHomePage ? 'home-page' : ''}`}
        style={{ paddingTop: '10px', paddingBottom: '10px' }}
      >
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="zach-logo text-base font-semibold tracking-tight">Zach</span>
            <LogoDiamond className="h-4" />
          </Link>
          <nav className="desktop-nav items-center gap-4 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className={`nav-link ${pathname === href ? 'active' : ''}`}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <button type="button" className="hamburger-btn header-icon md:hidden" onClick={openMenu} aria-label="Open menu">
          <HamburgerIcon />
        </button>

        <div className="icon-bar hidden items-center gap-3 md:flex">{iconBarContent}</div>
      </header>

      <div className="mobile-icon-bar">
        <Link href="/" className="header-icon" aria-label="Home">
          <HomeOutlineIcon />
        </Link>
        {iconBarContent}
      </div>
    </>
  );
}
