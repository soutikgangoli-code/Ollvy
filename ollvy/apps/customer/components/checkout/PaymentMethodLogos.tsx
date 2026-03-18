'use client'

import { CreditCard, Smartphone, Building2, QrCode } from 'lucide-react'

export function PaymentMethodLogos() {
  return (
    <div className="flex items-center justify-center gap-6 py-4">
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <QrCode className="h-5 w-5 text-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">UPI</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <CreditCard className="h-5 w-5 text-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">Cards</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Building2 className="h-5 w-5 text-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">Netbanking</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
          <Smartphone className="h-5 w-5 text-foreground" />
        </div>
        <span className="text-xs text-muted-foreground">Wallets</span>
      </div>
    </div>
  )
}

// Compact horizontal version
export function PaymentMethodBadges() {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">UPI</span>
      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">Cards</span>
      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">Netbanking</span>
      <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded">Wallets</span>
    </div>
  )
}
