import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageShell from '@/components/PageShell';
import { User, Calendar, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { getPostBySlug } from '@/data/posts';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return { title: post ? `marcyk - ${post.title}` : 'marcyk - Not Found' };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || !post.contentHtml) notFound();

  return (
    <PageShell>
        <div className="mx-auto w-full max-w-2xl flex-1 px-6 sm:px-8">
          <article className="pb-16 pt-12 lg:pt-20">
            <h1
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {post.title}
            </h1>

            <div
              className="mb-12 flex flex-wrap items-center gap-x-3 text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
              {post.author && (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {post.author}
                </span>
              )}
              <span aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span aria-hidden="true">&middot;</span>
              <LinkIcon className="h-3.5 w-3.5" />
            </div>

            <div 
              className="prose-content" 
              dangerouslySetInnerHTML={{ __html: post.contentHtml }} 
            />
          </article>

          <hr style={{ borderColor: 'var(--border)' }} />

          <div className="py-8">
            <Link
              href="/words"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to words
            </Link>
          </div>
        </div>
    </PageShell>
  );
}
