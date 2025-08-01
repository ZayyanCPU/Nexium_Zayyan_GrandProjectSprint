'use client'

import { useEffect } from 'react'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h1>
          
          <p className="text-gray-600 mb-6">
            We encountered an unexpected error.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
              <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                Error Details (Development)
              </summary>
              <div className="space-y-2 text-sm">
                <p><strong>Message:</strong> {error.message}</p>
                {error.digest && <p><strong>Digest:</strong> {error.digest}</p>}
                <p><strong>Stack:</strong></p>
                <pre className="bg-gray-200 p-2 rounded text-xs overflow-auto">
                  {error.stack}
                </pre>
              </div>
            </details>
          )}
        </div>
      </div>
    </div>
  )
} 