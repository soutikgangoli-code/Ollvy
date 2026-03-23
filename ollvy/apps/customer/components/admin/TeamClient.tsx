'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { formatDate, formatDateTime } from '@/lib/utils'
import { useToast } from '@/lib/hooks/use-toast'
import { getClient, getEdgeFunctionUrl } from '@/lib/supabase'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  is_active: boolean
  last_login_at?: string
  created_at: string
}

interface TeamClientProps {
  teamMembers: TeamMember[]
  currentAdminId: string
}

const ADMIN_ROLES = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'ops_admin', label: 'Operations Admin' },
  { value: 'finance_admin', label: 'Finance Admin' },
]

export function TeamClient({ teamMembers, currentAdminId }: TeamClientProps) {
  const { toast } = useToast()
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<string>('ops_admin')

  const handleAddMember = async () => {
    if (!name.trim() || !email.trim() || !password.trim() || !role) {
      toast({ title: 'Please fill all fields', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const supabase = getClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        toast({ title: 'Session expired', variant: 'destructive' })
        return
      }

      const res = await fetch(getEdgeFunctionUrl('create-admin-user'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast({ title: 'Error', description: err.error || 'Failed to create user', variant: 'destructive' })
        return
      }

      toast({ title: 'Team member added', description: 'They can now log in with their credentials.' })
      setAddDialogOpen(false)
      setName('')
      setEmail('')
      setPassword('')
      setRole('ops_admin')

      // Reload page to show new member
      window.location.reload()
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to add team member', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (memberId: string, currentActive: boolean) => {
    if (memberId === currentAdminId) {
      toast({ title: 'You cannot deactivate yourself', variant: 'destructive' })
      return
    }
    setLoading(true)
    try {
      const supabase = getClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch(getEdgeFunctionUrl('toggle-admin-active'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ admin_id: memberId, is_active: !currentActive }),
      })

      if (!res.ok) {
        toast({ title: 'Failed to update', variant: 'destructive' })
        return
      }

      toast({ title: currentActive ? 'User deactivated' : 'User activated' })
      window.location.reload()
    } catch (err) {
      toast({ title: 'Error', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Team</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage admin team members
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>Add member</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Team Members
            <span className="text-muted-foreground font-normal ml-2">
              ({teamMembers.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No team members yet
            </p>
          ) : (
            <div className="divide-y divide-border">
              {teamMembers.map(member => (
                <div
                  key={member.id}
                  className="py-4 flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">
                        {member.name}
                        {member.id === currentAdminId && (
                          <span className="text-muted-foreground ml-1">(you)</span>
                        )}
                      </span>
                      <Badge variant={member.is_active ? 'default' : 'secondary'}>
                        {member.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {member.role.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right shrink-0">
                      <div className="text-xs text-muted-foreground">
                        {member.last_login_at
                          ? `Last login: ${formatDateTime(member.last_login_at)}`
                          : 'Never logged in'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Added {formatDate(member.created_at)}
                      </div>
                    </div>
                    {member.id !== currentAdminId && (
                      <Switch
                        checked={member.is_active}
                        onCheckedChange={() => handleToggleActive(member.id, member.is_active)}
                        disabled={loading}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Member Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Name</Label>
              <Input
                className="mt-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label className="text-sm">Email</Label>
              <Input
                className="mt-1"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label className="text-sm">Password</Label>
              <Input
                className="mt-1"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Secure password"
              />
              <p className="text-xs text-muted-foreground mt-1">Min 8 characters</p>
            </div>
            <div>
              <Label className="text-sm">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADMIN_ROLES.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
