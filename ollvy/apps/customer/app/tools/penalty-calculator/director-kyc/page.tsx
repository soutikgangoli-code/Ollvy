import { Suspense } from 'react'
import { directorKycPage } from '@/lib/tools/penalty-calculator-pages'
import { DirectorKYCCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/DirectorKYCCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={directorKycPage}>
      <Suspense fallback={<CalculatorSkeleton />}>
        <DirectorKYCCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
