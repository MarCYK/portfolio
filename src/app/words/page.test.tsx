import { expect, test, describe, mock } from 'bun:test';
import { render } from '@testing-library/react';
import WordsPage from './page';
import { getAllPosts } from '@/data/posts';

// Mock PageShell
mock.module('@/components/PageShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('WordsPage', () => {
  test('renders all posts', () => {
    const { container } = render(<WordsPage />);
    const text = container.textContent ?? '';

    expect(container.querySelector('h1')?.textContent).toBe('Words');
    for (const post of getAllPosts()) {
      expect(text).toContain(post.title);
      expect(container.querySelector(`a.words-row[href="${post.href}"]`)).not.toBeNull();
    }
  });

  test('contains no archive section or subtitle', () => {
    const { container } = render(<WordsPage />);
    const text = container.textContent ?? '';

    for (const stale of ['Archive', 'Older thoughts preserved for posterity']) {
      expect(text).not.toContain(stale);
    }
  });
});
