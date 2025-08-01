'use client'

import { useState } from 'react'
import { RecipeRequest } from '@/types/recipe'
import { Plus, X, ChefHat, Globe, Users, Clock, Zap, Sparkles } from 'lucide-react'

interface RecipeFormProps {
  onSubmit: (data: RecipeRequest) => void
  disabled?: boolean
}

export function RecipeForm({ onSubmit, disabled = false }: RecipeFormProps) {
  const [ingredients, setIngredients] = useState<string[]>([''])
  const [cuisine, setCuisine] = useState('')
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([])
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium')
  const [servings, setServings] = useState(4)
  const [prepTime, setPrepTime] = useState(30)
  const [description, setDescription] = useState('')

  const cuisineOptions = [
    'Any cuisine',
    'Italian',
    'Asian',
    'Mexican',
    'Indian',
    'Mediterranean',
    'American',
    'French',
    'Thai',
    'Japanese',
    'Chinese',
    'Greek',
    'Spanish',
    'Middle Eastern',
    'African',
    'Caribbean'
  ]

  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Low-Carb',
    'Keto',
    'Paleo',
    'Nut-Free',
    'Halal',
    'Kosher'
  ]

  const difficultyOptions = ['Easy', 'Medium', 'Hard']

  const addIngredient = () => {
    setIngredients([...ingredients, ''])
  }

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((_, i) => i !== index))
    }
  }

  const updateIngredient = (index: number, value: string) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = value
    setIngredients(newIngredients)
  }

  const toggleDietaryRestriction = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validIngredients = ingredients.filter(ingredient => ingredient.trim() !== '')
    if (validIngredients.length === 0) {
      alert('Please add at least one ingredient')
      return
    }

    const formData: RecipeRequest = {
      ingredients: validIngredients,
      cuisine: cuisine === 'Any cuisine' ? '' : cuisine,
      dietaryRestrictions,
      difficulty,
      servings,
      prepTime,
      description
    }

    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Ingredients Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
            <ChefHat className="text-orange-600 text-sm" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Available Ingredients *</h4>
        </div>
        
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex space-x-3">
              <input
                type="text"
                value={ingredient}
                onChange={(e) => updateIngredient(index, e.target.value)}
                placeholder="e.g., chicken, rice, tomatoes"
                className="input-field flex-1"
                disabled={disabled}
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center hover:bg-red-200 transition-colors disabled:opacity-50"
                  disabled={disabled}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          ))}
          
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center space-x-2 text-orange-600 hover:text-orange-700 font-medium disabled:opacity-50"
            disabled={disabled}
          >
            <Plus className="w-4 h-4" />
            <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {/* Cuisine Type */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
            <Globe className="text-green-600 text-sm" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Cuisine Type</h4>
        </div>
        
        <select
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
          className="input-field"
          disabled={disabled}
        >
          {cuisineOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Zap className="text-blue-600 text-sm" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900">Dietary Restrictions</h4>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dietaryOptions.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => toggleDietaryRestriction(option)}
              disabled={disabled}
              className={`px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 ${
                dietaryRestrictions.includes(option)
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              } disabled:opacity-50`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Recipe Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Difficulty Level */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <ChefHat className="text-purple-600 text-sm" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Difficulty Level</h4>
          </div>
          
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
            className="input-field"
            disabled={disabled}
          >
            {difficultyOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Servings */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="text-green-600 text-sm" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Servings</h4>
          </div>
          
          <input
            type="number"
            value={servings}
            onChange={(e) => setServings(parseInt(e.target.value) || 1)}
            min="1"
            max="20"
            className="input-field"
            disabled={disabled}
          />
        </div>

        {/* Max Prep Time */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="text-orange-600 text-sm" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900">Max Prep Time (min)</h4>
          </div>
          
          <input
            type="number"
            value={prepTime}
            onChange={(e) => setPrepTime(parseInt(e.target.value) || 15)}
            min="15"
            max="180"
            step="15"
            className="input-field"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Additional Notes (Optional)</h4>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any specific preferences or notes..."
          rows={4}
          className="input-field resize-none"
          disabled={disabled}
        />
      </div>

      {/* Submit Button */}
      <div className="pt-6">
        <button
          type="submit"
          disabled={disabled || ingredients.filter(i => i.trim()).length === 0}
          className="w-full bg-gradient-to-r from-orange-500 to-green-500 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-green-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
        >
          {disabled ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Generating Recipe...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span>Generate Recipe</span>
            </div>
          )}
        </button>
      </div>
    </form>
  )
} 