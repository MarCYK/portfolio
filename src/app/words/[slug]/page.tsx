import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleShell from '@/components/ArticleShell';
import { User, Calendar, Link as LinkIcon } from 'lucide-react';
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
    <ArticleShell
      title={post.title}
      meta={
        <>
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
        </>
      }
      backHref="/words"
      backLabel="Back to words"
    >
      <div
        className="prose-content"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </ArticleShell>
  );
}
