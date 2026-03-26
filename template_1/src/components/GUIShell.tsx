'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { NavTabBar } from '@/components/NavTabBar';

interface GUIShellProps {
  children: React.ReactNode;
  sidebarContent?: React.ReactNode;
}

interface ContextMenuState {
  x: number;
  y: number;
}

export function GUIShell({ children, sidebarContent }: GUIShellProps) {
  const [isLightMode, setIsLightMode] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Apply state-site-loaded after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      document.documentElement.classList.add('state-site-loaded');
    }, 100);
    return () => {
      clearTimeout(timer);
      document.documentElement.classList.remove('state-site-loaded');
    };
  }, []);

  // Apply light mode class
  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('state-light-mode');
    } else {
      document.documentElement.classList.remove('state-light-mode');
    }
  }, [isLightMode]);

  // Apply sidebar open class
  useEffect(() => {
    if (isSidebarOpen) {
      document.documentElement.classList.add('state-info-open');
    } else {
      document.documentElement.classList.remove('state-info-open');
    }
  }, [isSidebarOpen]);

  // Mouse / touch detection
  useEffect(() => {
    const handleMouseMove = () => {
      document.documentElement.classList.add('state-mouse-events');
    };
    const handleTouchStart = () => {
      document.documentElement.classList.remove('state-mouse-events');
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  // Context menu
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  return (
    <>
      {/* Site load cover */}
      <div className="c-cover" />

      {/* GUI shell */}
      <div className="c-gui" onContextMenu={handleContextMenu}>
        {/* Info sidebar panel */}
        <div className="c-gui__panel--info">
          {sidebarContent}
        </div>

        {/* Main panel */}
        <div className="c-gui__panel--main">
          {/* Tab bar */}
          <NavTabBar
            isLightMode={isLightMode}
            isSidebarOpen={isSidebarOpen}
            onLightModeToggle={() => setIsLightMode((v) => !v)}
            onSidebarToggle={() => setIsSidebarOpen((v) => !v)}
          />

          {/* Scrollable content */}
          <main className="c-gui__panel__content">
            <div className="c-page" ref={scrollRef}>
              <div className="c-page__inner">
                {/* Line numbers gutter */}
                <div className="c-page__lines-column">
                  {Array.from({ length: 120 }, (_, i) => (
                    <span key={i + 1} className="c-mono-type--line-nums">
                      {i + 1}
                    </span>
                  ))}
                </div>

                {/* Content column */}
                <div className="c-page__content-column">{children}</div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Context menu overlay + menu */}
      {contextMenu && (
        <>
          <div
            className="c-gui__context-menu-overlay"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9998,
            }}
            onClick={handleCloseContextMenu}
          />
          <div
            className="c-gui__context-menu"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <a href="/" className="c-gui__context-menu__item">
              / fine-thought.js
            </a>
            <a href="/profile" className="c-gui__context-menu__item">
              / profile.js
            </a>
            <a href="/contact" className="c-gui__context-menu__item">
              / contact.js
            </a>
          </div>
        </>
      )}
    </>
  );
}
