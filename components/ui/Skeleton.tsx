import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'title' | 'avatar' | 'card' | 'button' | 'image'
  lines?: number
}

export function Skeleton({ className = '', variant = 'text', lines = 1 }: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'
  
  switch (variant) {
    case 'title':
      return (
        <div className={`h-8 bg-gray-200 rounded-lg animate-pulse ${className}`} />
      )
    
    case 'avatar':
      return (
        <div className={`w-12 h-12 bg-gray-200 rounded-full animate-pulse ${className}`} />
      )
    
    case 'card':
      return (
        <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
          </div>
        </div>
      )
    
    case 'button':
      return (
        <div className={`h-12 bg-gray-200 rounded-lg animate-pulse ${className}`} />
      )
    
    case 'image':
      return (
        <div className={`w-full h-48 bg-gray-200 rounded-lg animate-pulse ${className}`} />
      )
    
    case 'text':
    default:
      if (lines === 1) {
        return (
          <div className={`h-4 bg-gray-200 rounded animate-pulse ${className}`} />
        )
      }
      
      return (
        <div className={`space-y-2 ${className}`}>
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`h-4 bg-gray-200 rounded animate-pulse ${
                index === lines - 1 ? 'w-3/4' : 'w-full'
              }`}
            />
          ))}
        </div>
      )
  }
}

// Recipe card skeleton
export function RecipeCardSkeleton() {
  return (
    <div className="recipe-card">
      <div className="h-48 bg-gray-200 rounded-t-2xl animate-pulse" />
      <div className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
        </div>
        <div className="flex justify-between items-center">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
        </div>
      </div>
    </div>
  )
}

// Form skeleton
export function FormSkeleton() {
  return (
    <div className="card space-y-6">
      <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
            <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
      <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  )
} 