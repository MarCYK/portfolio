import Link from 'next/link';
import { LogoDiamond } from './icons';

export default function SiteFooter() {
  return (
    <footer className="site-footer text-xs">
      <div
        className="flex items-center justify-between px-6 sm:px-8 mx-auto w-full"
        style={{ maxWidth: '80rem' }}
      >
        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>© 2026 zchry</span>
        <Link href="/" className="hidden sm:block">
          <LogoDiamond style={{ height: '12px', width: 'auto' }} />
        </Link>
        <div className="flex items-center gap-3" style={{ fontSize: '12px' }}>
          <a
            href="https://www.linkedin.com/in/zchry/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            LinkedIn
          </a>
          <a
            href="/rss.xml"
            className="hover:underline"
            style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
          >
            RSS
          </a>
        </div>
      </div>
    </footer>
  );
}
