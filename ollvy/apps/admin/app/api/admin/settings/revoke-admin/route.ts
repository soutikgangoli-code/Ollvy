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

    const { data: adminToRevoke, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, auth_user_id, role')
      .eq('id', admin_id)
      .single()

    if (fetchError || !adminToRevoke) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 })
    }

    if (adminToRevoke.role === 'super_admin') {
      return NextResponse.json({ error: 'Cannot revoke super admin access' }, { status: 400 })
    }

    const { error: deleteError } = await supabase
      .from('admin_users')
      .delete()
      .eq('id', admin_id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to revoke admin' }, { status: 500 })
    }

    if (adminToRevoke.auth_user_id) {
      await supabase.auth.admin.updateUserById(adminToRevoke.auth_user_id, {
        ban_duration: '876600h'
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Revoke admin error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
