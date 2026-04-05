'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface AdminUser {
  id: string
  auth_user_id?: string
  name: string
  email: string
  role: 'super_admin' | 'ops_admin' | 'finance_admin'
  is_active: boolean
}

const AdminUserContext = createContext<AdminUser | null>(null)

export function AdminUserProvider({
  children,
  adminUser
}: {
  children: ReactNode
  adminUser: AdminUser
}) {
  return (
    <AdminUserContext.Provider value={adminUser}>
      {children}
    </AdminUserContext.Provider>
  )
}

export function useAdminUser(): AdminUser {
  const context = useContext(AdminUserContext)
  if (!context) {
    throw new Error('useAdminUser must be used within AdminUserProvider')
  }
  return context
}

// For server components that need to access admin user without re-querying
// This is set by the layout and can be accessed synchronously
let serverAdminUser: AdminUser | null = null

export function setServerAdminUser(user: AdminUser) {
  serverAdminUser = user
}

export function getServerAdminUser(): AdminUser | null {
  return serverAdminUser
}
