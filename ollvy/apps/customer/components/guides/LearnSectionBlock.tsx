import { LearnSection, LearnSectionTable } from '@/lib/guides/pages';
import { LearnSectionTable as LearnSectionTableComponent } from './LearnSectionTable';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Convert ALL CAPS or mixed case to Title Case for SEO-friendly headings
function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

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

function FaqList({ faqs }: { faqs: FaqItem[] }) {
  return (
    <div className="mt-6">
      <Accordion type="single" collapsible className="space-y-0">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="border-b border-border last:border-0"
          >
            <AccordionTrigger className="text-sm font-medium text-foreground text-left py-4 hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
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
          <h2 className="text-sm font-semibold text-foreground tracking-wide">
            {toTitleCase(section.heading)}
          </h2>
        </div>
      ) : (
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {toTitleCase(section.heading)}
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

      {section.table && (
        <LearnSectionTableComponent table={section.table} />
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
        <div className="min-h-[400px]">
          <FaqList faqs={faqs} />
        </div>
      )}

      {section.componentSlot === 'process-stepper' && steps && steps.length > 0 && (
        <div className="min-h-[400px]">
          <ProcessStepper steps={steps} />
        </div>
      )}

      {section.note && (
        <p className="text-xs text-muted-foreground mt-4 italic border-l-2 border-border pl-3">
          {section.note}
        </p>
      )}
    </div>
  );
}
