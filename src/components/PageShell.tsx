import type { ReactNode } from 'react';
import MobileMenu from './MobileMenu';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';

interface PageShellProps {
  children: ReactNode;
  isHomePage?: boolean;
}

export default function PageShell({ children, isHomePage = false }: PageShellProps) {
  return (
    <>
      <SiteHeader isHomePage={isHomePage} />
      <MobileMenu />
      <main id="scroll-root" className="flex flex-1 flex-col overflow-y-auto">
        {children}
        {!isHomePage && <SiteFooter />}
      </main>
    </>
  );
}
