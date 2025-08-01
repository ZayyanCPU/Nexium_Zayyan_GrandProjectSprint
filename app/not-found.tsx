import Link from 'next/link'
import { ChefHat, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary-100 rounded-full mb-6">
            <ChefHat className="h-8 w-8 text-primary-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Recipe Not Found
          </h2>
          
          <p className="text-gray-600 mb-8">
            The recipe you&apos;re looking for doesn&apos;t exist. Maybe it&apos;s still being cooked up?
          </p>
          
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Link>
            
            <Link
              href="/"
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Generate New Recipe
            </Link>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 