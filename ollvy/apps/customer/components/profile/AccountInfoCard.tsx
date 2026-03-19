'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Phone, Building2, MapPin, Crown, Pencil, Check, X, Loader2 } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh',
]

interface AccountInfoCardProps {
  businessName?: string
  phone: string
  state?: string
  city?: string
  isProUser: boolean
  avatarInitial: string
  onSave?: (data: { businessName: string; state: string; city: string }) => Promise<void>
}

export function AccountInfoCard({
  businessName,
  phone,
  state,
  city,
  isProUser,
  avatarInitial,
  onSave,
}: AccountInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Edit form state
  const [editBusinessName, setEditBusinessName] = useState(businessName || '')
  const [editState, setEditState] = useState(state || '')
  const [editCity, setEditCity] = useState(city || '')

  const handleStartEdit = () => {
    setEditBusinessName(businessName || '')
    setEditState(state || '')
    setEditCity(city || '')
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!onSave) return

    setIsSaving(true)
    try {
      await onSave({
        businessName: editBusinessName,
        state: editState,
        city: editCity,
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isEditing) {
    return (
      <Card className="border-border">
        <CardContent className="p-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xl font-semibold text-foreground">
                {editBusinessName?.charAt(0) || avatarInitial}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">Editing Profile</p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Business Name</label>
              <Input
                value={editBusinessName}
                onChange={(e) => setEditBusinessName(e.target.value)}
                placeholder="Enter business name"
                className="h-9"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">State</label>
              <select
                value={editState}
                onChange={(e) => setEditState(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-1 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">City</label>
              <Input
                value={editCity}
                onChange={(e) => setEditCity(e.target.value)}
                placeholder="Enter city"
                className="h-9"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 gap-1"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 gap-1"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Check className="h-3.5 w-3.5" />
              )}
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        {/* Avatar and Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xl font-semibold text-foreground">
              {avatarInitial}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-foreground truncate">
                {businessName || 'Your Business'}
              </h3>
              {isProUser && (
                <Badge variant="default" className="gap-1 shrink-0">
                  <Crown className="h-3 w-3" />
                  Pro
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              +91 {phone}
            </p>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          {(state || city) && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {[city, state].filter(Boolean).join(', ')}
            </p>
          )}
          {!state && !city && (
            <p className="flex items-center gap-2 text-muted-foreground/60">
              <MapPin className="h-4 w-4" />
              Location not set
            </p>
          )}
        </div>

        {/* Edit Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleStartEdit}
          className="w-full gap-2"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit Profile
        </Button>
      </CardContent>
    </Card>
  )
}
