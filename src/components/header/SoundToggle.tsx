'use client';

import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useCanvas } from '@/contexts/CanvasContext';

export function useSound() {
  const { emit } = useCanvas();
  const [soundEnabled, setSoundEnabled] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }
    try {
      return localStorage.getItem('sound') !== 'disabled';
    } catch {
      return true;
    }
  });

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    try {
      localStorage.setItem('sound', newEnabled ? 'enabled' : 'disabled');
    } catch {
      // Ignore persistence failures; in-memory state still updates.
    }
    emit('soundToggle', { enabled: newEnabled });
  };

  return { soundEnabled, toggleSound };
}

export default function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      id="sound-toggle"
      type="button"
      className="header-icon"
      onClick={onToggle}
      aria-label="Toggle sound"
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
