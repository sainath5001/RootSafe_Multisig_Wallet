'use client'

export function RootstockLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Rootstock logo - interconnected circles */}
      <circle cx="12" cy="6" r="3" fill="#FF6600" />
      <circle cx="6" cy="12" r="3" fill="#FF6600" />
      <circle cx="18" cy="12" r="3" fill="#FF6600" />
      <circle cx="12" cy="18" r="3" fill="#FF6600" />
      <circle cx="9" cy="9" r="2" fill="#FF6600" />
      <circle cx="15" cy="9" r="2" fill="#FF6600" />
      <circle cx="9" cy="15" r="2" fill="#FF6600" />
      <circle cx="15" cy="15" r="2" fill="#FF6600" />
      {/* Connections */}
      <path
        d="M 12 6 L 9 9 M 12 6 L 15 9 M 6 12 L 9 9 M 6 12 L 9 15 M 18 12 L 15 9 M 18 12 L 15 15 M 12 18 L 9 15 M 12 18 L 15 15"
        stroke="#FF6600"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}









