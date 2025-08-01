import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Briefing Checklist | Guest Services',
  description: 'Daily briefing and checklist tool for guest services team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  )
} 