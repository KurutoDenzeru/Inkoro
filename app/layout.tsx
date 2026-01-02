import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/providers";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://inkoro.vercel.app/'),
  title: {
    default: 'Inkoro - PDF Editor & Annotator',
    template: '%s | Inkoro'
  },
  description: 'Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows.',
  keywords: [
    'PDF editor',
    'PDF annotation',
    'React PDF',
    'TypeScript',
    'pdf.js',
    'react-pdf',
    'Tailwind CSS',
    'shadcn/ui',
    'online PDF editor',
    'PDF tools',
    'lightweight PDF editor',
    'responsive PDF editor',
    'PDF workflows',
    'browser PDF editor'
  ],
  authors: [{ name: 'Kurt Calacday' }],
  creator: 'Kurt Calacday',
  publisher: 'Inkoro',
  alternates: {
    canonical: '/'
  },
  icons: {
    icon: [
      { url: '/brand.png' },
      { url: '/brand.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand.png', sizes: '16x16', type: 'image/png' }
    ],
    apple: [
      { url: '/brand.png' }
    ],
    shortcut: ['/brand.png']
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Inkoro - PDF Editor & Annotator',
    description: 'Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows.',
    siteName: 'Inkoro',
    images: [
      {
        url: '/OpenGraph.webp',
        width: 1200,
        height: 630,
        alt: 'Inkoro PDF Editor'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inkoro - PDF Editor & Annotator',
    description: 'Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows.',
    images: ['/OpenGraph.webp'],
    creator: '@inkoro'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  manifest: '/manifest.json'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Inkoro',
    description: 'Lightweight React + TypeScript PDF editor using react-pdf (pdf.js), Tailwind, and shadcn/ui; ideal for responsive interfaces and quick PDF workflows.',
    url: 'https://inkoro.vercel.app',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    screenshot: 'https://inkoro.vercel.app/OpenGraph.webp',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '100'
    },
    author: {
      '@type': 'Organization',
      name: 'Kurt Calacday'
    }
  };

  return (
    <html lang="en" className={`${inter.variable} light`} style={{ colorScheme: 'light' }}>
      <head>
        <Script id="theme-init" strategy="beforeInteractive">{`(function(){try{const t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}else if(t==='light'){document.documentElement.classList.remove('dark');}else{const prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark', prefersDark);} }catch(e){}})()`}</Script>
        <Script
          id="json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
