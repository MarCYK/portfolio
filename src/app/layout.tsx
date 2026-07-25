import type { Metadata } from 'next';
import { IBM_Plex_Mono, Inter } from 'next/font/google';
import { CanvasProvider } from '@/contexts/CanvasContext';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

// zchry font mapping:
// - Soehne: local/proprietary fallback chain declared in globals.css
// - IBM Plex Mono: loaded from Google via next/font/google
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'marcyk',
  description: 'portfolio of MarCYK',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${ibmPlexMono.variable} dark`}>
      <body className="flex flex-col overflow-hidden" style={{ height: '100svh' }}>
        <CanvasProvider>{children}</CanvasProvider>
      </body>
    </html>
  );
}
