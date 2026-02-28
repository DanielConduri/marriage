import type { Metadata } from 'next'
import { Playfair_Display, Lato } from 'next/font/google'

import './globals.css'
import { siteConfig } from '@/config/site'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
})

// export const metadata: Metadata = {
//   title: 'Daniel & Nelly — Matrimonio',
//   description: 'Join us in celebrating the marriage of Emma & James. Save the date and RSVP to our beautiful wedding celebration.',
//   icons: {
//     icon: '/images/shopping-cart.png',
//     shortcut: '/images/wedding-logo.svg',
//     apple: '/images/wedding-logo.svg',
//   },
// }

export const metadata: Metadata = {
  metadataBase: new URL("https://boda.tecnodaniel.ec"),
  title: siteConfig.title,
  description: siteConfig.description,
  keywords: [
    "Boda",
    "Boda",
    "Daniel & Nelly",
    "Celebración de boda",

  ],
  authors: [{ name: "Daniel & Nelly", url: "https://boda.tecnodaniel.ec"}],
  creator: "Daniel & Nelly",
  openGraph: {
    type: "website",
    locale: "es_EC",
    url: "https://tecnodaniel.ec",
    title: "Daniel & Nelly — Boda",
    description:
      "",
    siteName: "Daniel & Nelly — Boda",
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel & Nelly — Boda",
    description:
      "Únete a nosotros para celebrar la boda de Daniel & Nelly. Guarda la fecha y confirma tu asistencia a nuestra hermosa celebración de boda.",
    images: [siteConfig.ogImage]
  },
  icons: {
    icon: "/family.png",
    shortcut: "/family.png",
    apple: "/family.png"
  },
  //manifest: `${siteConfig.url}/site.webmanifest`
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
