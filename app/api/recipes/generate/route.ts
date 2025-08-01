import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'mongodb'
import { RecipeRequest, Recipe, Ingredient } from '@/types/recipe'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get user from Supabase auth
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recipeRequest: RecipeRequest = await request.json()

    // Validate request
    if (!recipeRequest.ingredients || recipeRequest.ingredients.length === 0) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 })
    }

    console.log('🔍 Generating recipe for user:', user.id)
    console.log('📋 Recipe request:', recipeRequest)

    // Check if n8n webhook URL is configured
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    
    if (!n8nWebhookUrl || n8nWebhookUrl === 'your_n8n_webhook_url_here') {
      console.log('⚠️ n8n webhook not configured, using fallback recipe')
      
      // Return a fallback recipe when n8n is not configured
      const fallbackRecipe = createFallbackRecipe(recipeRequest, user.id)
      
      // Save fallback recipe to Supabase (following n8n workflow structure)
      const { error: supabaseError } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: fallbackRecipe.title,
          ingredients: JSON.stringify(fallbackRecipe.ingredients),
          description: JSON.stringify(fallbackRecipe), // Store full recipe JSON
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (supabaseError) {
        console.error('❌ Supabase insert error:', supabaseError)
      } else {
        console.log('✅ Fallback recipe saved to Supabase')
      }

      // Save fallback recipe to MongoDB
      try {
        const client = await clientPromise
        const db = client.db()
        await db.collection('recipes').insertOne({
          ...fallbackRecipe,
          _id: new ObjectId(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        console.log('✅ Fallback recipe saved to MongoDB')
      } catch (mongodbError) {
        console.error('❌ MongoDB insert error:', mongodbError)
      }

      return NextResponse.json(fallbackRecipe)
    }

    // Call n8n webhook for AI recipe generation
    console.log('🚀 Calling n8n webhook:', n8nWebhookUrl)
    
    const n8nPayload = {
      ingredients: recipeRequest.ingredients,
      cuisine: recipeRequest.cuisine || 'Any',
      dietaryRestrictions: recipeRequest.dietaryRestrictions || [],
      difficulty: recipeRequest.difficulty || 'Medium',
      servings: recipeRequest.servings || 4,
      prepTime: recipeRequest.prepTime || 30,
      description: recipeRequest.description || '',
      userId: user.id,
      timestamp: new Date().toISOString(),
    }
    
    console.log('📤 n8n payload:', n8nPayload)
    
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(n8nPayload),
    })

    if (!n8nResponse.ok) {
      console.error('❌ n8n webhook error:', n8nResponse.status, n8nResponse.statusText)
      const errorText = await n8nResponse.text()
      console.error('❌ n8n response body:', errorText)
      
      // Return fallback recipe if n8n fails
      const fallbackRecipe = createFallbackRecipe(recipeRequest, user.id)
      
      // Save fallback recipe to Supabase (following n8n workflow structure)
      const { error: supabaseError } = await supabase
        .from('recipes')
        .insert({
          user_id: user.id,
          title: fallbackRecipe.title,
          ingredients: JSON.stringify(fallbackRecipe.ingredients),
          description: JSON.stringify(fallbackRecipe), // Store full recipe JSON
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (supabaseError) {
        console.error('❌ Supabase insert error:', supabaseError)
      } else {
        console.log('✅ Fallback recipe saved to Supabase')
      }

      // Save fallback recipe to MongoDB
      try {
        const client = await clientPromise
        const db = client.db()
        await db.collection('recipes').insertOne({
          ...fallbackRecipe,
          _id: new ObjectId(),
          createdAt: new Date(),
          updatedAt: new Date()
        })
        console.log('✅ Fallback recipe saved to MongoDB')
      } catch (mongodbError) {
        console.error('❌ MongoDB insert error:', mongodbError)
      }

      return NextResponse.json(fallbackRecipe)
    }

    let aiRecipeData
    try {
      aiRecipeData = await n8nResponse.json()
      console.log('✅ n8n response data:', aiRecipeData)
    } catch (parseError) {
      console.error('❌ Failed to parse n8n response:', parseError)
      throw new Error('Invalid response from AI service')
    }

    // Validate n8n response (following n8n workflow structure)
    if (!aiRecipeData || !aiRecipeData.title || !aiRecipeData.ingredients || !aiRecipeData.instructions) {
      console.error('❌ Invalid n8n response structure:', aiRecipeData)
      throw new Error('Invalid recipe data from AI service')
    }

    // Create recipe object (following n8n workflow structure)
    const recipe: Recipe = {
      id: generateId(),
      title: aiRecipeData.title,
      description: aiRecipeData.description || '',
      ingredients: aiRecipeData.ingredients.map((ing: any) => ({
        name: ing.name,
        amount: ing.amount,
        unit: ing.unit,
      })),
      instructions: aiRecipeData.instructions,
      prepTime: aiRecipeData.prepTime || 30,
      cookTime: aiRecipeData.cookTime || 45,
      servings: aiRecipeData.servings || 4,
      difficulty: aiRecipeData.difficulty || 'Medium',
      cuisine: aiRecipeData.cuisine || 'General',
      tags: aiRecipeData.tags || [],
      imageUrl: aiRecipeData.imageUrl,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    console.log('✅ Generated recipe:', recipe.title)

    // Save to Supabase (following n8n workflow structure)
    const { error: supabaseError } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        title: recipe.title,
        ingredients: JSON.stringify(recipe.ingredients),
        description: JSON.stringify(recipe), // Store full recipe JSON
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (supabaseError) {
      console.error('❌ Supabase insert error:', supabaseError)
    } else {
      console.log('✅ Recipe saved to Supabase')
    }

    // Save to MongoDB
    try {
      const client = await clientPromise
      const db = client.db()
      await db.collection('recipes').insertOne({
        ...recipe,
        _id: new ObjectId(),
        createdAt: new Date(),
        updatedAt: new Date()
      })
      console.log('✅ Recipe saved to MongoDB')
    } catch (mongodbError) {
      console.error('❌ MongoDB insert error:', mongodbError)
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('❌ Error generating recipe:', error)
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    )
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

function createFallbackRecipe(recipeRequest: RecipeRequest, userId: string): Recipe {
  const mainIngredient = recipeRequest.ingredients[0] || 'ingredients'
  const cuisine = recipeRequest.cuisine || 'General'
  const prepTime = recipeRequest.prepTime || 30
  const servings = recipeRequest.servings || 4
  const difficulty = recipeRequest.difficulty || 'Medium'
  
  // Generate more realistic ingredients with proper amounts and units
  const ingredientUnits = ['cup', 'tbsp', 'tsp', 'clove', 'piece', 'slice', 'whole', 'oz', 'lb']
  const ingredientAmounts = ['1/4', '1/2', '1', '2', '3', '4', '1/3', '2/3']
  
  const enhancedIngredients = recipeRequest.ingredients.map(ingredient => ({
    name: ingredient,
    amount: ingredientAmounts[Math.floor(Math.random() * ingredientAmounts.length)],
    unit: ingredientUnits[Math.floor(Math.random() * ingredientUnits.length)]
  }))
  
  // Add common pantry ingredients
  const pantryIngredients = [
    { name: 'olive oil', amount: '2', unit: 'tbsp' },
    { name: 'salt', amount: '1/2', unit: 'tsp' },
    { name: 'black pepper', amount: '1/4', unit: 'tsp' },
    { name: 'garlic', amount: '2', unit: 'cloves' },
    { name: 'onion', amount: '1', unit: 'medium' }
  ]
  
  // Add 2-3 pantry ingredients
  const selectedPantry = pantryIngredients.slice(0, 2 + Math.floor(Math.random() * 2))
  const allIngredients = [...enhancedIngredients, ...selectedPantry]
  
  // Generate more detailed instructions based on cuisine and ingredients
  const baseInstructions = [
    'Wash and prepare all fresh ingredients',
    'Heat oil in a large pan over medium heat',
    'Add aromatics (garlic, onion) and sauté until fragrant',
    'Add main ingredients and cook until tender',
    'Season with salt, pepper, and herbs to taste',
    'Cook until all ingredients are well combined',
    'Let the dish rest for a few minutes before serving',
    'Garnish with fresh herbs and serve hot'
  ]
  
  // Customize instructions based on cuisine
  let instructions = [...baseInstructions]
  if (cuisine.toLowerCase().includes('italian')) {
    instructions = [
      'Heat olive oil in a large skillet over medium heat',
      'Sauté garlic and onions until translucent',
      'Add tomatoes and herbs, simmer for 10 minutes',
      'Add main ingredients and cook until tender',
      'Season with salt, pepper, and Italian herbs',
      'Simmer until sauce thickens',
      'Garnish with fresh basil and serve with pasta or bread'
    ]
  } else if (cuisine.toLowerCase().includes('asian')) {
    instructions = [
      'Heat oil in a wok or large pan over high heat',
      'Stir-fry aromatics (ginger, garlic) until fragrant',
      'Add main ingredients and stir-fry for 3-4 minutes',
      'Add soy sauce and other seasonings',
      'Continue stir-frying until ingredients are cooked',
      'Add a splash of water if needed to prevent sticking',
      'Garnish with green onions and serve with rice'
    ]
  } else if (cuisine.toLowerCase().includes('mexican')) {
    instructions = [
      'Heat oil in a large pan over medium heat',
      'Sauté onions and peppers until softened',
      'Add spices (cumin, chili powder) and cook until fragrant',
      'Add main ingredients and cook until tender',
      'Season with salt, lime juice, and cilantro',
      'Simmer until flavors meld together',
      'Serve with tortillas, rice, or as a filling'
    ]
  }
  
  // Generate a more detailed description
  const descriptions = [
    `A flavorful ${cuisine.toLowerCase()} dish that showcases ${recipeRequest.ingredients.join(', ')} in a delicious combination. This recipe is perfect for ${servings} people and can be prepared in about ${prepTime} minutes. The dish features a perfect balance of flavors and textures that will satisfy your taste buds.`,
    `Experience the authentic taste of ${cuisine} cuisine with this amazing recipe featuring ${recipeRequest.ingredients.join(', ')}. Designed to serve ${servings} people, this dish combines traditional cooking methods with fresh ingredients to create a memorable meal that's ready in ${prepTime} minutes.`,
    `Discover the rich flavors of ${cuisine} cooking with this delightful recipe. Using ${recipeRequest.ingredients.join(', ')} as the star ingredients, this dish offers a perfect blend of spices and textures. Ideal for ${servings} servings and ready in ${prepTime} minutes, it's a great choice for any occasion.`
  ]
  
  const description = descriptions[Math.floor(Math.random() * descriptions.length)]
  
  return {
    id: generateId(),
    title: `${cuisine} ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)} Delight`,
    description: description,
    ingredients: allIngredients,
    instructions: instructions,
    prepTime: prepTime,
    cookTime: Math.floor(prepTime * 0.6) + 15, // Realistic cook time
    servings: servings,
    difficulty: difficulty,
    cuisine: cuisine,
    tags: recipeRequest.dietaryRestrictions || [],
    imageUrl: undefined,
    userId: userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
} 