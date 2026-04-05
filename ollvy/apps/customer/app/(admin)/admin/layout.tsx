import { AdminNav } from '@/components/admin/AdminNav'
import { getAdminUser } from '@/lib/admin/get-admin-user'
import { AdminUserProvider } from '@/lib/admin/admin-user-context'
// NOTE: Do NOT import Toaster here - it is already in app/layout.tsx (root layout)
// Adding it again causes duplicate toasts

export const metadata = { robots: 'noindex, nofollow' }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Use cached getAdminUser - pages that also call this will get the cached result
  const adminUser = await getAdminUser()

  return (
    <div className="min-h-screen bg-muted/30">
      <AdminUserProvider adminUser={adminUser}>
        <AdminNav adminName={adminUser.name} isSuperAdmin={adminUser.role === 'super_admin'} />
        <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
      </AdminUserProvider>
    </div>
  )
}
