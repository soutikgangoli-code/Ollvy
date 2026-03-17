import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json({ error: 'Email, password, and role are required' }, { status: 400 })
    }

    const validRoles = ['super_admin', 'ops_admin', 'finance_admin']
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 400 })
    }

    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError || !authUser.user) {
      return NextResponse.json({ error: authError?.message || 'Failed to create auth user' }, { status: 500 })
    }

    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        auth_user_id: authUser.user.id,
        email,
        role,
        totp_enabled: false,
      })

    if (insertError) {
      await supabase.auth.admin.deleteUser(authUser.user.id)
      return NextResponse.json({ error: 'Failed to create admin record' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Add admin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
