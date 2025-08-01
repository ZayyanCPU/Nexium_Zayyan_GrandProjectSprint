import { Recipe } from './recipe'

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  status: number
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface RecipeGenerateRequest {
  ingredients: string[]
  cuisine?: string
  dietaryRestrictions?: string[]
  difficulty?: 'Easy' | 'Medium' | 'Hard'
  servings?: number
  prepTime?: number
  description?: string
}

export interface RecipeGenerateResponse extends ApiResponse<Recipe> {}

export interface RecipeHistoryResponse extends ApiResponse<PaginatedResponse<Recipe>> {}

export interface N8nWebhookRequest {
  ingredients: string[]
  cuisine: string
  dietaryRestrictions: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  servings: number
  prepTime: number
  description: string
  userId: string
}

export interface N8nWebhookResponse {
  title: string
  description: string
  ingredients: Array<{
    name: string
    amount: string
    unit: string
  }>
  instructions: string[]
  prepTime: number
  cookTime: number
  servings: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  cuisine: string
  tags: string[]
  imageUrl?: string
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy'
  timestamp: string
  version: string
  services: {
    database: 'up' | 'down'
    n8n: 'up' | 'down'
    supabase: 'up' | 'down'
  }
} 