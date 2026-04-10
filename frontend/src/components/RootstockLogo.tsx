'use client'

export function RootstockLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- small public brand mark; className sets size */}
      <img src="/rootstock-logo.png" alt="Rootstock" className={className} draggable={false} />
    </>
  )
}