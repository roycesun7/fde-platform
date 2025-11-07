import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FDE OS - Forward-Deployed Engineering Platform',
  description: 'AI-powered Operating System for Forward-Deployed Engineering',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

