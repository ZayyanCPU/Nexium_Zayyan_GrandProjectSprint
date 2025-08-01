import { ChefHat } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6">
          <ChefHat className="h-8 w-8 text-primary-600 animate-pulse" />
        </div>
        
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Cooking up something delicious...
        </h2>
        
        <p className="text-gray-600 mb-6">
          Please wait while we prepare your recipe
        </p>
        
        <div className="flex justify-center">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
} 