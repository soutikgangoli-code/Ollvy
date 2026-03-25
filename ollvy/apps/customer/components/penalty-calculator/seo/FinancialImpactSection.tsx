// components/penalty-calculator/seo/FinancialImpactSection.tsx

interface FinancialImpactSectionProps {
  data: {
    title: string
    scenarios: {
      delay: string
      penalty: string
      interest: string
      total: string
    }[]
    worstCase: {
      description: string
      amount: string
    }
  }
}

export function FinancialImpactSection({ data }: FinancialImpactSectionProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Delay</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Penalty</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground hidden sm:table-cell">Interest</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Total</th>
            </tr>
          </thead>
          <tbody>
            {data.scenarios.map((scenario, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="py-3 px-4 text-foreground font-medium">{scenario.delay}</td>
                <td className="py-3 px-4 text-muted-foreground">{scenario.penalty}</td>
                <td className="py-3 px-4 text-muted-foreground hidden sm:table-cell">{scenario.interest}</td>
                <td className="py-3 px-4 text-foreground font-medium">{scenario.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
        <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Worst Case Scenario</h3>
        <p className="text-sm text-amber-700 dark:text-amber-300">{data.worstCase.description}</p>
        <p className="mt-2 font-semibold text-amber-900 dark:text-amber-100">
          Maximum exposure: {data.worstCase.amount}
        </p>
      </div>
    </section>
  )
}
