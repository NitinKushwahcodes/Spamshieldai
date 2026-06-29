import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '../hooks/useAuth'

export const metadata: Metadata = {
  title: 'ScamShield AI — India\'s Cyber Fraud Protection Platform',
  description: 'AI-powered scam detection, incident vault, and auto-generated legal complaints to protect citizens from financial and cyber frauds in India.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220%22 width=%22100%22 height=%22100%22><text y=%220.9em%22 font-size=%2290%22>🛡️</text></svg>" />
      </head>
      <body className="antialiased min-h-screen bg-background text-text-primary">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
