'use client'

import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-8 h-8 flex items-center justify-center rounded-full text-lg transition-colors hover:bg-black/5 dark:hover:bg-white/10"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
