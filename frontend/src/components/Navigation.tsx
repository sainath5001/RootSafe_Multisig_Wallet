'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RootstockLogo } from './RootstockLogo'
import { ConnectButton } from './ConnectButton'
import { ThemeToggle } from './ThemeToggle'
import { FaBars, FaTimes } from 'react-icons/fa'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/docs', label: 'Docs' },
    { href: '/contact', label: 'Contact' },
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/'
    }
    return pathname?.startsWith(href)
  }

  return (
    <nav className="sticky top-0 z-50 bg-black border-b border-[#2a2a2a] backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <RootstockLogo className="w-8 h-8" />
              <span className="text-white font-bold text-lg hidden sm:block">
                Rootstock Multisig
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? 'text-[#FF6600]'
                    : 'text-[#a0a0a0] hover:text-[#FF6600]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect Button and Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <ConnectButton />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <ConnectButton />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#a0a0a0] hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#2a2a2a]">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base font-medium transition-colors ${
                    isActive(link.href)
                      ? 'text-[#FF6600]'
                      : 'text-[#a0a0a0] hover:text-[#FF6600]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

