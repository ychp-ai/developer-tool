import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import type { ReactNode } from 'react'
import { ThemeContext } from '@/features/theme/theme-context'
import type { Theme } from '@/features/theme/theme-context'
import { readStorage, writeStorage } from '@/lib/storage'

const mediaQuery = '(prefers-color-scheme: dark)'
const getSystemTheme = () => window.matchMedia(mediaQuery).matches
const subscribeSystemTheme = (onChange: () => void) => {
  const media = window.matchMedia(mediaQuery)
  media.addEventListener('change', onChange)
  return () => media.removeEventListener('change', onChange)
}

export interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = readStorage('theme')
    return stored === 'light' || stored === 'dark' ? stored : 'system'
  })
  const isSystemDark = useSyncExternalStore(subscribeSystemTheme, getSystemTheme, () => false)
  const actualTheme = theme === 'system' ? (isSystemDark ? 'dark' : 'light') : theme

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(actualTheme)
  }, [actualTheme])

  const handleSetTheme = useCallback((nextTheme: Theme) => {
    setTheme(nextTheme)
    writeStorage('theme', nextTheme)
  }, [])
  const value = useMemo(
    () => ({ theme, setTheme: handleSetTheme, actualTheme }),
    [theme, handleSetTheme, actualTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
