import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Oswald, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Static files in public/ are not auto-prefixed with basePath (set at deploy for /zhiza).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

const oswald = Oswald({ subsets: ['latin', 'cyrillic'], variable: '--font-oswald' })
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'ЖИЗА — симулятор жизни',
  description: 'Текстовый симулятор жизни в РФ. Один ход — один год. Каждый выбор оставляет эхо.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: `${basePath}/icon-light-32x32.png`,
        media: '(prefers-color-scheme: light)',
      },
      {
        url: `${basePath}/icon-dark-32x32.png`,
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: `${basePath}/icon.svg`,
        type: 'image/svg+xml',
      },
    ],
    apple: `${basePath}/apple-icon.png`,
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#211f1c',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`dark bg-background ${oswald.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased">
        {children}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}
