'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

interface User {
  id: string
  business_name: string
  phone: string
  business_type?: string
  created_at: string
  order_count: number
}

interface UsersClientProps {
  users: User[]
}

export function UsersClient({ users }: UsersClientProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users

    const query = searchQuery.toLowerCase()
    return users.filter(u =>
      u.business_name.toLowerCase().includes(query) ||
      u.phone.includes(query) ||
      (u.business_type?.toLowerCase().includes(query))
    )
  }, [users, searchQuery])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {users.length} total users
          </p>
        </div>
        <Input
          placeholder="Search by name, phone, or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            All Users
            <span className="text-muted-foreground font-normal ml-2">
              ({filteredUsers.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No users found
            </p>
          ) : (
            <div className="divide-y divide-border">
              {filteredUsers.map(user => (
                <div
                  key={user.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{user.business_name}</p>
                    <p className="text-sm text-muted-foreground">{user.phone}</p>
                    {user.business_type && (
                      <p className="text-xs text-muted-foreground">{user.business_type}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm">
                      {user.order_count > 0 ? (
                        <span>{user.order_count} order{user.order_count > 1 ? 's' : ''}</span>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Joined {formatDate(user.created_at)}
                    </div>
                  </div>
                  <Link href={`/admin/users/${user.id}`}>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
