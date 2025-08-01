import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching recipe history (simple)...')
    
    // Get Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Get recipes from Supabase (simplified table structure)
    const { data: recipes, error: supabaseError } = await supabase
      .from('recipes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)

    if (supabaseError) {
      console.error('Supabase query error:', supabaseError)
      return NextResponse.json(
        { error: 'Failed to fetch recipes from database', details: supabaseError.message },
        { status: 500 }
      )
    }

    console.log('Successfully fetched recipes:', recipes?.length || 0)

    // Return raw data for debugging
    return NextResponse.json({ 
      recipes: recipes || [],
      count: recipes?.length || 0,
      message: 'Raw recipe data from Supabase'
    })
    
  } catch (error) {
    console.error('Error fetching recipe history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe history', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 