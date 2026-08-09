import matter from 'gray-matter';
import { marked } from 'marked';
import type { Post } from '@/types';
import { wordsContent } from '@/data/words-index';

export interface ExtendedPost extends Post {
  contentHtml?: string;
  type?: 'recent' | 'archive';
}

function parsePost(slug: string, raw: string): ExtendedPost {
  const matterResult = matter(raw);
  const { title, date, author, type } = matterResult.data;

  const parsedHtml = marked.parse(matterResult.content);
  const contentHtml = typeof parsedHtml === 'string' ? parsedHtml : '';

  return {
    href: `/words/${slug}`,
    title: title || slug,
    date: date || '',
    author: author,
    type: (type as 'recent' | 'archive') || 'recent',
    contentHtml,
  };
}

export function getAllPosts(): ExtendedPost[] {
  return Object.entries(wordsContent)
    .map(([slug, raw]) => parsePost(slug, raw))
    .sort((a, b) => (new Date(a.date) < new Date(b.date) ? 1 : -1));
}

export function getRecentPosts(): ExtendedPost[] {
  return getAllPosts().filter(post => post.type === 'recent');
}

export function getArchivePosts(): ExtendedPost[] {
  return getAllPosts().filter(post => post.type === 'archive');
}

export function getPostBySlug(slug: string): ExtendedPost | null {
  const raw = wordsContent[slug];
  if (!raw) return null;
  return parsePost(slug, raw);
}
