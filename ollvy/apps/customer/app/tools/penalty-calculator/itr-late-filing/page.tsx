import { Suspense } from 'react'
import { itrLateFilingPage } from '@/lib/tools/penalty-calculator-pages'
import { ITRLateFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/ITRLateFilingCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={itrLateFilingPage} showCalculatorSelector>
      <Suspense fallback={<CalculatorSkeleton />}>
        <ITRLateFilingCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
