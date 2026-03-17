'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, ArrowRight, Rocket, Users, CreditCard, UtensilsCrossed, Ship, Briefcase, Shield, Calculator, Building2 } from 'lucide-react'

const SITUATIONS = [
  { id: 'just_starting_out', label: 'Just starting out', description: 'Setting up a new business', icon: Rocket },
  { id: 'need_to_hire', label: 'Need to hire', description: 'Building your team', icon: Users },
  { id: 'taking_payments', label: 'Taking payments', description: 'Accepting money from customers', icon: CreditCard },
  { id: 'selling_food_beverages', label: 'Selling food or beverages', description: 'Restaurant, cafe, or food business', icon: UtensilsCrossed },
  { id: 'importing_exporting', label: 'Importing or exporting', description: 'International trade', icon: Ship },
  { id: 'have_investors', label: 'Have investors', description: 'Raised funding', icon: Briefcase },
  { id: 'protect_my_brand', label: 'Protect my brand', description: 'Trademark and IP', icon: Shield },
  { id: 'filing_taxes', label: 'Need to file taxes', description: 'ITR, GST returns, TDS', icon: Calculator },
  { id: 'regulated_industry', label: 'Regulated industry', description: 'Healthcare, finance, etc.', icon: Building2 },
]

export default function SituationsPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const toggleSituation = (id: string) => {
    setSelected(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    )
  }

  const handleContinue = async () => {
    setIsSubmitting(true)
    // Store selections in session storage for now
    sessionStorage.setItem('onboarding_situations', JSON.stringify(selected))
    router.push('/business-type')
  }

  const handleSkip = () => {
    sessionStorage.setItem('onboarding_situations', JSON.stringify([]))
    router.push('/business-type')
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p className="text-white/40 text-sm uppercase tracking-wider">Step 1 of 4</p>
        <h1 className="text-2xl font-semibold text-white">What describes your situation?</h1>
        <p className="text-white/50">
          Select all that apply. We'll recommend services based on your needs.
        </p>
      </div>

      <div className="grid gap-3">
        {SITUATIONS.map((situation) => {
          const Icon = situation.icon
          const isSelected = selected.includes(situation.id)

          return (
            <Card
              key={situation.id}
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 border',
                isSelected
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              )}
              onClick={() => toggleSituation(situation.id)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  isSelected ? 'bg-white/10' : 'bg-white/5'
                )}>
                  <Icon className="h-5 w-5 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{situation.label}</p>
                  <p className="text-sm text-white/40">{situation.description}</p>
                </div>
                <div className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                  isSelected
                    ? 'border-white bg-white'
                    : 'border-white/30'
                )}>
                  {isSelected && <Check className="h-3.5 w-3.5 text-black" />}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="space-y-3 pt-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleContinue}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        <Button
          variant="ghost"
          className="w-full text-white/50"
          onClick={handleSkip}
        >
          Skip for now
        </Button>
      </div>
    </div>
  )
}
