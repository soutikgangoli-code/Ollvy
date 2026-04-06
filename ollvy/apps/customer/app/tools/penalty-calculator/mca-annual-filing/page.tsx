import { Suspense } from 'react'
import { mcaFilingPage } from '@/lib/tools/penalty-calculator-pages'
import { MCAFilingCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/MCAFilingCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={mcaFilingPage}>
      <Suspense fallback={<CalculatorSkeleton />}>
        <MCAFilingCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
