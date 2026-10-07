import type { Metadata } from 'next';
import PageShell from '@/components/PageShell';
import ProjectCard from '@/components/ProjectCard';
import type { Project } from '@/types';
import { workProjects, personalProjects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'marcyk - Projects',
};

const COLUMNS_MD = 2;
const COLUMNS_LG = 3;

function ghostSpan(n: number, columns: number): number {
  if (n >= columns) {
    const remainder = n % columns;
    return remainder >= 2 ? columns - remainder : 0;
  }
  return columns - n;
}

export type ProjectGridGhost = {
  count: 0 | 1;
  classes: string;
};

export type ProjectGridLayout = {
  cardClasses: string[];
  ghost: ProjectGridGhost;
  stretchMd: boolean;
  stretchLg: boolean;
};

export function getProjectGridLayout(n: number): ProjectGridLayout {
  const stretchMd = n > COLUMNS_MD && n % COLUMNS_MD === 1;
  const stretchLg = n > COLUMNS_LG && n % COLUMNS_LG === 1;
  const spanMd = ghostSpan(n, COLUMNS_MD);
  const spanLg = ghostSpan(n, COLUMNS_LG);

  const cardClasses = Array.from({ length: n }, (_, index) => {
    if (index !== n - 1) return '';
    if (stretchMd && stretchLg) return 'md:col-span-2 lg:col-span-3';
    if (stretchMd) return 'md:col-span-2 lg:col-span-1';
    if (stretchLg) return 'lg:col-span-3';
    return '';
  });

  const ghostClasses: string[] = [];
  if (spanMd > 0 || spanLg > 0) {
    ghostClasses.push('hidden');
    if (spanMd > 0) {
      ghostClasses.push('md:flex');
      if (spanMd === 2) ghostClasses.push('md:col-span-2');
    }
    if (spanLg > 0) {
      ghostClasses.push('lg:flex');
      if (spanLg === 2) ghostClasses.push('lg:col-span-2');
      if (spanLg === 3) ghostClasses.push('lg:col-span-3');
    }
  }

  return {
    cardClasses,
    ghost: { count: ghostClasses.length > 0 ? 1 : 0, classes: ghostClasses.join(' ') },
    stretchMd,
    stretchLg,
  };
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  const { ghost, stretchMd, stretchLg } = getProjectGridLayout(projects.length);

  return (
    <div
      className="project-grid"
      data-n={projects.length}
      data-stretch-md={stretchMd ? 'true' : undefined}
      data-stretch-lg={stretchLg ? 'true' : undefined}
    >
      {projects.map((project) => (
        <ProjectCard key={project.title} {...project} />
      ))}
      {ghost.count === 1 && (
        <div className={`project-grid-ghost ${ghost.classes}`}>
          more to come…
        </div>
      )}
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <PageShell>
        <div className="flex-1 pb-20 sm:pb-24">
          <div className="work-grid-page px-6 sm:px-8">
            <header className="pb-10 pt-12 sm:pb-14 sm:pt-20">
              <h1 className="page-heading mb-3">
                Projects
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Things I&apos;ve built / building.</p>
            </header>

            <div className="flex items-baseline gap-3 pb-8 sm:pb-12">
              <h2
                className="font-semibold tracking-tight"
                style={{ fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
              >
                On the clock
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Things I ship for the day job</p>
            </div>

            <ProjectGrid projects={workProjects} />

            <div className="flex items-baseline gap-3 py-8 sm:py-12">
              <h2
                className="font-semibold tracking-tight"
                style={{ fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
              >
                On my spare time
              </h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Things I build for myself</p>
            </div>

            <ProjectGrid projects={personalProjects} />
          </div>
        </div>
    </PageShell>
  );
}
