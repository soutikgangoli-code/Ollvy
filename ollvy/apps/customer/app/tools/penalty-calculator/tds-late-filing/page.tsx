import { Suspense } from 'react'
import { tdsLateFilingPage } from '@/lib/tools/penalty-calculator-pages'
import { TDSLateFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/TDSLateFilingCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={tdsLateFilingPage} showCalculatorSelector>
      <Suspense fallback={<CalculatorSkeleton />}>
        <TDSLateFilingCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
