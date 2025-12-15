import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mini E-Commerce | Shop Premium Products',
  description: 'Discover our curated selection of premium products. Fast shipping, secure checkout, and exclusive voucher codes available.',
  keywords: ['e-commerce', 'online shop', 'premium products', 'vouchers', 'discounts'],
  authors: [{ name: 'Mini E-Commerce' }],
  openGraph: {
    title: 'Mini E-Commerce | Shop Premium Products',
    description: 'Discover our curated selection of premium products',
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
