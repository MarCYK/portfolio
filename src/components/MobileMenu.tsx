'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconMarCYKLogo, IconMenuClose, IconNavCaret } from './MarCYKIcons';
import { NAV_LINKS } from '@/data/navigation';
import { useCanvas } from '@/contexts/CanvasContext';

export default function MobileMenu() {
  const { on } = useCanvas();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return on('menuToggle', () => setIsOpen((open) => !open));
  }, [on]);

  useEffect(() => {
    const canvas = document.getElementById('grid-canvas') as HTMLCanvasElement | null;

    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (canvas) {
      canvas.style.pointerEvents = isOpen ? 'none' : 'auto';
    }

    return () => {
      document.body.style.overflow = '';
      if (canvas) canvas.style.pointerEvents = 'auto';
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <div id="mobile-menu" className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-header">
        <Link href="/" onClick={close} aria-label="MarCYK — home" className="flex items-center">
          <IconMarCYKLogo className="h-6 marcyk-mark" />
        </Link>
        <button id="menu-close" className="header-icon" onClick={close} aria-label="Close menu">
          <IconMenuClose />
        </button>
      </div>
      <nav className="mobile-menu-nav">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className="mobile-nav-link" onClick={close}>
            {label}
            <IconNavCaret />
          </Link>
        ))}
      </nav>
    </div>
  );
}
