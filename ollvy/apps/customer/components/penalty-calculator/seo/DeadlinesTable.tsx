// components/penalty-calculator/seo/DeadlinesTable.tsx

interface DeadlinesTableProps {
  data: {
    title: string
    dates: {
      form: string
      dueDate: string
      frequency: string
    }[]
  }
}

export function DeadlinesTable({ data }: DeadlinesTableProps) {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-semibold text-foreground">{data.title}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold text-foreground">Form / Filing</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Due Date</th>
              <th className="text-left py-3 px-4 font-semibold text-foreground">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {data.dates.map((item, index) => (
              <tr key={index} className="border-b border-border last:border-0">
                <td className="py-3 px-4 text-foreground">{item.form}</td>
                <td className="py-3 px-4 text-muted-foreground font-medium">{item.dueDate}</td>
                <td className="py-3 px-4 text-muted-foreground">{item.frequency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
