'use client';

import { useEffect, useState } from 'react';
import { IconSound } from '../MarCYKIcons';
import { useCanvas } from '@/contexts/CanvasContext';
import { readSoundPreference } from '@/lib/audio';
import { writePreference } from '@/lib/storage';

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
    writePreference('sound', newEnabled ? 'on' : 'off');
    emit('soundToggle', { enabled: newEnabled });
  };

  return { soundEnabled, toggleSound };
}

export default function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      id="sound-toggle"
      type="button"
      className={`header-icon has-tooltip ${enabled ? 'active' : ''} group`}
      data-tooltip="Sound"
      onClick={onToggle}
      aria-label="Toggle sound"
    >
      <IconSound soundOn={enabled} />
    </button>
  );
}
