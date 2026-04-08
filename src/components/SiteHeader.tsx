'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, Menu } from 'lucide-react';
import { LogoDiamond } from './icons';
import { NAV_LINKS } from '@/data/navigation';
import { canvasEvents } from '@/lib/canvas-events';
import { EMAIL } from '@/data/constants';
import { useTheme } from './header/ThemeToggle';
import ThemeToggle from './header/ThemeToggle';
import { useSound } from './header/SoundToggle';
import SoundToggle from './header/SoundToggle';
import CanvasToolbar from './header/CanvasToolbar';

export default function SiteHeader({ isHomePage = false }: { isHomePage?: boolean }) {
  const pathname = usePathname();
  const { isDark, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();

  const openMenu = () => {
    canvasEvents.emit('menuToggle', undefined);
  };

  const iconBarContent = (
    <>
      <a href={`mailto:${EMAIL}`} className="header-icon" aria-label="Email Zachary">
        <Mail size={18} />
      </a>
      <span id="header-chord" className="hidden font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }} />
      {isHomePage && <CanvasToolbar />}
      <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
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
          <Menu size={20} />
        </button>

        <div className="icon-bar hidden items-center gap-3 md:flex">{iconBarContent}</div>
      </header>

      <div className="mobile-icon-bar">
        <Link href="/" className="header-icon" aria-label="Home">
          <Home size={20} />
        </Link>
        {iconBarContent}
      </div>
    </>
  );
}
