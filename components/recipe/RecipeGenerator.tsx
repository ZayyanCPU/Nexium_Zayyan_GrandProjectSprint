'use client'

import { useState } from 'react'
import { User } from '@supabase/supabase-js'
import { RecipeForm } from './RecipeForm'
import { RecipeDisplay } from './RecipeDisplay'
import { Recipe } from '@/types/recipe'
import { ChefHat, Sparkles, Loader2, CheckCircle, AlertCircle } from 'lucide-react'

interface RecipeGeneratorProps {
  user: User
}

export function RecipeGenerator({ user }: RecipeGeneratorProps) {
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGenerateRecipe = async (formData: any) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      setRecipe(null)

      console.log('🚀 Generating recipe with data:', formData)

      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userId: user.id,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('✅ Recipe generated successfully:', data)
      
      setRecipe(data)
      setSuccess(true)
      
      // Auto-scroll to recipe display
      setTimeout(() => {
        const recipeElement = document.getElementById('recipe-display')
        if (recipeElement) {
          recipeElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)

    } catch (error) {
      console.error('❌ Error generating recipe:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Recipe Form Section */}
      <div className="bg-gradient-to-br from-orange-50 to-green-50 rounded-2xl p-8 border border-orange-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-green-500 rounded-full mb-4">
            <ChefHat className="text-white text-2xl" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Recipe Preferences
          </h3>
          <p className="text-gray-600">
            Tell us what ingredients you have and your preferences
          </p>
        </div>

        <RecipeForm onSubmit={handleGenerateRecipe} disabled={loading} />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 shadow-lg">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-green-500 rounded-full mb-6">
              <Loader2 className="text-white text-3xl animate-spin" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Creating Your Recipe
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-3 text-gray-600">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <span>Analyzing your ingredients...</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-600">
                <ChefHat className="w-5 h-5 text-green-500" />
                <span>Generating cooking instructions...</span>
              </div>
              <div className="flex items-center justify-center space-x-3 text-gray-600">
                <CheckCircle className="w-5 h-5 text-blue-500" />
                <span>Finalizing your recipe...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="text-red-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-red-900 mb-2">
              Recipe Generation Failed
            </h3>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Success State */}
      {success && recipe && (
        <div id="recipe-display" className="bg-white/90 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg">
          <div className="p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mb-4">
                <CheckCircle className="text-white text-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Recipe Generated Successfully!
              </h3>
              <p className="text-gray-600">
                Your personalized recipe is ready to cook
              </p>
            </div>
            <RecipeDisplay recipe={recipe} />
          </div>
        </div>
      )}

      {/* Quick Tips */}
      {!loading && !recipe && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2" />
            Pro Tips
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Include main ingredients like proteins, vegetables, and grains</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Specify dietary restrictions for better recipe suggestions</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Choose your preferred cuisine type for authentic flavors</p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p>Adjust difficulty level based on your cooking experience</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 