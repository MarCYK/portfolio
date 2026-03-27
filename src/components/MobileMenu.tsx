'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CaretRightIcon, CloseIcon, LogoDiamond } from './icons';
import { NAV_LINKS } from '@/data/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsOpen((open) => !open);
    window.addEventListener('menuToggle', handler);
    return () => window.removeEventListener('menuToggle', handler);
  }, []);

  const close = () => setIsOpen(false);

  return (
    <div id="mobile-menu" className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-header">
        <Link href="/" onClick={close} className="flex items-center gap-2">
          <span className="zach-logo text-base font-semibold tracking-tight">Zach</span>
          <LogoDiamond className="h-4" />
        </Link>
        <button className="header-icon" onClick={close} aria-label="Close menu">
          <CloseIcon />
        </button>
      </div>
      <nav className="mobile-menu-nav">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className="mobile-nav-link" onClick={close}>
            {label}
            <CaretRightIcon className="mobile-nav-caret" />
          </Link>
        ))}
      </nav>
    </div>
  );
}
