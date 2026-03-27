import type { Project } from '@/types';
import { Atom, BookOpen, Brain, Compass, Figma, FlaskConical, Globe, Instagram, Smile } from 'lucide-react';

export const currentProjects: Project[] = [
  {
    title: 'erebus.org',
    description: 'A cognition primitive.',
    date: 'March 2026',
    href: 'https://erebus.org',
    external: true,
    icon: <MoleculeIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'wvrk.org',
    description: 'A laboratory for experimental AI work.',
    date: 'February 2026',
    href: 'https://wvrk.org/',
    external: true,
    icon: <FlaskIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Milton',
    description: 'An LLM trained on Paradise Lost and nothing else.',
    date: 'February 2026',
    href: '/projects/milton',
    external: false,
    icon: <BookOpenIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
];

export const archiveProjects: Project[] = [
  {
    title: 'Work Library™',
    description: 'A curated collection of rare and interesting books, shared on Instagram and TikTok.',
    date: 'September 2023',
    href: 'https://www.instagram.com/worklibrary/',
    external: true,
    icon: <InstagramLogoIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Lissajous Curves',
    description: 'A Figma plugin for drawing Lissajous curves as live stroke vectors.',
    date: 'June 2023',
    href: 'https://www.figma.com/community/plugin/Lissajous-Curves',
    external: true,
    icon: <FigmaLogoIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Manufactured Human',
    description: 'A DALL·E powered exploration of our perceptions of reality, presented without context.',
    date: 'June 2022',
    href: 'https://manufacturedhuman.webflow.io/',
    external: true,
    icon: <GlobeIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Solipsism Wow!',
    description:
      "A marketing campaign to promote the joyful philosophical concept of Solipsism — the idea that only one's mind is sure to exist.",
    date: 'March 2022',
    href: 'https://solipsism.webflow.io/',
    external: true,
    icon: <BrainIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Roam By Land',
    description: 'An outdoor adventure journal documenting trips and time spent in nature.',
    date: 'June 2021',
    href: 'https://www.instagram.com/roambyland',
    external: true,
    icon: <CompassIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
  {
    title: 'Absurdly',
    description: 'Existentialism as a Service.',
    date: 'June 2020',
    href: '/projects/absurdly',
    external: false,
    icon: <SmileyIcon className="h-7 w-7" style={{ color: 'var(--text-secondary)' }} />,
  },
];
