import { expect, test, describe, mock } from 'bun:test';
import { render } from '@testing-library/react';
import PostPage from './page';
import * as posts from '@/data/posts';
import * as navigation from 'next/navigation';

// Mock Next.js navigation
mock.module('next/navigation', () => ({
  notFound: mock(() => { throw new Error('NEXT_NOT_FOUND'); })
}));

// Mock posts data
mock.module('@/data/posts', () => ({
  getPostBySlug: mock((slug: string) => {
    if (slug === 'test-post') {
      return { title: 'Test Post', contentHtml: '<p>Test Content</p>', date: '2026', author: 'MarCYK' };
    }
    return null;
  })
}));

describe('PostPage', () => {
  test('unwraps params Promise correctly', async () => {
    // In Next.js 16+, params is a Promise.
    const params = Promise.resolve({ slug: 'test-post' });
    
    // @ts-expect-error - Simulating Next.js passing a Promise for params
    const jsx = await PostPage({ params });
    
    const { getByText } = render(jsx);
    expect(getByText('Test Post')).not.toBeNull();
  });
});
