import { test, expect, describe } from 'bun:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

// Bun's module mocks ('@/data/words-index', '@/data/posts') leak across test
// files that share a worker during `bun test src/`, which makes importing the
// data layer or the generated registry module unreliable here. Read the article
// and the registry from disk instead and run them through the same parsing
// stack the data layer uses. posts.test.ts covers the data layer itself.

const articlePath = fileURLToPath(
  new URL('../../data/words/spec-driven-development.md', import.meta.url),
);
const registryPath = fileURLToPath(
  new URL('../../data/words-registry.generated.ts', import.meta.url),
);

const raw = readFileSync(articlePath, 'utf8');
const { data, content } = matter(raw);
const parsed = marked.parse(content);
const contentHtml = typeof parsed === 'string' ? parsed : '';

describe('spec-driven-development article', () => {
  test('frontmatter carries the exact title and date', () => {
    expect(data.title).toBe('Spec-Driven Development');
    expect(data.date).toBe('Oct 11, 2026');
  });

  test('registry inlines the article for the words pages', () => {
    const registry = readFileSync(registryPath, 'utf8');
    expect(registry).toContain('"spec-driven-development"');
    expect(registry).toContain('Spec-Driven Development');
    expect(registry).toContain('Oct 11, 2026');
  });

  test('article renders meaningful HTML with headings', () => {
    expect(contentHtml).toContain('<h2');
  });

  test('article contains the concrete spec example', () => {
    expect(contentHtml).toContain('password reset');
    expect(contentHtml).toContain('Acceptance criteria');
    expect(contentHtml).toContain('Unhappy paths');
  });

  test('article covers testing limits and verification honestly', () => {
    expect(contentHtml).toContain('spec-kit');
    expect(contentHtml).toContain('Kani');
    expect(contentHtml).toContain('assumptions');
  });

  test('article uses straight quotes only', () => {
    expect(contentHtml).not.toMatch(/[\u201C\u201D\u2018\u2019]/);
    expect(raw).not.toMatch(/[\u201C\u201D\u2018\u2019]/);
  });
});
