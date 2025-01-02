"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { SessionProvider } from "next-auth/react"
import { Toaster } from "sonner"

export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <SessionProvider>
      <NextThemesProvider 
        {...props}
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster position="top-right" />
      </NextThemesProvider>
    </SessionProvider>
  )
} 