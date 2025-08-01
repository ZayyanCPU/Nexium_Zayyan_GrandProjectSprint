import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import clientPromise from '@/lib/mongodb'
import { HealthCheckResponse } from '@/types/api'

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
  const timestamp = new Date().toISOString()
  const version = process.env.npm_package_version || '1.0.0'

  try {
    // Check Supabase connection
    const supabase = createRouteHandlerClient({ cookies })
    const { error: supabaseError } = await supabase.from('recipes').select('count').limit(1)
    const supabaseStatus = supabaseError ? 'down' : 'up'

    // Check MongoDB connection
    let mongodbStatus: 'up' | 'down' = 'down'
    try {
      const client = await clientPromise
      await client.db().admin().ping()
      mongodbStatus = 'up'
    } catch (error) {
      console.error('MongoDB health check failed:', error)
    }

    // Check n8n webhook (if configured)
    let n8nStatus: 'up' | 'down' = 'down'
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (n8nWebhookUrl && n8nWebhookUrl !== 'https://your-n8n-instance.com/webhook/recipe-generator') {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const response = await fetch(n8nWebhookUrl, {
          method: 'HEAD',
          signal: controller.signal,
        })
        
        clearTimeout(timeoutId)
        n8nStatus = response.ok ? 'up' : 'down'
      } catch (error) {
        console.error('n8n health check failed:', error)
      }
    }

    const overallStatus = 
      supabaseStatus === 'up' && mongodbStatus === 'up' 
        ? 'healthy' 
        : 'unhealthy'

    const healthCheck: HealthCheckResponse = {
      status: overallStatus,
      timestamp,
      version,
      services: {
        database: mongodbStatus,
        n8n: n8nStatus,
        supabase: supabaseStatus,
      },
    }

    return NextResponse.json(healthCheck, {
      status: overallStatus === 'healthy' ? 200 : 503,
    })
  } catch (error) {
    console.error('Health check failed:', error)
    
    const healthCheck: HealthCheckResponse = {
      status: 'unhealthy',
      timestamp,
      version,
      services: {
        database: 'down',
        n8n: 'down',
        supabase: 'down',
      },
    }

    return NextResponse.json(healthCheck, { status: 503 })
  }
} 