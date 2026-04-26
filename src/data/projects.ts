import type { Project } from '@/types';

export const currentProjects: Project[] = [
  {
    title: 'erebus.org',
    description: 'A cognition primitive.',
    date: 'March 2026',
    href: 'https://erebus.org',
    external: true,
    icon: 'atom',
  },
  {
    title: 'wvrk.org',
    description: 'A laboratory for experimental AI work.',
    date: 'February 2026',
    href: 'https://wvrk.org/',
    external: true,
    icon: 'flask',
  },
  {
    title: 'Milton',
    description: 'An LLM trained on Paradise Lost and nothing else.',
    date: 'February 2026',
    href: '/projects/milton',
    external: false,
    status: 'Prototype',
    content: [
      'Milton is a constrained language model experiment trained against a single literary source: Paradise Lost. The point is not breadth, but pressure. Restricting the corpus turns the model into a tool for style, voice, and interpretive distortion rather than general utility.',
      'This placeholder page exists to keep the internal project route stable while the fuller write-up is still in progress. The next pass should document the training setup, evaluation criteria, and what the constraint revealed about model behavior.',
    ],
    icon: 'book',
  },
];

export const archiveProjects: Project[] = [
  {
    title: 'Work Library™',
    description: 'A curated collection of rare and interesting books, shared on Instagram and TikTok.',
    date: 'September 2023',
    href: 'https://www.instagram.com/worklibrary/',
    external: true,
    icon: 'camera',
  },
  {
    title: 'Lissajous Curves',
    description: 'A Figma plugin for drawing Lissajous curves as live stroke vectors.',
    date: 'June 2023',
    href: 'https://www.figma.com/community/plugin/Lissajous-Curves',
    external: true,
    icon: 'pen',
  },
  {
    title: 'Manufactured Human',
    description: 'A DALL·E powered exploration of our perceptions of reality, presented without context.',
    date: 'June 2022',
    href: 'https://manufacturedhuman.webflow.io/',
    external: true,
    icon: 'globe',
  },
  {
    title: 'Solipsism Wow!',
    description:
      "A marketing campaign to promote the joyful philosophical concept of Solipsism — the idea that only one's mind is sure to exist.",
    date: 'March 2022',
    href: 'https://solipsism.webflow.io/',
    external: true,
    icon: 'brain',
  },
  {
    title: 'Roam By Land',
    description: 'An outdoor adventure journal documenting trips and time spent in nature.',
    date: 'June 2021',
    href: 'https://www.instagram.com/roambyland',
    external: true,
    icon: 'compass',
  },
  {
    title: 'Absurdly',
    description: 'Existentialism as a Service.',
    date: 'June 2020',
    href: '/projects/absurdly',
    external: false,
    status: 'Archived',
    content: [
      'Absurdly was a small philosophical brand experiment built around the idea of treating existentialism like a playful internet service. The work sat somewhere between satire, identity design, and cultural packaging.',
      'This placeholder page preserves the internal route and gives the project a stable home while the original assets and fuller retrospective are assembled.',
    ],
    icon: 'smile',
  },
];
