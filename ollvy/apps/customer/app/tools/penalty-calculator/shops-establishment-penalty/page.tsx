import { Suspense } from 'react'
import { shopEstablishmentPage } from '@/lib/tools/penalty-calculator-pages'
import { ShopsEstablishmentCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/ShopsEstablishmentCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={shopEstablishmentPage}>
      <Suspense fallback={<CalculatorSkeleton />}>
        <ShopsEstablishmentCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
