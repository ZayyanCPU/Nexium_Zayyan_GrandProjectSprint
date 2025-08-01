import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  try {
    const supabase = createMiddlewareClient({ req, res })

    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Middleware auth error:', error)
    }

    // Protected routes that require authentication
    const protectedRoutes = ['/api/recipes/generate', '/api/recipes/history']
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    )

    // If accessing protected route without session, return 401
    if (isProtectedRoute && !session) {
      console.log('Unauthorized access to protected route:', req.nextUrl.pathname)
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    }

    // Auth callback route - let it pass through
    if (req.nextUrl.pathname.startsWith('/auth/callback')) {
      return res
    }

    return res
  } catch (error) {
    console.error('Middleware error:', error)
    // Don't block the request on middleware errors
    return res
  }
}

export const config = {
  matcher: [
    '/api/recipes/:path*',
    '/auth/callback',
  ],
} 