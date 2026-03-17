'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Check, ArrowRight, ArrowLeft, User, Users, Building, Building2, HelpCircle } from 'lucide-react'

const BUSINESS_TYPES = [
  {
    id: 'sole_proprietorship',
    label: 'Sole Proprietorship',
    description: 'Single owner, simplest structure',
    icon: User,
  },
  {
    id: 'partnership',
    label: 'Partnership',
    description: 'Two or more partners',
    icon: Users,
  },
  {
    id: 'pvt_ltd',
    label: 'Private Limited (Pvt Ltd)',
    description: 'Separate legal entity, shareholders',
    icon: Building,
  },
  {
    id: 'llp',
    label: 'LLP',
    description: 'Limited Liability Partnership',
    icon: Building2,
  },
  {
    id: 'not_registered',
    label: 'Not yet registered',
    description: 'Planning to start a business',
    icon: HelpCircle,
  },
]

export default function BusinessTypePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleContinue = async () => {
    if (!selected) return

    setIsSubmitting(true)
    sessionStorage.setItem('onboarding_business_type', selected)
    router.push('/state')
  }

  const handleBack = () => {
    router.push('/situations')
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p className="text-white/40 text-sm uppercase tracking-wider">Step 2 of 4</p>
        <h1 className="text-2xl font-semibold text-white">What type of business do you have?</h1>
        <p className="text-white/50">
          This helps us understand your compliance requirements.
        </p>
      </div>

      <div className="grid gap-3">
        {BUSINESS_TYPES.map((type) => {
          const Icon = type.icon
          const isSelected = selected === type.id

          return (
            <Card
              key={type.id}
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 border',
                isSelected
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              )}
              onClick={() => setSelected(type.id)}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  isSelected ? 'bg-white/10' : 'bg-white/5'
                )}>
                  <Icon className="h-5 w-5 text-white/60" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{type.label}</p>
                  <p className="text-sm text-white/40">{type.description}</p>
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
          disabled={!selected || isSubmitting}
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
          onClick={handleBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
  )
}
