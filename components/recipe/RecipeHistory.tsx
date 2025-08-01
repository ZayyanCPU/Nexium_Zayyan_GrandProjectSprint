'use client'

import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { Recipe } from '@/types/recipe'
import { Clock, Users, ChefHat, History, Search, Filter, Calendar, Star, Eye, Heart, Share2, AlertCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import Image from 'next/image'
import { RecipeCardSkeleton } from '@/components/ui/Skeleton'

interface RecipeHistoryProps {
  user: User
}

export function RecipeHistory({ user }: RecipeHistoryProps) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCuisine, setFilterCuisine] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'difficulty'>('date')

  useEffect(() => {
    fetchRecipeHistory()
  }, [user])

  const fetchRecipeHistory = async () => {
    try {
      setError(null)
      console.log('🔍 Fetching recipe history from frontend...')
      
      const response = await fetch('/api/recipes/history', {
        credentials: 'include',
      })
      
      console.log('📡 Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('❌ API Error:', errorData)
        
        if (response.status === 401) {
          setError('Please sign in to view your recipe history')
        } else {
          setError(`Failed to load recipe history: ${errorData.error || response.statusText}`)
        }
        return
      }
      
      const data = await response.json()
      console.log('✅ Received data:', data)
      
      if (data.recipes) {
        setRecipes(data.recipes)
        console.log('📋 Set recipes:', data.recipes.length)
      } else {
        console.log('⚠️ No recipes in response')
        setRecipes([])
      }
    } catch (error) {
      console.error('❌ Error fetching recipe history:', error)
      setError('Failed to load recipe history')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const filteredAndSortedRecipes = recipes
    .filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCuisine = !filterCuisine || recipe.cuisine.toLowerCase().includes(filterCuisine.toLowerCase())
      return matchesSearch && matchesCuisine
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title)
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 2) - 
                 (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 2)
        case 'date':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const cuisineOptions = Array.from(new Set(recipes.map(r => r.cuisine).filter(Boolean)))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
              <History className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Recipe History</h2>
          </div>
          <div className="text-sm text-gray-500">
            {recipes.length} recipes
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <RecipeCardSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="text-red-600 text-2xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Error Loading History</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={fetchRecipeHistory}
          className="bg-gradient-to-r from-orange-500 to-green-500 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-green-600 transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-green-500 rounded-full flex items-center justify-center">
            <History className="text-white text-lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Recipe History</h2>
        </div>
        <div className="text-sm text-gray-500">
          {filteredAndSortedRecipes.length} of {recipes.length} recipes
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Cuisine Filter */}
          <select
            value={filterCuisine}
            onChange={(e) => setFilterCuisine(e.target.value)}
            className="input-field"
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'name' | 'difficulty')}
            className="input-field"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="difficulty">Sort by Difficulty</option>
          </select>
        </div>
      </div>

      {/* Recipes Grid */}
      {filteredAndSortedRecipes.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <History className="text-orange-600 text-3xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {recipes.length === 0 ? 'No recipes yet' : 'No recipes found'}
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            {recipes.length === 0 
              ? 'Your generated recipes will appear here. Start by creating your first recipe!'
              : 'Try adjusting your search or filters to find what you\'re looking for.'
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedRecipes.map((recipe) => (
            <div key={recipe.id} className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 hover:shadow-xl transition-all duration-300 group">
              {/* Recipe Image */}
              {recipe.imageUrl && (
                <div className="h-48 overflow-hidden rounded-t-2xl">
                  <Image
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    width={400}
                    height={200}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              {/* Recipe Content */}
              <div className="p-6">
                {/* Title and Actions */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 line-clamp-2 text-lg group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {recipe.description}
                </p>
                
                {/* Recipe Meta */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-orange-500" />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3 text-green-500" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(recipe.difficulty)}`}>
                      {recipe.difficulty}
                    </span>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Cuisine and Rating */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    {recipe.cuisine}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-500">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 