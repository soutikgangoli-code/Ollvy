import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import * as OTPAuth from 'otpauth'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION = 8 * 60 * 60 * 1000 // 8 hours

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    if (!code || code.length !== 6) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    // Get current session
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE)

    if (!sessionCookie?.value) {
      return NextResponse.json(
        { error: 'Session expired. Please login again.' },
        { status: 401 }
      )
    }

    let session: any
    try {
      session = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString())
    } catch {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

    // Get admin's TOTP secret
    const adminSupabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get() { return undefined },
          set() {},
          remove() {},
        },
      }
    )

    const { data: adminUser, error: adminError } = await adminSupabase
      .from('admin_users')
      .select('id, totp_secret, totp_enrolled')
      .eq('id', session.admin_user_id)
      .single()

    if (adminError || !adminUser) {
      return NextResponse.json(
        { error: 'Admin user not found' },
        { status: 404 }
      )
    }

    // For development: accept a bypass code or check if TOTP is enrolled
    const isDev = process.env.NODE_ENV === 'development'
    const bypassCode = process.env.ADMIN_TOTP_BYPASS_CODE || '000000'

    if (isDev && code === bypassCode) {
      // Bypass TOTP in development
    } else if (!adminUser.totp_secret || !adminUser.totp_enrolled) {
      // TOTP not enrolled - for dev, allow any code
      if (!isDev) {
        return NextResponse.json(
          { error: 'TOTP not enrolled. Please contact support.' },
          { status: 400 }
        )
      }
    } else {
      // Verify TOTP
      const totp = new OTPAuth.TOTP({
        issuer: 'Ollvy Admin',
        label: session.email,
        algorithm: 'SHA1',
        digits: 6,
        period: 30,
        secret: OTPAuth.Secret.fromBase32(adminUser.totp_secret),
      })

      const delta = totp.validate({ token: code, window: 1 })

      if (delta === null) {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 401 }
        )
      }
    }

    // Update session with TOTP verified
    session.totp_verified = true
    session.expires_at = Date.now() + SESSION_DURATION

    // Update last login
    await adminSupabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', session.admin_user_id)

    const sessionValue = Buffer.from(JSON.stringify(session)).toString('base64')

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE, sessionValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('TOTP verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    )
  }
}
