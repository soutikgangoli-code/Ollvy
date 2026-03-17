'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight, ArrowLeft, Search, MapPin } from 'lucide-react'

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

export default function StatePage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredStates = INDIAN_STATES.filter(state =>
    state.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleContinue = async () => {
    if (!selected) return

    setIsSubmitting(true)
    sessionStorage.setItem('onboarding_state', selected)
    router.push('/recommendations')
  }

  const handleBack = () => {
    router.push('/business-type')
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <p className="text-white/40 text-sm uppercase tracking-wider">Step 3 of 4</p>
        <h1 className="text-2xl font-semibold text-white">Where is your business located?</h1>
        <p className="text-white/50">
          Compliance requirements vary by state.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
        <input
          type="text"
          placeholder="Search for your state..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 pl-12 pr-4 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
        />
      </div>

      {/* State List */}
      <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10">
        {filteredStates.map((state) => {
          const isSelected = selected === state

          return (
            <Card
              key={state}
              className={cn(
                'p-4 cursor-pointer transition-all duration-200 border',
                isSelected
                  ? 'border-white/30 bg-white/5'
                  : 'border-white/10 bg-white/[0.02] hover:border-white/20'
              )}
              onClick={() => setSelected(state)}
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-white/40" />
                <span className="font-medium text-white">{state}</span>
                {isSelected && (
                  <div className="ml-auto w-5 h-5 rounded-full bg-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          )
        })}

        {filteredStates.length === 0 && (
          <div className="text-center py-8 text-white/40">
            No states found matching "{searchQuery}"
          </div>
        )}
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
