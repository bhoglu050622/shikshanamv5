import type { Metadata } from 'next'
import { Inter, Playfair_Display, Noto_Sans_Devanagari } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Providers from '@/components/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const sanskrit = Noto_Sans_Devanagari({
  subsets: ['devanagari'],
  variable: '--font-sanskrit',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: 'Shikshanam - Discover India\'s Timeless Wisdom',
  description: 'Premium courses, resources & communities built around the Six Darshanas. Ancient wisdom reimagined with cutting-edge technology and immersive experiences.',
  keywords: 'Vedanta, Yoga, Samkhya, Indian Philosophy, Darshanas, Wisdom, Learning, Premium Education, Spiritual Technology',
  authors: [{ name: 'Vishal Chaurasia' }, { name: 'Aman Bhogal' }],
  openGraph: {
    title: 'Shikshanam - Discover India\'s Timeless Wisdom',
    description: 'Premium courses, resources & communities built around the Six Darshanas',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Shikshanam - Premium Spiritual Education Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shikshanam - Discover India\'s Timeless Wisdom',
    description: 'Premium courses, resources & communities built around the Six Darshanas',
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} ${sanskrit.variable} antialiased cosmic-particles`}>
        <Providers>
          <Navigation />
          {children}
        </Providers>
      </body>
    </html>
  )
}
