import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import MobileMenu from '@/components/MobileMenu';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { getInternalProjectBySlug, getInternalProjectSlugs } from '@/data/projects';
import { ArrowLeft, Calendar } from 'lucide-react';

export function generateStaticParams() {
  return getInternalProjectSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = getInternalProjectBySlug(params.slug);
  return { title: project ? `marcyk - ${project.title}` : 'marcyk - Not Found' };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getInternalProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <>
      <SiteHeader />
      <MobileMenu />
      <main id="scroll-root" className="flex flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl flex-1 px-6 sm:px-8">
          <article className="pb-16 pt-12 lg:pt-20">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
              {project.icon}
            </div>

            <h1
              className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {project.title}
            </h1>

            <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {project.description}
            </p>

            <div
              className="mb-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm"
              style={{ color: 'var(--text-tertiary)' }}
            >
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
            </div>

            <div className="prose-content">
              {project.content.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </article>

          <hr style={{ borderColor: 'var(--border)' }} />

          <div className="py-8">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:opacity-80"
              style={{ color: 'var(--text-secondary)' }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to projects
            </Link>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}