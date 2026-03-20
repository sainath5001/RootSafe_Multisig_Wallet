'use client'

export function RootstockLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <img src="/rootstock-logo.png" alt="Rootstock" className={className} draggable={false} />
  )
}