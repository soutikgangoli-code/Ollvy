import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabase } from '@/lib/supabase-server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { admin_id } = await request.json()

    if (!admin_id) {
      return NextResponse.json({ error: 'Admin ID required' }, { status: 400 })
    }

    const supabase = createAdminSupabase()

    // Verify the request is from the same admin
    const cookieStore = cookies()
    const adminToken = cookieStore.get('admin_token')?.value

    if (!adminToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify token matches the admin
    const { data: admin } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', admin_id)
      .single()

    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    // Update the admin record to mark TOTP as enabled
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({ totp_enabled: true })
      .eq('id', admin_id)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update admin' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Enable TOTP error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
