import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { CartProvider } from '@/components/CartContext'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Pimpinis — Fashion Store',
  description: 'Dresses, Footwear, Belts, Sunglasses, Accessories, Hats & More',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          <CartProvider>{children}</CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
