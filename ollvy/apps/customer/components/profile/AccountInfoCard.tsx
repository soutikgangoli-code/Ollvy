'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Phone, Building2, MapPin, Crown, Settings } from 'lucide-react'
import Link from 'next/link'

interface AccountInfoCardProps {
  businessName?: string
  phone: string
  state?: string
  city?: string
  isProUser: boolean
  avatarInitial: string
}

export function AccountInfoCard({
  businessName,
  phone,
  state,
  city,
  isProUser,
  avatarInitial,
}: AccountInfoCardProps) {
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
        <Link href="/profile?setup=true">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Settings className="h-3.5 w-3.5" />
            Edit Profile
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}
