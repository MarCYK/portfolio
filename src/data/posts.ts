import type { Post } from '@/types';

export const recentPosts: Post[] = [
  {
    date: 'Mar 24, 2026',
    title: 'On Researching with LLMs',
    href: '/words/on-researching-with-llms',
    // TODO: Replace with MarCYK branding
    author: 'Zachary',
    content: [
      "It's well known that LLMs like to hallucinate. Taken to extremes, they will lovingly hallucinate around other hallucinations, probably your own. Amidst the hallucinations, they become increasingly sycophantic. They will validate you, they will praise you, they will convince you that you're both wonderful.",
      "There's also perhaps an even more sinister version of this: LLMs will hallucinate around something real. When high abstraction concepts become difficult to articulate, the machine won't save you. It will pull you in whatever direction the words you've given it take you. Then the feedback loop starts. You've made measurable progress, you relax a little on the objective baselines, you keep pushing further and further. The machine rewards your research, part of it is real! Validated, over and over and over. You've both let down your guard, there's no adult in the room.",
      "Then, 48 hours later, you ask a simple question that breaks the illusion. Suddenly, you realize you've been chasing a hallucination the machine gave you when the conceptual abstractions became too much for it to bear. Which is where it gets sinister, because if you unknowingly have something real, you'll dismiss it completely. The instinct becomes to just walk away.",
      "The machine can't guide you in this nuanced abstraction. You're on the edge of something, and LLMs don't see success as a balancing act: success is over the edge, where something concrete exists. And then you can't really get up from that.",
    ],
  },
  { date: 'Feb 27, 2026', title: "It's Been Awhile", href: '/words/hi-again' },
];

export const archivePosts: Post[] = [
  { date: 'Oct 15, 2023', title: 'I Know Nothing', href: '/words/i-know-nothing' },
  {
    date: 'Jun 10, 2023',
    title: 'Quantum Leap: An Ongoing Game of Self-Interrogation',
    href: '/words/questioning-my-quantum-leap-an-ongoing-game-of-self-interrogation',
  },
  { date: 'Jun 8, 2023', title: 'Building a Brand Identity With Code', href: '/words/building-a-brand-identity-with-code' },
  {
    date: 'Jun 6, 2023',
    title: 'Objectively Evolving Your Own Subjectivity',
    href: '/words/objectively-evolving-your-own-subjectivity',
  },
  {
    date: 'Jun 2, 2023',
    title: 'LLMs Helped Me Understand How I Work',
    href: '/words/chatgpt-helped-me-realize-how-i-work',
  },
  {
    date: 'Feb 20, 2023',
    title: 'On AI, the Internet, and Everything In-Between',
    href: '/words/on-ai-the-internet-and-everything-in-between',
  },
  { date: 'Jan 5, 2023', title: 'The Revision Hole', href: '/words/revision-hole' },
];

const allPosts = [...recentPosts, ...archivePosts];

export function getPostBySlug(slug: string): Post | null {
  return allPosts.find((p) => p.href === `/words/${slug}`) ?? null;
}
