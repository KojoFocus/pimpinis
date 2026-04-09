import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Pimpinis — Fashion Store',
  description: 'Dresses, Footwear, Belts, Sunglasses, Accessories, Hats & More',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
