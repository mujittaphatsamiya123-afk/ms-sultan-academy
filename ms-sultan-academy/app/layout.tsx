import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { ThemeProvider } from '@/components/theme/ThemeProvider'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'M.S Sultan Academy | Learn to Make Money Online',
    template: '%s',
  },
  description:
    'Practical courses teaching beginners in Nigeria & Africa how to make money online using smartphones and AI tools.',
  keywords: ['make money online', 'Nigeria', 'AI tools', 'freelancing', 'online courses', 'Africa'],
  openGraph: {
    title: 'M.S Sultan Academy',
    description: 'Learn to make money online using your smartphone and AI tools.',
    url: 'https://mssultanacademy.com',
    siteName: 'M.S Sultan Academy',
    locale: 'en_NG',
    type: 'website',
  },
  metadataBase: new URL('https://mssultanacademy.com'),
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

// This runs before React hydrates, so there's zero flash of the wrong theme.
const themeInitScript = `
  (function() {
    try {
      const stored = localStorage.getItem('msa-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = stored || (prefersDark ? 'dark' : 'light');
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } catch (e) {}
  })();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
