'use client'

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-[#2a2a2a] rounded h-4 w-3/4 mb-2"></div>
      <div className="bg-[#2a2a2a] rounded h-4 w-1/2"></div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg animate-pulse">
      <div className="bg-[#2a2a2a] rounded h-6 w-1/3 mb-4"></div>
      <div className="space-y-3">
        <div className="bg-[#2a2a2a] rounded h-4 w-full"></div>
        <div className="bg-[#2a2a2a] rounded h-4 w-5/6"></div>
        <div className="bg-[#2a2a2a] rounded h-4 w-4/6"></div>
      </div>
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-4 rounded-lg animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="bg-[#2a2a2a] rounded h-5 w-32"></div>
        <div className="bg-[#2a2a2a] rounded h-5 w-20"></div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="bg-[#2a2a2a] rounded h-4 w-full"></div>
        <div className="bg-[#2a2a2a] rounded h-4 w-3/4"></div>
      </div>
      <div className="bg-[#2a2a2a] rounded h-2 w-full mb-2"></div>
      <div className="flex gap-2">
        <div className="bg-[#2a2a2a] rounded h-9 w-24"></div>
        <div className="bg-[#2a2a2a] rounded h-9 w-24"></div>
      </div>
    </div>
  )
}











