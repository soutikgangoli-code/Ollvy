'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

const REFERRAL_ENABLED = process.env.NEXT_PUBLIC_REFERRAL_ENABLED === 'true'

interface Reward {
  service: string
  reward: string
}

const rewards: Reward[] = [
  { service: 'Pvt Ltd Incorporation', reward: '₹2,000' },
  { service: 'GST Registration', reward: '₹500' },
  { service: 'Monthly Filing (3 months)', reward: '₹200/month' },
  { service: 'Trademark Registration', reward: '₹750' },
  { service: 'Business ITR Filing', reward: '₹1,000' },
  { service: 'Any other service', reward: '5% of value' },
]

interface Step {
  n: string
  title: string
  body: string
}

const steps: Step[] = [
  {
    n: '1',
    title: 'Copy your link',
    body: 'One link, unique to your account. Share on WhatsApp, email, wherever.',
  },
  {
    n: '2',
    title: 'They book a service',
    body: 'The founder clicks your link and books anything - registration, filing, retainer.',
  },
  {
    n: '3',
    title: 'Money in 7 days',
    body: 'UPI transfer to your registered number, or wallet credit. No threshold. No minimum.',
  },
]

export function ReferFounder() {
  const [dialogOpen, setDialogOpen] = useState(false)

  // Feature flag - if disabled, render nothing
  if (!REFERRAL_ENABLED) {
    return null
  }

  const handleReferClick = () => {
    // In a real implementation, check if user is authenticated
    // For now, show dialog prompting sign in
    setDialogOpen(true)
  }

  return (
    <section className="bg-card py-24">
      <div className="container">
        {/* Section Heading */}
        <h2 className="font-mono text-2xl md:text-3xl lg:text-4xl uppercase tracking-wider text-foreground text-center">
          REFER A FOUNDER
        </h2>

        {/* Reward Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-10 max-w-[640px] mx-auto">
          {rewards.map((r) => (
            <Card key={r.service} className="border border-border bg-card p-4 text-center">
              <p className="text-xs text-muted-foreground leading-snug">{r.service}</p>
              <p className="text-xs uppercase tracking-widest text-ollvy-gold mt-2">GET</p>
              <p className="text-xl font-bold font-mono text-foreground mt-0.5">{r.reward}</p>
            </Card>
          ))}
        </div>

        {/* How it works */}
        <div className="divide-y divide-border max-w-[480px] mx-auto mt-10">
          {steps.map((step) => (
            <div key={step.n} className="flex gap-4 py-4">
              <span className="text-4xl font-bold text-muted-foreground/20 leading-none shrink-0">
                {step.n}
              </span>
              <div>
                <p className="font-semibold text-sm text-foreground">{step.title}</p>
                <p className="text-sm text-muted-foreground mt-1">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <Button variant="outline" onClick={handleReferClick}>
            Get My Referral Link
          </Button>
        </div>

        {/* Sign In Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Sign in to get your link</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground mt-2">
              Create an account or sign in to generate your unique referral link.
            </p>
            <div className="mt-4 space-y-2">
              <Button className="w-full" asChild>
                <Link href="/login?utm_source=homepage&utm_medium=landing&utm_content=refer">Sign In</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/login?utm_source=homepage&utm_medium=landing&utm_content=refer">Create Account</Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
