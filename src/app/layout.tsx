import type { Metadata } from "next"
import { Bebas_Neue, Inter, Allura } from "next/font/google"
import "./globals.css"
import { Navbar } from "../components/Navbar"
import { Analytics } from "@vercel/analytics/next"

const bebas = Bebas_Neue({ subsets: ["latin"], variable: "--font-bebas", weight: "400" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const allura = Allura({ subsets: ["latin"], variable: "--font-allura", weight: "400" })

export const metadata: Metadata = {
  metadataBase: new URL('https://abhay-surya-k-s-portfolio.vercel.app'),
  title: {
    default: 'Abhay Surya K S',
    template: '%s | Abhay Surya K S',
  },
  description: 'Full-Stack Developer specializing in Next.js, React, TypeScript, and modern web applications. Explore my projects, technical skills, and certifications.',
  keywords: [
    'Abhay Surya K S',
    'Full Stack Developer',
    'Next.js Developer',
    'React Developer',
    'Software Engineer Portfolio',
    'Web Developer',
  ],
  authors: [{ name: 'Abhay Surya K S' }],
  creator: 'Abhay Surya K S',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://abhay-surya-k-s-portfolio.vercel.app',
    title: 'Abhay Surya K S',
    description: 'Full-Stack Developer specializing in developing modern web applications. Explore my projects, technical skills, and certifications.',
    siteName: 'Abhay Surya K S Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhay Surya K S',
    description: 'Full-Stack Developer specializing in developing modern web applications. Explore my projects, technical skills, and certifications.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://abhay-surya-k-s-portfolio.vercel.app',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebas.variable} ${inter.variable} ${allura.variable}`}>
      <body className="bg-background font-body text-white antialiased">
        {children}
        <Navbar />
        <Analytics />
      </body>
    </html>
  )
}