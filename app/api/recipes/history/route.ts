import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Fetching recipe history...')
    
    // Get Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.log('❌ Authentication error:', authError)
      return NextResponse.json(
        { 
          error: 'Unauthorized - Please sign in to view recipe history',
          recipes: []
        },
        { status: 401 }
      )
    }

    console.log('✅ User authenticated:', user.id)

    // Get recipes from Supabase (following n8n workflow structure)
    const { data: recipes, error: supabaseError } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id) // Filter by user ID
      .order('created_at', { ascending: false })
      .limit(50)

    if (supabaseError) {
      console.error('❌ Supabase query error:', supabaseError)
      
      // Check if it's a table not found error
      if (supabaseError.message?.includes('relation "recipes" does not exist')) {
        console.log('📋 Table not found, creating table structure...')
        
        // Create the recipes table if it doesn't exist
        const { error: createTableError } = await supabase.rpc('create_recipes_table_if_not_exists')
        
        if (createTableError) {
          console.log('⚠️ Could not create table, returning empty array')
          return NextResponse.json({ 
            recipes: [],
            message: 'No recipes table found - please generate your first recipe',
            count: 0
          })
        }
        
        return NextResponse.json({ 
          recipes: [],
          message: 'No recipes yet - generate your first recipe!',
          count: 0
        })
      }
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch recipes from database', 
          details: supabaseError.message,
          recipes: []
        },
        { status: 500 }
      )
    }

    console.log('✅ Successfully fetched recipes:', recipes?.length || 0)

    // Transform Supabase data to match Recipe interface (following n8n workflow structure)
    const transformedRecipes = recipes?.map((recipe: any) => {
      try {
        console.log('🔄 Processing recipe:', recipe.id)
        
        // Parse the description field which contains the full recipe JSON (from n8n workflow)
        let recipeData = null
        if (recipe.description && typeof recipe.description === 'string') {
          try {
            recipeData = JSON.parse(recipe.description)
            console.log('✅ Parsed recipe data successfully')
          } catch (parseError) {
            console.error('❌ Error parsing recipe description:', parseError)
          }
        }

        // If we have parsed recipe data from n8n workflow, use it
        if (recipeData && recipeData.title) {
          return {
            id: recipeData.id || recipe.id?.toString() || generateId(),
            title: recipeData.title,
            description: recipeData.description || '',
            ingredients: recipeData.ingredients || [],
            instructions: recipeData.instructions || [],
            prepTime: recipeData.prepTime || 30,
            cookTime: recipeData.cookTime || 45,
            servings: recipeData.servings || 4,
            difficulty: recipeData.difficulty || 'Medium',
            cuisine: recipeData.cuisine || 'General',
            tags: recipeData.tags || [],
            imageUrl: recipeData.imageUrl,
            userId: recipeData.userId || user.id,
            createdAt: recipe.created_at ? new Date(recipe.created_at) : new Date(),
            updatedAt: recipe.updated_at ? new Date(recipe.updated_at) : new Date(),
          }
        }

        // Fallback: try to parse ingredients field
        let ingredients = []
        if (recipe.ingredients && typeof recipe.ingredients === 'string') {
          try {
            ingredients = JSON.parse(recipe.ingredients)
          } catch (parseError) {
            console.error('❌ Error parsing ingredients:', parseError)
          }
        }

        // Return a basic recipe structure for legacy data
        return {
          id: recipe.id?.toString() || generateId(),
          title: recipe.title || 'Recipe from Database',
          description: recipe.description || 'Recipe loaded from database',
          ingredients: ingredients,
          instructions: ['Recipe instructions not available'],
          prepTime: 30,
          cookTime: 45,
          servings: 4,
          difficulty: 'Medium',
          cuisine: 'General',
          tags: [],
          imageUrl: null,
          userId: user.id,
          createdAt: recipe.created_at ? new Date(recipe.created_at) : new Date(),
          updatedAt: recipe.updated_at ? new Date(recipe.updated_at) : new Date(),
        }
      } catch (error) {
        console.error('❌ Error processing recipe:', error, recipe)
        // Return a safe fallback recipe
        return {
          id: recipe.id?.toString() || generateId(),
          title: 'Recipe from Database',
          description: 'Recipe data loaded from database',
          ingredients: [],
          instructions: ['Recipe data could not be loaded'],
          prepTime: 30,
          cookTime: 45,
          servings: 4,
          difficulty: 'Medium',
          cuisine: 'General',
          tags: [],
          imageUrl: null,
          userId: user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      }
    }) || []

    console.log('✅ Transformed recipes:', transformedRecipes?.length || 0)
    return NextResponse.json({ 
      recipes: transformedRecipes,
      count: transformedRecipes.length,
      message: 'Recipe history loaded successfully'
    })
  } catch (error) {
    console.error('❌ Error fetching recipe history:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { 
        error: 'Failed to fetch recipe history', 
        details: error instanceof Error ? error.message : 'Unknown error',
        recipes: []
      },
      { status: 500 }
    )
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
} 