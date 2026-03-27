import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';

export default function ProjectCard({ title, description, date, href, external, icon }: Project) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="project-card group"
    >
      <div className="card-icon">{icon}</div>
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex items-center gap-2">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <ArrowUpRight
            size={14}
            className="shrink-0 -translate-x-0.5 -translate-y-0.5 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>
        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
        <p className="mt-auto text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {date}
        </p>
      </div>
    </a>
  );
}
