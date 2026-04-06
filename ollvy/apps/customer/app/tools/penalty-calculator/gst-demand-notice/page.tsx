import { Suspense } from 'react'
import { gstDemandPage } from '@/lib/tools/penalty-calculator-pages'
import { GSTDemandCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/GSTDemandCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={gstDemandPage} showCalculatorSelector>
      <Suspense fallback={<CalculatorSkeleton />}>
        <GSTDemandCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
