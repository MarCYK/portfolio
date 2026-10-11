import { test, expect, describe, mock } from 'bun:test';

mock.module('@/data/words-index', () => ({
  wordsContent: {
    'post-b': `---
title: Post B
date: 'Mar 1, 2026'
---
Body B`,
    'post-a': `---
title: Post A
date: 'Jan 1, 2026'
---
Body A`,
    'untitled-post': `---
date: 'Feb 1, 2026'
---
Body without title`,
  },
}));

const { getAllPosts, getPostBySlug } = await import('@/data/posts');

describe('posts data layer', () => {
  test('getAllPosts returns all entries sorted by date descending', () => {
    const posts = getAllPosts();
    expect(posts).toHaveLength(3);
    expect(posts[0].title).toBe('Post B');
    expect(posts[1].title).toBe('untitled-post');
    expect(posts[2].title).toBe('Post A');
  });

  test('parsed posts carry no recent/archive type', () => {
    for (const post of getAllPosts()) {
      expect('type' in post).toBe(false);
    }
  });

  test('getPostBySlug returns parsed post with rendered html', () => {
    const post = getPostBySlug('post-b');
    expect(post).not.toBeNull();
    expect(post!.title).toBe('Post B');
    expect(post!.href).toBe('/words/post-b');
    expect(post!.contentHtml).toContain('Body B');
  });

  test('getPostBySlug returns null for unknown slug', () => {
    expect(getPostBySlug('does-not-exist')).toBeNull();
  });

  test('post without title falls back to slug as title', () => {
    const post = getPostBySlug('untitled-post');
    expect(post).not.toBeNull();
    expect(post!.title).toBe('untitled-post');
  });
});
