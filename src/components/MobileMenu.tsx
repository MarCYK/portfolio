'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogoDiamond } from './icons';
import { ChevronRight, X } from 'lucide-react';
import { NAV_LINKS } from '@/data/navigation';
import { useCanvas } from '@/contexts/CanvasContext';

export default function MobileMenu() {
  const { on } = useCanvas();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return on('menuToggle', () => setIsOpen((open) => !open));
  }, [on]);

  const close = () => setIsOpen(false);

  return (
    <div id="mobile-menu" className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      <div className="mobile-menu-header">
        <Link href="/" onClick={close} className="flex items-center gap-2">
          <span className="zach-logo text-base font-semibold tracking-tight">Zach</span>
          <LogoDiamond className="h-4" />
        </Link>
        <button className="header-icon" onClick={close} aria-label="Close menu">
          <X size={20} />
        </button>
      </div>
      <nav className="mobile-menu-nav">
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} className="mobile-nav-link" onClick={close}>
            {label}
            <ChevronRight className="mobile-nav-caret" size={18} />
          </Link>
        ))}
      </nav>
    </div>
  );
}
