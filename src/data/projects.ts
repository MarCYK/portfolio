import type { Project } from '@/types';

export const currentProjects: Project[] = [
  {
    title: 'ChatMT Agent',
    description: 'An enterprise conversational AI agent built for Mettler Toledo to automate complex domain-specific tasks.',
    date: 'Present',
    href: '#',
    external: true,
    icon: 'brain',
  },
  {
    title: 'Malaysian Sign Language App',
    description: 'A mobile app built with MFD utilizing LSTM networks to translate over 100 Malaysian Sign Language gestures with 93% accuracy.',
    date: '2025',
    href: '#',
    external: true,
    icon: 'smile',
  },
];

export const archiveProjects: Project[] = [];
