import type { Metadata } from 'next';
import Link from 'next/link';
import PageShell from '@/components/PageShell';
import { ArrowRight } from 'lucide-react';
import { recentPosts, archivePosts } from '@/data/posts';
import type { Post } from '@/types';

export const metadata: Metadata = {
  title: 'marcyk - Words',
};

function WordsRow({ date, title, href }: Post) {
  return (
    <Link href={href} className="words-row group">
      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{date}</span>
      <span className="flex min-w-0 items-center">
        <span
          className="truncate text-sm font-medium underline-offset-2 transition-colors duration-200 group-hover:underline"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </span>
        <ArrowRight
          size={14}
          className="ml-4 shrink-0 -translate-x-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
          style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
        />
      </span>
    </Link>
  );
}

export default function WordsPage() {
  return (
    <PageShell>
        <div className="mx-auto flex w-full flex-1 flex-col px-6 sm:px-8" style={{ maxWidth: '80rem' }}>
          <div className="flex flex-1 flex-col gap-8 lg:flex-row lg:gap-0">
            <div className="shrink-0 pt-12 lg:w-1/4 lg:pr-12 lg:pt-20 xl:pr-24">
              <h1 className="page-heading mb-3">
                Words
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Thoughts and things.</p>
            </div>

            <div className="hidden w-px shrink-0 lg:block" style={{ borderLeft: '1px solid var(--border)' }} />

            <div className="flex-1 pb-16 pt-2 lg:pb-8 lg:pl-12 lg:pt-20 xl:pl-24">
              <div id="posts-list">
                <div className="words-row-header">
                  <span>Date</span>
                  <span>Title</span>
                </div>

                {recentPosts.map((post) => (
                  <WordsRow key={post.href} {...post} />
                ))}

                <div className="mt-12">
                  <h2
                    className="mb-4 flex flex-col gap-1 text-lg font-semibold tracking-tight sm:flex-row sm:items-baseline sm:gap-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Archive
                    <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                      (Older thoughts preserved for posterity)
                    </span>
                  </h2>
                  <div className="words-row-header">
                    <span>Date</span>
                    <span>Title</span>
                  </div>
                  {archivePosts.map((post) => (
                    <WordsRow key={post.href} {...post} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </PageShell>
  );
}
