import { expect, test, describe, mock } from 'bun:test';
import { render, screen } from '@testing-library/react';
import ArticleShell from '@/components/ArticleShell';

mock.module('@/components/PageShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

mock.module('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  )
}));

describe('ArticleShell', () => {
  test('renders title in an h1, meta content, back link, and children', () => {
    render(
      <ArticleShell
        title="Shell Title"
        meta={<span>meta-content</span>}
        backHref="/words"
        backLabel="Back to words"
      >
        <p>child-content</p>
      </ArticleShell>
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Shell Title' })).not.toBeNull();
    expect(screen.getByText('meta-content')).not.toBeNull();
    expect(screen.getByText('child-content')).not.toBeNull();

    const backLink = screen.getByRole('link', { name: 'Back to words' });
    expect(backLink.getAttribute('href')).toBe('/words');
  });
});
