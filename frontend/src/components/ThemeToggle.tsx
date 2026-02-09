'use client'

import { useState, useEffect } from 'react'
import { FaSun, FaMoon } from 'react-icons/fa'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(true) // Default to dark

  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDark(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    // Apply theme
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  const toggleTheme = () => {
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-[#a0a0a0] hover:text-[#FF6600] hover:border-[#FF6600] transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? <FaSun size={18} /> : <FaMoon size={18} />}
    </button>
  )
}











