import type { Metadata } from 'next';
import MobileMenu from '@/components/MobileMenu';
import ProjectCard from '@/components/ProjectCard';
import SiteFooter from '@/components/SiteFooter';
import SiteHeader from '@/components/SiteHeader';
import { currentProjects, archiveProjects } from '@/data/projects';

export const metadata: Metadata = {
  title: 'marcyk - Projects',
};

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <MobileMenu />
      <main id="scroll-root" className="flex flex-1 flex-col overflow-y-auto">
        <div className="flex-1 pb-20 sm:pb-24">
          <div className="work-grid-page px-6 sm:px-8">
            <header className="pb-10 pt-12 sm:pb-14 sm:pt-20">
              <h1 className="page-heading mb-3">
                Projects
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Things I&apos;ve built / building.</p>
            </header>

            <div className="project-grid">
              {currentProjects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>

            <div className="flex items-baseline gap-3 py-8 sm:py-12">
              <h2
                className="font-semibold tracking-tight"
                style={{ fontSize: '18px', color: 'var(--text-primary)', letterSpacing: '-0.025em' }}
              >
                Archive (2020–2023)
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Mostly nonsense preserved for posterity
              </span>
            </div>

            <div className="project-grid">
              {archiveProjects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
