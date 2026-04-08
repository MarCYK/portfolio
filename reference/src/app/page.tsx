'use client';
// Note: Dynamic import used to prevent SSR for canvas component
import dynamic from 'next/dynamic';
import SiteHeader from '@/components/SiteHeader';
import MobileMenu from '@/components/MobileMenu';

// Canvas must be dynamically imported (client-only, uses browser APIs)
const CanvasHome = dynamic(() => import('@/components/CanvasHome'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <SiteHeader isHomePage />
      <MobileMenu />
      {/* Canvas fills the entire viewport behind the header (z-index: 0, position: fixed) */}
      <CanvasHome />
    </>
  );
}
