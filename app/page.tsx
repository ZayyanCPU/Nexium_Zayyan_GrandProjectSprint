'use client'

import { useState } from 'react'
import { useUser } from '@/components/providers/SupabaseProvider'
import { AuthForm } from '@/components/auth/AuthForm'
import { RecipeGenerator } from '@/components/recipe/RecipeGenerator'
import { RecipeHistory } from '@/components/recipe/RecipeHistory'
import { Header } from '@/components/layout/Header'
import { ChefHat, Sparkles, BookOpen, TrendingUp, Star, Users, Clock, Zap } from 'lucide-react'

export default function Home() {
  const { user, loading } = useUser()
  const [activeTab, setActiveTab] = useState<'generate' | 'history'>('generate')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Preparing your kitchen...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-green-500 rounded-full mb-6">
                <ChefHat className="text-white text-3xl" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                AI Recipe Generator
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Transform your ingredients into delicious recipes with the power of AI. 
                Get personalized cooking suggestions, dietary accommodations, and step-by-step instructions.
              </p>
              
              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="text-orange-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">AI-Powered</h3>
                  <p className="text-sm text-gray-600">Advanced AI creates unique recipes from your ingredients</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <BookOpen className="text-green-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Recipe History</h3>
                  <p className="text-sm text-gray-600">Save and revisit your favorite generated recipes</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <TrendingUp className="text-blue-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Dietary Options</h3>
                  <p className="text-sm text-gray-600">Cater to vegetarian, vegan, gluten-free, and more</p>
                </div>
                
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-purple-200">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Star className="text-purple-600 text-xl" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized</h3>
                  <p className="text-sm text-gray-600">Customize difficulty, servings, and cooking time</p>
                </div>
              </div>
            </div>

            {/* Auth Form */}
            <div className="max-w-md mx-auto">
              <AuthForm />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Header user={user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-green-500 rounded-full mb-4">
              <ChefHat className="text-white text-2xl" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-lg text-gray-600">
              Ready to create something delicious?
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-2 border border-gray-200">
              <div className="flex space-x-2">
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === 'generate'
                      ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>Generate Recipe</span>
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    activeTab === 'history'
                      ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Recipe History</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-orange-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Recipes</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <ChefHat className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-gray-900">7</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                  <p className="text-2xl font-bold text-gray-900">4.8</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Star className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-xl">
            {activeTab === 'generate' ? (
              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Create Your Perfect Recipe
                  </h2>
                  <p className="text-gray-600">
                    Tell us what you have, and we&apos;ll create something amazing
                  </p>
                </div>
                <RecipeGenerator user={user} />
              </div>
            ) : (
              <div className="p-8">
                <RecipeHistory user={user} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 