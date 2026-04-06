import { Suspense } from 'react'
import { professionalTaxPage } from '@/lib/tools/penalty-calculator-pages'
import { ProfessionalTaxCalculator, CalculatorSkeleton } from '@/components/penalty-calculator/ProfessionalTaxCalculator'
import { ToolPageWrapper } from '@/components/tools/ToolPageWrapper'

export default function Page() {
  return (
    <ToolPageWrapper config={professionalTaxPage}>
      <Suspense fallback={<CalculatorSkeleton />}>
        <ProfessionalTaxCalculator />
      </Suspense>
    </ToolPageWrapper>
  )
}
