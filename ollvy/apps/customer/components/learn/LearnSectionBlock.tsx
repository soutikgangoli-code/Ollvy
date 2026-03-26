import { LearnSection, TableRow } from '@/lib/learn/pages';

interface FaqItem {
  q: string;
  a: string;
}

interface ProcessStepItem {
  step: number;
  title: string;
  timeline: string;
  body: string;
  milestone?: string;
  isCompletion?: boolean;
}

function DataTable({ table }: { table: TableRow[] }) {
  if (table.length === 0) return null;
  const keys = Object.keys(table[0]);

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-muted/30">
            {keys.map((key) => (
              <th
                key={key}
                className="px-4 py-3 text-left text-xs font-semibold text-foreground uppercase tracking-wide border-b border-border"
              >
                {table[0][key]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.slice(1).map((row, i) => (
            <tr key={i} className="border-b border-border last:border-b-0 hover:bg-muted/10">
              {keys.map((key, j) => (
                <td
                  key={j}
                  className="px-4 py-3 text-muted-foreground"
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="mt-6 space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-border rounded-lg p-4">
          <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
          <p className="text-sm text-muted-foreground">{faq.a}</p>
        </div>
      ))}
    </div>
  );
}

function ProcessStepper({ steps }: { steps: ProcessStepItem[] }) {
  return (
    <div className="mt-6 space-y-4">
      {steps.map((stepData) => (
        <div
          key={stepData.step}
          className={`border rounded-lg p-4 ${
            stepData.isCompletion
              ? 'border-[hsl(var(--ollvy-green))]/30 bg-[hsl(var(--ollvy-green))]/5'
              : 'border-border'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              stepData.isCompletion
                ? 'bg-[hsl(var(--ollvy-green))] text-white'
                : 'bg-muted text-foreground'
            }`}>
              <span className="text-xs font-bold">{stepData.step}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-semibold text-foreground">{stepData.title}</p>
                <span className="text-xs text-muted-foreground">· {stepData.timeline}</span>
              </div>
              <p className="text-sm text-muted-foreground">{stepData.body}</p>
              {stepData.milestone && (
                <p className="text-xs text-[hsl(var(--ollvy-green))] mt-2 font-medium">
                  ✓ {stepData.milestone}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function LearnSectionBlock({ section }: { section: LearnSection }) {
  const faqs = section.componentProps?.faqs as FaqItem[] | undefined;
  const steps = section.componentProps?.steps as ProcessStepItem[] | undefined;
  const bullets = section.bullets || section.list;

  return (
    <div>
      {/* Section header - with optional number */}
      {section.number ? (
        <div className="flex items-baseline gap-3 mb-4">
          <span className="font-mono text-[10px] text-muted-foreground">{section.number}</span>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            {section.heading}
          </h2>
        </div>
      ) : (
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {section.heading}
        </h2>
      )}

      {section.body && (
        <div className="prose prose-sm prose-invert max-w-none text-muted-foreground leading-relaxed">
          {section.body.split('\n\n').map((paragraph, i) => (
            <div key={i} className="mb-4">
              {paragraph.split('\n').map((line, j) => {
                const processedLine = line.replace(
                  /\*\*(.*?)\*\*/g,
                  '<strong class="text-foreground font-semibold">$1</strong>'
                );
                const finalLine = processedLine.replace(
                  /\*(.*?)\*/g,
                  '<em>$1</em>'
                );

                if (line.startsWith('- ')) {
                  return (
                    <div key={j} className="flex gap-2 ml-4">
                      <span className="text-muted-foreground">•</span>
                      <span dangerouslySetInnerHTML={{ __html: finalLine.substring(2) }} />
                    </div>
                  );
                }

                return (
                  <p
                    key={j}
                    dangerouslySetInnerHTML={{ __html: finalLine }}
                    className={j > 0 ? 'mt-1' : ''}
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {section.table && section.table.length > 0 && (
        <DataTable table={section.table} />
      )}

      {bullets && bullets.length > 0 && (
        <ul className="mt-4 space-y-2">
          {bullets.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="text-muted-foreground mt-1.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {section.componentSlot === 'faq-list' && faqs && faqs.length > 0 && (
        <FaqList faqs={faqs} />
      )}

      {section.componentSlot === 'process-stepper' && steps && steps.length > 0 && (
        <ProcessStepper steps={steps} />
      )}

      {section.note && (
        <p className="text-xs text-muted-foreground mt-4 italic border-l-2 border-border pl-3">
          {section.note}
        </p>
      )}
    </div>
  );
}
