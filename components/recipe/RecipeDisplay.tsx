'use client'

import { Recipe } from '@/types/recipe'
import { Clock, Users, ChefHat, Tag, Heart, Share2, Bookmark, Utensils, Star } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'

interface RecipeDisplayProps {
  recipe: Recipe
}

export function RecipeDisplay({ recipe }: RecipeDisplayProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  const handleSave = () => {
    setIsSaved(!isSaved)
    // TODO: Implement save functionality
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    // TODO: Implement like functionality
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: recipe.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Hard':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="card">
      {/* Recipe Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{recipe.title}</h1>
            <div className="bg-gradient-to-r from-orange-50 to-green-50 p-4 rounded-xl border-l-4 border-orange-500">
              <p className="text-gray-700 text-lg leading-relaxed">{recipe.description}</p>
            </div>
          </div>
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleLike}
              className={`p-2 rounded-lg transition-colors ${
                isLiked ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleSave}
              className={`p-2 rounded-lg transition-colors ${
                isSaved ? 'text-primary-500 bg-primary-50' : 'text-gray-400 hover:text-primary-500 hover:bg-primary-50'
              }`}
            >
              <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Enhanced Recipe Meta */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center space-x-2 text-gray-700">
            <Clock className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm text-gray-500">Total Time</p>
              <p className="font-semibold">{recipe.prepTime + recipe.cookTime} min</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Users className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-gray-500">Servings</p>
              <p className="font-semibold">{recipe.servings}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <ChefHat className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm text-gray-500">Difficulty</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                {recipe.difficulty}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Tag className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-gray-500">Cuisine</p>
              <p className="font-semibold">{recipe.cuisine}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Image */}
      {recipe.imageUrl && (
        <div className="mb-6">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            width={800}
            height={400}
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Enhanced Ingredients Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
            <ChefHat className="h-4 w-4 text-orange-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Ingredients</h2>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-green-50 p-6 rounded-xl border border-orange-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
                <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0"></div>
                <div className="flex-1">
                  <span className="text-gray-900 font-semibold">
                    {ingredient.amount} {ingredient.unit}
                  </span>
                  <span className="ml-3 text-gray-700 text-lg">
                    {ingredient.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Instructions Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Utensils className="h-4 w-4 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Cooking Instructions</h2>
        </div>
        <div className="space-y-6">
          {recipe.instructions.map((instruction, index) => (
            <div key={index} className="flex space-x-6 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0 w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 text-lg leading-relaxed font-medium">{instruction}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recipe Summary */}
      <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="h-6 w-6 text-blue-600 mr-3" />
          Recipe Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Preparation Time:</span> {recipe.prepTime} minutes
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Cooking Time:</span> {recipe.cookTime} minutes
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Total Time:</span> {recipe.prepTime + recipe.cookTime} minutes
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Servings:</span> {recipe.servings} people
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Difficulty:</span> {recipe.difficulty}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Cuisine:</span> {recipe.cuisine}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Tags Section */}
      {recipe.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Tag className="h-6 w-6 text-purple-600 mr-3" />
            Dietary & Tags
          </h3>
          <div className="flex flex-wrap gap-3">
            {recipe.tags.map((tag, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 rounded-full text-sm font-medium border border-purple-200 hover:shadow-md transition-shadow"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 