import { Suspense } from 'react'
import { pfEsicPage } from '@/lib/tools/penalty-calculator-pages'
import { PFESICCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/PFESICCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={pfEsicPage} showCalculatorSelector>
      <Suspense fallback={<CalculatorSkeleton />}>
        <PFESICCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
