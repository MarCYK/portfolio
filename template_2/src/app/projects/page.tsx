import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import MobileMenu from '@/components/MobileMenu';
import SiteFooter from '@/components/SiteFooter';
import ProjectCard from '@/components/ProjectCard';
import {
  MoleculeIcon,
  FlaskIcon,
  BookOpenIcon,
  InstagramLogoIcon,
  FigmaLogoIcon,
  GlobeIcon,
  BrainIcon,
  CompassIcon,
  SmileyIcon,
} from '@/components/icons';

export const metadata: Metadata = {
  title: 'zchry - Projects',
};

const currentProjects = [
  {
    title: 'erebus.org',
    description: 'A cognition primitive.',
    date: 'March 2026',
    href: 'https://erebus.org',
    external: true,
    icon: <MoleculeIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'wvrk.org',
    description: 'A laboratory for experimental AI work.',
    date: 'February 2026',
    href: 'https://wvrk.org/',
    external: true,
    icon: <FlaskIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Milton',
    description: 'An LLM trained on Paradise Lost and nothing else.',
    date: 'February 2026',
    href: '/projects/milton',
    external: false,
    icon: <BookOpenIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
];

const archiveProjects = [
  {
    title: 'Work Library™',
    description: 'A curated collection of rare and interesting books, shared on Instagram and TikTok.',
    date: 'September 2023',
    href: 'https://www.instagram.com/worklibrary/',
    external: true,
    icon: <InstagramLogoIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Lissajous Curves',
    description: 'A Figma plugin for drawing Lissajous curves as live stroke vectors.',
    date: 'June 2023',
    href: 'https://www.figma.com/community/plugin/Lissajous-Curves',
    external: true,
    icon: <FigmaLogoIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Manufactured Human',
    description: 'A DALL·E powered exploration of our perceptions of reality, presented without context.',
    date: 'June 2022',
    href: 'https://manufacturedhuman.webflow.io/',
    external: true,
    icon: <GlobeIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Solipsism Wow!',
    description:
      "A marketing campaign to promote the joyful philosophical concept of Solipsism — the idea that only one's mind is sure to exist.",
    date: 'March 2022',
    href: 'https://solipsism.webflow.io/',
    external: true,
    icon: <BrainIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Roam By Land',
    description: 'An outdoor adventure journal documenting trips and time spent in nature.',
    date: 'June 2021',
    href: 'https://www.instagram.com/roambyland',
    external: true,
    icon: <CompassIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Absurdly',
    description: 'Existentialism as a Service.',
    date: 'June 2020',
    href: '/projects/absurdly',
    external: false,
    icon: <SmileyIcon className="w-7 h-7" style={{ color: 'var(--text-secondary)' }} />,
  },
];

export default function ProjectsPage() {
  return (
    <>
      <SiteHeader />
      <MobileMenu />
      <main id="scroll-root" className="flex-1 overflow-y-auto flex flex-col">
        <div className="flex-1 pb-20 sm:pb-24">
          <div className="work-grid-page px-6 sm:px-8">
            <header className="pt-12 sm:pt-20 pb-10 sm:pb-14">
              <h1
                className="tracking-tight font-semibold mb-3"
                style={{ fontSize: '30px', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}
              >
                Projects
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Things I&apos;ve built / building.
              </p>
            </header>

            {/* Current projects */}
            <div className="project-grid">
              {currentProjects.map((project) => (
                <ProjectCard key={project.title} {...project} />
              ))}
            </div>

            {/* Archive header */}
            <div className="py-8 sm:py-12 flex items-baseline gap-3">
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

            {/* Archive grid */}
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
