import { expect, test, describe, mock, afterAll } from 'bun:test';
import { render } from '@testing-library/react';
import * as projectsModule from '@/lib/projects';
import ProjectPage from './page';

// Mock Next.js navigation
mock.module('next/navigation', () => ({
  notFound: mock(() => { throw new Error('NEXT_NOT_FOUND'); })
}));

// Mock PageShell to skip SiteHeader, which needs CanvasProvider from the root layout
mock.module('@/components/PageShell', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

const SSRN_URL = 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5766993';
const BIM_URL = 'https://github.com/MarCYK/FYP_BIM_Model';
const SIGNMATE_URL = 'https://github.com/MarCYK/MySignMate';
const ROUTER_URL = 'https://github.com/MarCYK/zcode-model-router';
const BIM_API_URL = 'https://api.github.com/repos/MarCYK/FYP_BIM_Model';
const SIGNMATE_API_URL = 'https://api.github.com/repos/MarCYK/MySignMate';
const OCTOCAT_URL = 'https://github.com/octocat/Hello-World';
const OCTOCAT_API_URL = 'https://api.github.com/repos/octocat/Hello-World';
const GENERIC_URL = 'https://example.com/post';

const SSRN_OVERRIDE = {
  title: 'Transformer-Based Isolated Sign Language Recognition Pipeline with Mediapipe Hand-Pose Keypoints',
  description:
    'Co-authored SSRN preprint (not peer reviewed). Transformer ISLR pipeline on MediaPipe hand-pose keypoints; 99.41% on WLASL-100.',
};
const BIM_OVERRIDE = {
  title: 'MarCYK/FYP_BIM_Model',
  description: 'Jupyter notebook pipeline: MediaPipe keypoint extraction, LSTM / Transformer training, TorchScript export.',
};
const SIGNMATE_OVERRIDE = {
  title: 'MarCYK/MySignMate',
  description: 'Native Android app (Kotlin) for Malaysian Sign Language translation, running fully on-device.',
};

// Synthetic projects so the og-tag and GitHub-API paths are testable without touching projects.ts
const GENERIC_PROJECT = {
  title: 'Generic Project',
  date: '2026-01-01',
  status: '',
  icon: null,
  description: 'A project with a plain link.',
  content: [`See ${GENERIC_URL} for details.`],
};
const OCTOCAT_PROJECT = {
  title: 'Octocat Project',
  date: '2026-01-01',
  status: '',
  icon: null,
  description: 'A project with a plain GitHub link.',
  content: [`See ${OCTOCAT_URL} for details.`],
};
const CAMERA_PROJECT = {
  title: 'Synthetic Camera Project',
  date: '2026-01-01',
  status: '',
  icon: 'camera',
  description: 'A project exercising the icon chip.',
  content: ['No links, icon rendering only.'],
};

const SYNTHETIC_PROJECTS: Record<string, typeof GENERIC_PROJECT | typeof CAMERA_PROJECT> = {
  'generic-project': GENERIC_PROJECT,
  'octocat-project': OCTOCAT_PROJECT,
  'camera-project': CAMERA_PROJECT,
};

const realGetInternalProjectBySlug = projectsModule.getInternalProjectBySlug;
mock.module('@/lib/projects', () => ({
  getInternalProjectBySlug: (slug: string) =>
    realGetInternalProjectBySlug(slug) ?? SYNTHETIC_PROJECTS[slug] ?? null,
}));

const originalFetch = globalThis.fetch;
const requestedUrls: string[] = [];

afterAll(() => {
  globalThis.fetch = originalFetch;
});

function jsonResponse(body: unknown): Response {
  return { ok: true, json: async () => body } as unknown as Response;
}

function htmlResponse(html: string): Response {
  return { ok: true, text: async () => html } as unknown as Response;
}

function stubFetch(
  behaviors: Record<string, () => Response | Promise<Response>>,
  fallback: () => Response | Promise<Response>,
) {
  requestedUrls.length = 0;
  globalThis.fetch = mock(async (input: string) => {
    requestedUrls.push(input);
    return (behaviors[input] ?? fallback)();
  }) as unknown as typeof fetch;
}

const signmateRepo = () =>
  jsonResponse({ full_name: 'MarCYK/MySignMate', description: 'Malaysian Sign Language Translation App' });

const octocatRepo = () =>
  jsonResponse({ full_name: 'octocat/Hello-World', description: 'My first repository on GitHub!' });

describe('ProjectPage', () => {
  test('renders the approved MySignMate copy', async () => {
    stubFetch({ [SIGNMATE_API_URL]: signmateRepo }, () => jsonResponse({}));
    // In Next.js 16+, params is a Promise.
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'mysignmate' }) });
    const { container } = render(jsx);
    const text = container.textContent ?? '';

    for (const expected of [
      'MySignMate',
      'Universiti Malaya · Malaysian Federation of the Deaf',
      '2024',
      '95.8%',
      '7,098',
    ]) {
      expect(text).toContain(expected);
    }

    const metaRow = container.querySelector('div.flex.flex-wrap.items-center');
    expect(metaRow?.classList.contains('mb-8')).toBe(true);
  });

  test('renders the approved ZCode Model Router copy', async () => {
    stubFetch({}, () => Promise.reject(new Error('unexpected fetch')));
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'zcode-model-router' }) });
    const { container } = render(jsx);
    const text = container.textContent ?? '';

    for (const expected of [
      'ZCode Model Router',
      '2026',
      'GPL-3.0 · adapted from opencode-model-router v1.3',
      'ZCode plugin that routes each coding task to the right model',
      'my API bill got stupid',
      'measure twice, cut once',
      '$4.40 per million output tokens',
      'GLM-4.7-Flash',
      'UserPromptSubmit hook injects a protocol',
      '8/5/3 calls by default',
      '[cap: 4/8]',
      'testsPass, buildPasses, lintClean, fileExists',
      '86 commits so far',
    ]) {
      expect(text).toContain(expected);
    }

    expect(container.querySelector(`a[href="${ROUTER_URL}"]`)).not.toBeNull();
    expect(text).toContain('MarCYK/zcode-model-router');
  });

  test('renders no icon chip, even when the project data carries an icon key', async () => {
    stubFetch({}, () => jsonResponse({}));
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'camera-project' }) });
    const { container } = render(jsx);

    expect(container.querySelector('div.rounded-2xl')).toBeNull();
    expect(container.textContent).not.toContain('camera');
  });

  test('linkifies the three URLs as external anchors', async () => {
    stubFetch({ [SIGNMATE_API_URL]: signmateRepo }, () => jsonResponse({}));
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'mysignmate' }) });
    const { container } = render(jsx);

    for (const href of [SSRN_URL, BIM_URL, SIGNMATE_URL]) {
      const anchor = container.querySelector(`a[href="${href}"]`);
      expect(anchor).not.toBeNull();
      expect(anchor?.getAttribute('target')).toBe('_blank');
      expect(anchor?.getAttribute('rel')).toBe('noopener noreferrer');
    }
  });

  test('override URLs skip the network and win over fetchable data', async () => {
    stubFetch(
      {
        [SSRN_URL]: () => htmlResponse('<title>Fetched SSRN Title</title>'),
        [BIM_API_URL]: () => jsonResponse({ full_name: 'fetched/FYP_BIM_Model', description: 'Fetched description.' }),
        [SIGNMATE_API_URL]: signmateRepo,
      },
      () => Promise.reject(new Error('unexpected fetch')),
    );
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'mysignmate' }) });
    const { container } = render(jsx);
    const text = container.textContent ?? '';

    expect(text).toContain(SSRN_OVERRIDE.title);
    expect(text).toContain(SSRN_OVERRIDE.description);
    expect(text).toContain(BIM_OVERRIDE.title);
    expect(text).toContain(BIM_OVERRIDE.description);
    expect(text).toContain(SIGNMATE_OVERRIDE.title);
    expect(text).toContain(SIGNMATE_OVERRIDE.description);
    expect(text).not.toContain('papers.ssrn.com/sol3');
    expect(text).not.toContain('github.com/MarCYK');
    expect(text).not.toContain('Fetched SSRN Title');
    expect(text).not.toContain('fetched/FYP_BIM_Model');
    expect(text).not.toContain('Malaysian Sign Language Translation App');
    expect(requestedUrls).toEqual([]);
  });

  test('fetches repo metadata from the GitHub API for non-override GitHub URLs', async () => {
    stubFetch({ [OCTOCAT_API_URL]: octocatRepo }, () => Promise.reject(new Error('unexpected fetch')));
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'octocat-project' }) });
    const { container } = render(jsx);

    const card = container.querySelector(`a[href="${OCTOCAT_URL}"]`);
    expect(card?.textContent).toContain('octocat/Hello-World');
    expect(card?.textContent).toContain('My first repository on GitHub!');
    expect(requestedUrls).toContain(OCTOCAT_API_URL);
  });

  test('extracts og:title and og:description for generic URLs', async () => {
    stubFetch(
      {
        [GENERIC_URL]: () =>
          htmlResponse(
            '<html><head>' +
              '<meta property="og:title" content="Example Post Title">' +
              '<meta property="og:description" content="Example post description.">' +
              '</head><body></body></html>',
          ),
      },
      () => Promise.reject(new Error('unexpected fetch')),
    );
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'generic-project' }) });
    const { container } = render(jsx);

    const card = container.querySelector(`a[href="${GENERIC_URL}"]`);
    expect(card?.textContent).toContain('Example Post Title');
    expect(card?.textContent).toContain('Example post description.');
  });

  test('retries a failed fetch once and uses the recovered metadata', async () => {
    let calls = 0;
    stubFetch(
      {
        [OCTOCAT_API_URL]: () => {
          calls += 1;
          return calls === 1 ? Promise.reject(new Error('network down')) : octocatRepo();
        },
      },
      () => Promise.reject(new Error('unexpected fetch')),
    );
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'octocat-project' }), retryDelayMs: 0 });
    const { container } = render(jsx);

    expect(container.querySelector(`a[href="${OCTOCAT_URL}"]`)?.textContent).toContain('octocat/Hello-World');
    expect(requestedUrls.filter((url) => url === OCTOCAT_API_URL)).toHaveLength(2);
  });

  test('falls back to host labels when every fetch fails', async () => {
    stubFetch({}, () => Promise.reject(new Error('network down')));
    const jsx = await ProjectPage({ params: Promise.resolve({ slug: 'octocat-project' }), retryDelayMs: 0 });
    const { container } = render(jsx);

    expect(container.querySelector(`a[href="${OCTOCAT_URL}"]`)?.textContent).toContain('GitHub');
  });
});
