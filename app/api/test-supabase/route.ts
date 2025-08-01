import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Supabase connection...')
    
    // Get Supabase client
    const supabase = createRouteHandlerClient({ cookies })
    
    // Test basic connection
    const { data, error } = await supabase
      .from('recipes')
      .select('count')
      .limit(1)
    
    if (error) {
      console.error('Supabase connection error:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }
    
    console.log('Supabase connection successful')
    
    // Get actual recipes count
    const { count, error: countError } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('Count error:', countError)
      return NextResponse.json({
        success: true,
        connection: 'OK',
        count: 'Error getting count',
        countError: countError.message
      })
    }
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      recipesCount: count || 0,
      message: 'Supabase connection working'
    })
    
  } catch (error) {
    console.error('Test route error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    }, { status: 500 })
  }
} 