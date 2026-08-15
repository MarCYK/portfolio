'use client';

import { useEffect, useState } from 'react';
import { useCanvas } from '@/contexts/CanvasContext';
import { IconSunset } from '../MarCYKIcons';

export default function SunsetToggle() {
  const { emit, resetPaintColor } = useCanvas();
  const [sunsetActive, setSunsetActive] = useState(false);

  // Sync from the body class on mount: the class survives SPA navigation
  // while this component remounts, so the button state would otherwise
  // desync from the actual sunset visuals.
  useEffect(() => {
    setSunsetActive(document.body.classList.contains('sunset-active'));
  }, []);

  const handleToggle = () => {
    const next = !sunsetActive;
    setSunsetActive(next);
    emit('sunsetToggle', { active: next });

    if (!next) {
      emit('canvasClear', undefined);
      resetPaintColor();
    }

    document.body.classList.toggle('sunset-active', next);
  };

  return (
    <button
      id="sunset-toggle"
      type="button"
      className={`header-icon has-tooltip ${sunsetActive ? 'active' : ''} group`}
      data-tooltip="Sunset"
      onClick={handleToggle}
      aria-label="Toggle sunset"
    >
      <IconSunset />
    </button>
  );
}
