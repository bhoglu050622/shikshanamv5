'use client'

import { ThemeProvider } from 'next-themes'
import { SessionProvider } from 'next-auth/react'
import AnalyticsProvider from './AnalyticsProvider'
import { MotionConfig } from 'framer-motion'

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <MotionConfig reducedMotion="user">
          {children}
        </MotionConfig>
      </ThemeProvider>
    </SessionProvider>
  )
}
