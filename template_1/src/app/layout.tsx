import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#282828",
};

export const metadata: Metadata = {
  title: "//--- Fine Thought ---//",
  description: "Web engineer & creative coder — Fine Thought, the creative persona of Nathan Leigh Davis",
  icons: {
    apple: [
      { url: "/seo/apple-icon-57x57.png", sizes: "57x57" },
      { url: "/seo/apple-icon-60x60.png", sizes: "60x60" },
      { url: "/seo/apple-icon-72x72.png", sizes: "72x72" },
      { url: "/seo/apple-icon-76x76.png", sizes: "76x76" },
      { url: "/seo/apple-icon-114x114.png", sizes: "114x114" },
      { url: "/seo/apple-icon-120x120.png", sizes: "120x120" },
      { url: "/seo/apple-icon-144x144.png", sizes: "144x144" },
      { url: "/seo/apple-icon-152x152.png", sizes: "152x152" },
      { url: "/seo/apple-icon-180x180.png", sizes: "180x180" },
    ],
    icon: [
      { url: "/seo/favicon-16x16.png", sizes: "16x16" },
      { url: "/seo/favicon-32x32.png", sizes: "32x32" },
      { url: "/seo/favicon-96x96.png", sizes: "96x96" },
      { url: "/seo/android-icon-192x192.png", sizes: "192x192" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Adobe Fonts (TypeKit) — neue-haas-grotesk-display + code-saver */}
        <link rel="stylesheet" href="https://use.typekit.net/awl2qrt.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
