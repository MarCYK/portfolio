'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useCanvas } from '@/contexts/CanvasContext';

function readSoundPreference(): boolean {
  if (typeof window === 'undefined') {
    return true;
  }

  try {
    const stored = localStorage.getItem('sound');
    if (stored === 'off' || stored === 'disabled') return false;
    return true;
  } catch {
    return true;
  }
}

export function useSound() {
  const { emit, on } = useCanvas();
  const [soundEnabled, setSoundEnabled] = useState(readSoundPreference);

  useEffect(() => {
    return on('soundToggle', (detail) => {
      setSoundEnabled(detail.enabled);
    });
  }, [on]);

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    try {
      localStorage.setItem('sound', newEnabled ? 'on' : 'off');
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
      className={`header-icon ${enabled ? 'active' : ''}`}
      onClick={onToggle}
      aria-label="Toggle sound"
    >
      {enabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
    </button>
  );
}
