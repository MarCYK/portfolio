'use client';

import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '../MarCYKIcons';
import { useCanvas } from '@/contexts/CanvasContext';

type ThemeMode = 'dark' | 'light';

export { type ThemeMode };

export function useTheme() {
  const { emit } = useCanvas();
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    try {
      return localStorage.getItem('theme') !== 'light';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    document.documentElement.style.backgroundColor = isDark ? '#0a0a0a' : '#fff';
  }, [isDark]);

  const broadcastTheme = (theme: ThemeMode) => {
    emit('themeChange', { theme });
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);

    if (newDark) {
      try {
        localStorage.setItem('theme', 'dark');
      } catch {
        // Ignore persistence failures; UI state still updates.
      }
      broadcastTheme('dark');
    } else {
      try {
        localStorage.setItem('theme', 'light');
      } catch {
        // Ignore persistence failures; UI state still updates.
      }
      broadcastTheme('light');
    }
  };

  return { isDark, toggleTheme };
}

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export default function ThemeToggle({ isDark, onToggle, disabled = false }: ThemeToggleProps) {
  return (
    <button
      id="theme-toggle"
      type="button"
      className={`header-icon ${disabled ? 'disabled' : ''} group`}
      onClick={onToggle}
      aria-label="Toggle theme"
      aria-disabled={disabled}
      disabled={disabled}
    >
      {isDark ? <IconSun /> : <IconMoon />}
    </button>
  );
}
