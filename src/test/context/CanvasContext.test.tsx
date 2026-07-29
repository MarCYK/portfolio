import { test, expect, describe, beforeEach } from 'bun:test';
import { act, render } from '@testing-library/react';
import { CanvasProvider, useCanvas } from '../../contexts/CanvasContext';

// Probe component that exposes the context value so tests can assert on it.
function Probe({ onValue }: { onValue: (v: ReturnType<typeof useCanvas>) => void }) {
  const value = useCanvas();
  onValue(value);
  return null;
}

describe('008: CanvasContext — getPaintColor identity stability (regression)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('getPaintColor callback identity is stable across paintColor changes', () => {
    let captured: ReturnType<typeof useCanvas> | null = null;
    const capture = (v: ReturnType<typeof useCanvas>) => { captured = v; };

    const { rerender } = render(
      <CanvasProvider>
        <Probe onValue={capture} />
      </CanvasProvider>,
    );

    expect(captured).not.toBeNull();
    const initialGetPaintColor = captured!.getPaintColor;
    const initialPaintColor = captured!.paintColor;

    // Change paint color, which previously caused getPaintColor identity to change
    act(() => {
      captured!.setPaintColor('#ff0000');
    });

    rerender(
      <CanvasProvider>
        <Probe onValue={capture} />
      </CanvasProvider>,
    );

    expect(captured!.paintColor).toBe('#ff0000');
    expect(initialPaintColor).toBe(''); // sanity: started empty
    // REGRESSION: identity must NOT change when paintColor changes.
    expect(captured!.getPaintColor).toBe(initialGetPaintColor);
  });

  test('getPaintColor returns the latest paintColor value despite stable identity', () => {
    let captured: ReturnType<typeof useCanvas> | null = null;
    const capture = (v: ReturnType<typeof useCanvas>) => { captured = v; };

    const { rerender } = render(
      <CanvasProvider>
        <Probe onValue={capture} />
      </CanvasProvider>,
    );

    expect(captured!.getPaintColor()).toBe('');

    act(() => {
      captured!.setPaintColor('#00ff00');
    });
    rerender(
      <CanvasProvider>
        <Probe onValue={capture} />
      </CanvasProvider>,
    );

    // Stable identity, but the function still reads the current value.
    expect(captured!.getPaintColor()).toBe('#00ff00');
  });
});
