import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/MobileMenu';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { UserIcon, CalendarIcon, LinkIcon, ArrowLeftIcon } from '@/components/icons';
import { recentPosts, archivePosts } from '@/data/posts';

const allPosts = [...recentPosts, ...archivePosts];

function getPostBySlug(slug: string) {
  return allPosts.find((p) => p.href === `/words/${slug}`) ?? null;
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = getPostBySlug(params.slug);
  return { title: post ? `marcyk - ${post.title}` : 'marcyk - Not Found' };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post || !post.content) notFound();

  return (
    <>
      <SiteHeader />
      <MobileMenu />
      <main id="scroll-root" className="flex flex-1 flex-col overflow-y-auto">
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
                  <UserIcon className="h-3.5 w-3.5" />
                  {post.author}
                </span>
              )}
              <span aria-hidden="true">&middot;</span>
              <span className="flex items-center gap-1.5">
                <CalendarIcon className="h-3.5 w-3.5" />
                {post.date}
              </span>
              <span aria-hidden="true">&middot;</span>
              <LinkIcon className="h-3.5 w-3.5" />
            </div>

            <div className="prose-content">
              {post.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </article>

          <hr style={{ borderColor: 'var(--border)' }} />

          <div className="py-8">
            <Link
              href="/words"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back to words
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
