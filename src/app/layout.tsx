import type { Metadata } from "next"
import { Bebas_Neue, Inter, Allura } from "next/font/google"
import "./globals.css"
import { Navbar } from "../components/Navbar"
import { Analytics } from "@vercel/analytics/next"

const bebas = Bebas_Neue({ subsets: ["latin"], variable: "--font-bebas", weight: "400" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const allura = Allura({ subsets: ["latin"], variable: "--font-allura", weight: "400" })

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Portfolio of Abhay Surya K S.",
}

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