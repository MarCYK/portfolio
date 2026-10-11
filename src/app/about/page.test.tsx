import { expect, test, describe, mock } from 'bun:test';
import { render } from '@testing-library/react';
import AboutPage from './page';

// Mock PageShell
mock.module('@/components/PageShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('AboutPage', () => {
  test('renders the approved copy', () => {
    const { container } = render(<AboutPage />);
    const text = container.textContent ?? '';

    for (const expected of [
      'A retard in motion stays in motion',
      'NOW',
      'Mettler Toledo',
      'PSR B1919+21',
      'On Melancholy Hill',
    ]) {
      expect(text).toContain(expected);
    }
  });

  test('contains no stale draft copy', () => {
    const { container } = render(<AboutPage />);
    const text = container.textContent ?? '';

    for (const stale of ['Existentially ambiguous', 'Where Is My Mind', '527 note', 'CP 1919', 'Full Stack AI Engineer']) {
      expect(text).not.toContain(stale);
    }
  });
});
