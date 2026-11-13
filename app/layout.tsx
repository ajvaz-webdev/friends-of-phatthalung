import type { Metadata } from 'next';
import './globals.css';

const siteUrl = 'https://friendsofphatthalung.com';
const socialImageUrl = `${siteUrl}/khao-ok-talu-social.jpg`;
const siteDescription = 'A little look at Phatthalung, our friends, shared moments, and the place we call home.';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Friends of Phatthalung',
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: 'Friends of Phatthalung',
    description: siteDescription,
    type: 'website',
    url: siteUrl,
    images: [
      {
        url: socialImageUrl,
        width: 1200,
        height: 630,
        alt: 'An illustrated view of Khao Ok Talu rising above the green landscape of Phatthalung.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Friends of Phatthalung',
    description: siteDescription,
    images: [socialImageUrl],
  },
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
