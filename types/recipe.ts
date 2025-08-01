export interface Recipe {
  id: string
  title: string
  description: string
  ingredients: Ingredient[]
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  cuisine: string
  tags: string[]
  imageUrl?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  // Enhanced fields for Gemini workflow
  nutritionalInfo?: NutritionalInfo
  tips?: string[]
  generatedBy?: 'gemini' | 'openai' | 'fallback'
}

export interface Ingredient {
  name: string
  amount: string
  unit: string
}

export interface NutritionalInfo {
  calories: number
  protein: string
  carbs: string
  fat: string
  fiber?: string
  sugar?: string
  sodium?: string
}

export interface RecipeRequest {
  ingredients: string[]
  cuisine?: string
  dietaryRestrictions?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  servings?: number
  prepTime?: number
  description?: string
  // Enhanced options for Gemini
  includeNutritionalInfo?: boolean
  includeTips?: boolean
  preferredCookingMethod?: string
} 