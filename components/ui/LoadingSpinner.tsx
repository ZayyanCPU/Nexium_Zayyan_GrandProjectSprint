interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ size = 'md', className = '', text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <div className={`animate-spin rounded-full border-2 border-orange-200 border-t-orange-500 ${sizeClasses[size]}`} />
        {text && (
          <p className="text-sm text-gray-600 font-medium">{text}</p>
        )}
      </div>
    </div>
  )
}

// Full screen loading component
export function FullScreenLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-food-gradient">
      <div className="text-center">
        <div className="w-16 h-16 bg-orange-gradient rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
          <div className="animate-spin rounded-full border-2 border-white border-t-transparent h-8 w-8" />
        </div>
        <p className="text-orange-600 font-medium">{text}</p>
      </div>
    </div>
  )
}

// Inline loading component
export function InlineLoader({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <div className={`animate-spin rounded-full border-2 border-orange-200 border-t-orange-500 ${
      size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-6 w-6' : 'h-8 w-8'
    }`} />
  )
} 