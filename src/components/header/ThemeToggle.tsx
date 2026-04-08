'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { canvasEvents } from '@/lib/canvas-events';

type ThemeMode = 'dark' | 'light';

export { type ThemeMode };

export function useTheme() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'light') {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const broadcastTheme = (theme: ThemeMode) => {
    canvasEvents.emit('themeChange', { theme });
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);

    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      broadcastTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      broadcastTheme('light');
    }
  };

  return { isDark, toggleTheme };
}

export default function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button id="theme-toggle" type="button" className="header-icon" onClick={onToggle} aria-label="Toggle theme">
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
