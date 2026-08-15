import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ArticleShell from '@/components/ArticleShell';
import { getInternalProjectBySlug, getInternalProjectSlugs } from '@/lib/projects';
import { Calendar } from 'lucide-react';

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
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border" style={{ borderColor: 'var(--border)' }}>
        {project.icon}
      </div>

      <p className="mb-6 text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        {project.description}
      </p>

      <div className="prose-content">
        {project.content.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </ArticleShell>
  );
}
