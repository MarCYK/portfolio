import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import MobileMenu from '@/components/MobileMenu';
import SiteFooter from '@/components/SiteFooter';
import { ArrowRightIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: 'zchry - Words',
};

interface Post {
  date: string;
  title: string;
  href: string;
}

const recentPosts: Post[] = [
  { date: 'Mar 24, 2026', title: 'On Researching with LLMs', href: '/words/on-researching-with-llms' },
  { date: 'Feb 27, 2026', title: "It's Been Awhile", href: '/words/hi-again' },
];

const archivePosts: Post[] = [
  { date: 'Oct 15, 2023', title: 'I Know Nothing', href: '/words/i-know-nothing' },
  { date: 'Jun 10, 2023', title: 'Quantum Leap: An Ongoing Game of Self-Interrogation', href: '/words/questioning-my-quantum-leap-an-ongoing-game-of-self-interrogation' },
  { date: 'Jun 8, 2023', title: 'Building a Brand Identity With Code', href: '/words/building-a-brand-identity-with-code' },
  { date: 'Jun 6, 2023', title: 'Objectively Evolving Your Own Subjectivity', href: '/words/objectively-evolving-your-own-subjectivity' },
  { date: 'Jun 2, 2023', title: 'LLMs Helped Me Understand How I Work', href: '/words/chatgpt-helped-me-realize-how-i-work' },
  { date: 'Feb 20, 2023', title: 'On AI, the Internet, and Everything In-Between', href: '/words/on-ai-the-internet-and-everything-in-between' },
  { date: 'Jan 5, 2023', title: 'The Revision Hole', href: '/words/revision-hole' },
];

function WordsRow({ date, title, href }: Post) {
  return (
    <Link href={href} className="words-row group">
      <span style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>{date}</span>
      <span className="flex items-center min-w-0">
        <span
          className="text-sm font-medium transition-colors duration-200 group-hover:underline underline-offset-2 truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </span>
        <ArrowRightIcon
          className="w-3.5 h-3.5 ml-4 shrink-0 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0"
          style={{ color: 'var(--text-secondary)', flexShrink: 0 }}
        />
      </span>
    </Link>
  );
}

export default function WordsPage() {
  return (
    <>
      <SiteHeader />
      <MobileMenu />
      <main id="scroll-root" className="flex-1 overflow-y-auto flex flex-col">
        <div
          className="px-6 sm:px-8 mx-auto flex-1 flex flex-col w-full"
          style={{ maxWidth: '80rem' }}
        >
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-0 flex-1">
            {/* Sidebar */}
            <div className="lg:w-1/4 lg:pr-12 xl:pr-24 shrink-0 pt-12 sm:pt-20">
              <h1
                className="font-semibold tracking-tight mb-3"
                style={{ fontSize: '30px', letterSpacing: '-0.025em', color: 'var(--text-primary)' }}
              >
                Words
              </h1>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                Thoughts and things.
              </p>
            </div>

            {/* Vertical divider (desktop only) */}
            <div
              className="hidden lg:block w-px shrink-0"
              style={{ borderLeft: '1px solid var(--border)' }}
            />

            {/* Main content */}
            <div className="lg:pl-12 xl:pl-24 flex-1 pt-2 lg:pt-20 pb-16 lg:pb-8">
              <div id="posts-list">
                {/* Column header */}
                <div className="words-row-header">
                  <span>Date</span>
                  <span>Title</span>
                </div>

                {/* Recent posts */}
                {recentPosts.map((post) => (
                  <WordsRow key={post.href} {...post} />
                ))}

                {/* Archive */}
                <div className="mt-12">
                  <h2
                    className="text-lg font-semibold tracking-tight mb-4 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Archive
                    <span className="text-xs font-normal" style={{ color: 'var(--text-tertiary)' }}>
                      (Older thoughts preserved for posterity)
                    </span>
                  </h2>
                  <div className="words-row-header">
                    <span>Date</span>
                    <span>Title</span>
                  </div>
                  {archivePosts.map((post) => (
                    <WordsRow key={post.href} {...post} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <SiteFooter />
      </main>
    </>
  );
}
