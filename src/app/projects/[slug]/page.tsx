import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleShell from '@/components/ArticleShell';
import LinkPreview from '@/components/LinkPreview';
import { getInternalProjectBySlug } from '@/lib/projects';
import { Calendar } from 'lucide-react';

type LinkMeta = { title: string; description: string | null };

// SSRN sits behind Cloudflare antibot (403 for every scraper) and the FYP repo's GitHub
// description is null, so these hand-verified values win outright and skip the network.
// MySignMate resolves fine via the API locally, but this page renders at request time on
// Cloudflare and unauthenticated api.github.com calls from worker egress IPs hit shared-IP
// rate limits, so it rides the override too.
const LINK_META_OVERRIDES: Record<string, LinkMeta> = {
  'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5766993': {
    title: 'Transformer-Based Isolated Sign Language Recognition Pipeline with Mediapipe Hand-Pose Keypoints',
    description:
      'Co-authored SSRN preprint (not peer reviewed). Transformer ISLR pipeline on MediaPipe hand-pose keypoints; 99.41% on WLASL-100.',
  },
  'https://github.com/MarCYK/FYP_BIM_Model': {
    title: 'MarCYK/FYP_BIM_Model',
    description: 'Jupyter notebook pipeline: MediaPipe keypoint extraction, LSTM / Transformer training, TorchScript export.',
  },
  'https://github.com/MarCYK/MySignMate': {
    title: 'MarCYK/MySignMate',
    description: 'Native Android app (Kotlin) for Malaysian Sign Language translation, running fully on-device.',
  },
  'https://github.com/MarCYK/zcode-model-router': {
    title: 'MarCYK/zcode-model-router',
    description: 'ZCode plugin for automatic model-tier delegation (fast/medium/heavy)',
  },
};

const GITHUB_REPO_URL = /^https:\/\/github\.com\/([^/]+)\/([^/?#]+)/;

function ogContent(html: string, property: string): string | null {
  const tag = html.match(new RegExp(`<meta[^>]+${property}[^>]*>`, 'i'))?.[0];
  return tag?.match(/content=["']([^"']*)["']/i)?.[1]?.trim() ?? null;
}

async function fetchGithubRepoMeta(owner: string, repo: string): Promise<LinkMeta | null> {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    const json: { full_name?: string; description?: string | null } = await response.json();
    if (!json.full_name) return null;
    return { title: json.full_name, description: json.description ?? null };
  } catch {
    return null;
  }
}

async function fetchHtmlMeta(url: string): Promise<LinkMeta | null> {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; portfolio-build)' },
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) return null;
    const html = await response.text();
    const title = ogContent(html, 'og:title') ?? html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? null;
    if (!title) return null;
    return { title, description: ogContent(html, 'og:description') };
  } catch {
    return null;
  }
}

async function fetchLinkMeta(url: string, retryDelayMs: number): Promise<LinkMeta | null> {
  const githubMatch = url.match(GITHUB_REPO_URL);
  const attempt = () => (githubMatch ? fetchGithubRepoMeta(githubMatch[1], githubMatch[2]) : fetchHtmlMeta(url));

  const meta = await attempt();
  if (meta !== null) return meta;
  await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
  return attempt();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getInternalProjectBySlug(slug);
  return { title: project ? `marcyk - ${project.title}` : 'marcyk - Not Found' };
}

export default async function ProjectPage({
  params,
  retryDelayMs = 600,
}: {
  params: Promise<{ slug: string }>;
  retryDelayMs?: number;
}) {
  const { slug } = await params;
  const project = getInternalProjectBySlug(slug);
  if (!project) notFound();

  const urls = [...new Set(project.content.flatMap((paragraph) => paragraph.match(/(https?:\/\/[^\s)]+)/g) ?? []))];

  // Sequential on purpose: fetching these in parallel trips upstream rate limits (GitHub 429s).
  const metaMap: Record<string, LinkMeta | null> = {};
  for (const url of urls) {
    metaMap[url] = LINK_META_OVERRIDES[url] ?? (await fetchLinkMeta(url, retryDelayMs));
  }

  return (
    <ArticleShell
      title={project.title}
      meta={
        <>
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {project.date}
          </span>
          {project.status && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{project.status}</span>
            </>
          )}
        </>
      }
      backHref="/projects"
      backLabel="Back to projects"
    >
      <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {project.description}
      </p>

      <div className="prose-content">
        {project.content.map((paragraph, index) => (
          <p key={index}>
            {paragraph.split(/(https?:\/\/[^\s)]+)/g).map((segment, segmentIndex) =>
              segment.startsWith('http') ? (
                <LinkPreview key={segmentIndex} url={segment} meta={metaMap[segment] ?? null} />
              ) : (
                segment
              ),
            )}
          </p>
        ))}
      </div>
    </ArticleShell>
  );
}
