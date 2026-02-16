import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'

import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
})

export const metadata: Metadata = {
  title: 'Daniel & Nelly — Matrimonio',
  description: 'Join us in celebrating the marriage of Emma & James. Save the date and RSVP to our beautiful wedding celebration.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans antialiased`}>{children}</body>
    </html>
  )
}
