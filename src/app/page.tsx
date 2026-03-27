'use client';

import dynamic from 'next/dynamic';
import MobileMenu from '@/components/MobileMenu';
import SiteHeader from '@/components/SiteHeader';

const CanvasHome = dynamic(() => import('@/components/CanvasHome'), { ssr: false });

export default function HomePage() {
  return (
    <>
      <SiteHeader isHomePage />
      <MobileMenu />
      <CanvasHome />
    </>
  );
}
