import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { isSupabaseConfigured, getSupabaseServerClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    let isAuthenticated = false
    let userName = 'WCC Admin'
    let supabaseAuthFailed = false

    if (isSupabaseConfigured()) {
      try {
        const supabase = getSupabaseServerClient()
        // Here we attempt to sign in using Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          console.error('Supabase auth failed:', error.message)
          supabaseAuthFailed = true
        } else if (data.session) {
          isAuthenticated = true
          userName = data.user.user_metadata?.name || 'WCC Admin'
        }
      } catch (err) {
        console.error('Supabase auth error:', err)
        supabaseAuthFailed = true
      }
    }

    // Fallback if Supabase is not configured or Supabase auth fails (allow mock admin login as a safety net)
    if (!isAuthenticated && (!isSupabaseConfigured() || supabaseAuthFailed)) {
      const fallbackEmail = process.env.ADMIN_FALLBACK_EMAIL
      const fallbackPassword = process.env.ADMIN_FALLBACK_PASSWORD

      if (fallbackEmail && fallbackPassword) {
        // If custom credentials are set in the environment, only accept those
        if (email === fallbackEmail && password === fallbackPassword) {
          isAuthenticated = true
        }
      } else {
        // Local development safety net fallback
        if (email === 'admin@wccfashions.com' && password === 'wcc2026admin') {
          isAuthenticated = true
        }
      }
    }

    if (isAuthenticated) {
      const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || 'fallback_secret_key_for_development_only_must_be_replaced')

      const token = await new SignJWT({ email, role: 'super_admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(secret)

      const response = NextResponse.json({
        success: true,
        data: { user: { email, name: userName, role: 'super_admin' } },
      })

      response.cookies.set('wcc-admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json(
      { success: false, error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
