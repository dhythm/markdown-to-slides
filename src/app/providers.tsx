"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes"

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  suppressHydrationWarning?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ThemeProvider({ children, suppressHydrationWarning, ...props }: ExtendedThemeProviderProps) {
  return (
    <NextThemesProvider {...props} enableSystem={true}>
      {children}
    </NextThemesProvider>
  )
} 