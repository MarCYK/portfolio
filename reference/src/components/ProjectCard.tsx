import type { ReactNode } from 'react';
import { ArrowUpRightIcon } from './icons';

interface ProjectCardProps {
  title: string;
  description: string;
  date: string;
  href: string;
  external?: boolean;
  icon: ReactNode;
}

export default function ProjectCard({ title, description, date, href, external, icon }: ProjectCardProps) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="project-card group"
    >
      <div className="card-icon">
        {icon}
      </div>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <ArrowUpRightIcon
            className="w-3.5 h-3.5 shrink-0 opacity-0 -translate-y-0.5 -translate-x-0.5 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
        <p className="text-xs mt-auto" style={{ color: 'var(--text-tertiary)' }}>
          {date}
        </p>
      </div>
    </a>
  );
}
