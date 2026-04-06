import { Suspense } from 'react'
import { gstLateFilingPage } from '@/lib/tools/penalty-calculator-pages'
import { GSTLateFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/GSTLateFilingCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function GSTLatePenaltyPage() {
  return (
    <ToolPageWrapper config={gstLateFilingPage}>
      <Suspense fallback={<CalculatorSkeleton />}>
        <GSTLateFilingCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
