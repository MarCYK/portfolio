import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import PageShell from '@/components/PageShell';

interface ArticleShellProps {
  title: string;
  meta: ReactNode;
  backHref: string;
  backLabel: string;
  children: ReactNode;
}

export default function ArticleShell({ title, meta, backHref, backLabel, children }: ArticleShellProps) {
  return (
    <PageShell>
        <div className="mx-auto w-full max-w-2xl flex-1 px-6 sm:px-8">
          <article className="pb-16 pt-12 lg:pt-20">
            <h1
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h1>

            <div
              className="mb-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {meta}
            </div>

            {children}
          </article>

          <hr style={{ borderColor: 'var(--border)' }} />

          <div className="py-8">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              {backLabel}
            </Link>
          </div>
        </div>
    </PageShell>
  );
}
