'use client';

import { SunIcon, SidebarIcon } from '@/components/icons';

interface NavTabBarProps {
  isLightMode: boolean;
  isSidebarOpen: boolean;
  onLightModeToggle: () => void;
  onSidebarToggle: () => void;
}

export function NavTabBar({
  isLightMode,
  isSidebarOpen,
  onLightModeToggle,
  onSidebarToggle,
}: NavTabBarProps) {
  return (
    <nav className="c-gui__panel__header">
      <div className="c-gui__panel__header__tabs">
        <button className="c-gui__panel__header__tabs__tab c-gui__panel__header__tabs__tab--active">
          fine-thought.js
        </button>
      </div>
      <div className="c-gui__panel__header__actions">
        <button
          className={`c-gui__panel__header__button c-gui__panel__header__button--light-mode${isLightMode ? ' state-active' : ''}`}
          onClick={onLightModeToggle}
          aria-label="Toggle light mode"
        >
          <SunIcon />
        </button>
        <button
          className={`c-gui__panel__header__button c-gui__panel__header__button--sidebar${isSidebarOpen ? ' state-active' : ''}`}
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <SidebarIcon />
        </button>
      </div>
    </nav>
  );
}
