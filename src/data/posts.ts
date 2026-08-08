import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import type { Post } from '@/types';

const wordsDirectory = path.join(process.cwd(), 'src/data/words');

export interface ExtendedPost extends Post {
  contentHtml?: string;
  type?: 'recent' | 'archive';
}

export function getAllPosts(): ExtendedPost[] {
  if (!fs.existsSync(wordsDirectory)) return [];
  
  const fileNames = fs.readdirSync(wordsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(wordsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      const matterResult = matter(fileContents);
      const { title, date, author, type } = matterResult.data;

      // marked.parse can be synchronous in this setup
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
    });

  return allPostsData.sort((a, b) => {
    return new Date(a.date) < new Date(b.date) ? 1 : -1;
  });
}

export function getRecentPosts(): ExtendedPost[] {
  return getAllPosts().filter(post => post.type === 'recent');
}

export function getArchivePosts(): ExtendedPost[] {
  return getAllPosts().filter(post => post.type === 'archive');
}

export function getPostBySlug(slug: string): ExtendedPost | null {
  const fullPath = path.join(wordsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  
  const parsedHtml = marked.parse(matterResult.content);
  const contentHtml = typeof parsedHtml === 'string' ? parsedHtml : '';

  return {
    href: `/words/${slug}`,
    title: matterResult.data.title || slug,
    date: matterResult.data.date || '',
    author: matterResult.data.author,
    type: (matterResult.data.type as 'recent' | 'archive') || 'recent',
    contentHtml,
  };
}
