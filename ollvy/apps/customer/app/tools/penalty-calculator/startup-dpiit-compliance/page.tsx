import { Suspense } from 'react'
import { dpiitFemaPage } from '@/lib/tools/penalty-calculator-pages'
import { StartupDPIITCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/StartupDPIITCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={dpiitFemaPage}>
      <Suspense fallback={<CalculatorSkeleton />}>
        <StartupDPIITCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
