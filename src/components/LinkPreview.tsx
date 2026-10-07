import { ArrowUpRight } from 'lucide-react';

type LinkMeta = {
  title?: string | null;
  description?: string | null;
};

const HOST_LABELS: Record<string, string> = {
  'github.com': 'GitHub',
  'papers.ssrn.com': 'SSRN',
};

function parseUrl(url: string): URL | null {
  try {
    return new URL(url);
  } catch {
    return null;
  }
}

export default function LinkPreview({ url, meta = null }: { url: string; meta?: LinkMeta | null }) {
  const parsed = parseUrl(url);
  if (!parsed) {
    return (
      <a href={url} className="underline" style={{ color: 'var(--accent)' }}>
        {url}
      </a>
    );
  }

  const host = parsed.hostname.replace(/^www\./, '');
  const title = meta?.title ?? HOST_LABELS[host] ?? host;
  const description = meta?.description ?? null;

  return (
    <span className="my-4 block">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-block w-full rounded border border-[color:var(--border-visible)] p-4 transition-colors hover:border-[color:var(--accent)]"
        style={{
          backgroundColor: 'var(--bg)',
          borderRadius: 'var(--radius-component)',
        }}
      >
        <span className="flex items-center gap-3">
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium leading-snug line-clamp-2" style={{ color: 'var(--text-primary)' }}>
              {title}
            </span>
            {description && (
              <span className="mt-1 line-clamp-2 block text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </span>
            )}
          </span>
          <ArrowUpRight
            size={18}
            className="shrink-0 text-[color:var(--text-tertiary)] transition-colors group-hover:text-[color:var(--accent)]"
          />
        </span>
      </a>
    </span>
  );
}
