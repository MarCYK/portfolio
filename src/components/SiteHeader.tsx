'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/data/navigation';
import { useCanvas } from '@/contexts/CanvasContext';
import { EMAIL } from '@/data/constants';
import { IconMarCYKLogo, IconEmail, IconHamburger } from './MarCYKIcons';
import { useTheme } from './header/ThemeToggle';
import ThemeToggle from './header/ThemeToggle';
import { useSound } from './header/SoundToggle';
import SoundToggle from './header/SoundToggle';
import CanvasToolbar from './header/CanvasToolbar';

export default function SiteHeader({ isHomePage = false }: { isHomePage?: boolean }) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();
  const { emit, on } = useCanvas();
  const [musicActive, setMusicActive] = useState(false);
  const [sunsetActive, setSunsetActive] = useState(false);
  const [noteHistory, setNoteHistory] = useState<string[]>([]);

  useEffect(() => {
    const unsubNote = on('notePlayed', (detail) => {
      setNoteHistory(prev => {
        const newHistory = [...prev, detail.note];
        return newHistory.slice(-4);
      });
    });
    const unsubMusic = on('musicToggle', (detail) => {
      setMusicActive(detail.active);
      if (!detail.active) {
        setNoteHistory([]);
      }
    });

    const unsubSunset = on('sunsetToggle', (detail) => {
      setSunsetActive(detail.active);
    });

    return () => {
      unsubNote();
      unsubMusic();

      unsubSunset();
    };
  }, [on]);

  const openMenu = () => {
    emit('menuToggle', undefined);
  };

  const handleThemeToggle = () => {
    if (sunsetActive) return;
    toggleTheme();
  };

  const showEmail = !musicActive;

  const iconBarContent = (
    <>
      {showEmail && (
        <a id="email-link" href={`mailto:${EMAIL}`} className="header-icon group" aria-label="Email">
          <IconEmail />
        </a>
      )}
      {musicActive && (
        <div className="flex items-center gap-2 px-2">
          <span
            id="header-chord"
            className="font-mono"
            style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: '500' }}
          >
            {noteHistory.join(' · ')}
          </span>
        </div>
      )}

      {isHomePage && <CanvasToolbar />}
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      <ThemeToggle isDark={isDark} onToggle={handleThemeToggle} disabled={sunsetActive} />
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
            <span className="marcyk-logo text-base font-semibold tracking-tight">MarCYK</span>
            <IconMarCYKLogo className="h-4" />
          </Link>
          <nav className="desktop-nav items-center gap-4 text-sm">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-link ${pathname === href || pathname.startsWith(`${href}/`) ? 'active' : ''}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <button
          id="menu-toggle"
          type="button"
          className="hamburger-btn header-icon md:hidden group"
          onClick={openMenu}
          aria-label="Open menu"
        >
          <IconHamburger />
        </button>

        <div id="icon-bar" className="icon-bar hidden items-center gap-3 md:flex">{iconBarContent}</div>
      </header>

      <div className="mobile-icon-bar">
        {iconBarContent}
      </div>
    </>
  );
}
