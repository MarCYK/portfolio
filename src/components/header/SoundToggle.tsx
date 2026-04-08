'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { canvasEvents } from '@/lib/canvas-events';

export function useSound() {
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const sound = localStorage.getItem('sound');
    if (sound === 'disabled') {
      setSoundEnabled(false);
    }
  }, []);

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    localStorage.setItem('sound', newEnabled ? 'enabled' : 'disabled');
    canvasEvents.emit('soundToggle', { enabled: newEnabled });
  };

  return { soundEnabled, toggleSound };
}

export default function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      id="sound-toggle"
      type="button"
      className={`header-icon ${enabled ? 'active' : ''}`}
      onClick={onToggle}
      aria-label="Toggle sound"
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
