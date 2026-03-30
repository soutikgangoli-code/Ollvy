import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { LEARN_PAGES } from '@/lib/guides/pages';
import { SERVICE_CONFIGS } from '@/lib/services';

export function LearnInternalLinks({ learnSlugs, serviceSlugs }: {
  learnSlugs: string[];
  serviceSlugs: string[];
}) {
  const relatedLearnPages = learnSlugs
    .map(slug => LEARN_PAGES.find(p => p.slug === slug))
    .filter(Boolean);

  const relatedServices = serviceSlugs
    .map(slug => SERVICE_CONFIGS.find(s => s.slug === slug))
    .filter(Boolean);

  if (relatedLearnPages.length === 0 && relatedServices.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 pt-10 border-t border-border">
      {relatedLearnPages.length > 0 && (
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Related guides
          </p>
          <div className="space-y-2">
            {relatedLearnPages.map((page) => (
              <Link
                key={page!.slug}
                href={`/guides/${page!.slug}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/20 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                    {page!.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {page!.category} · Last reviewed {page!.lastReviewed}
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedServices.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">
            Related services
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedServices.map((service) => (
              <Link
                key={service!.slug}
                href={`/services/${service!.slug}`}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-foreground/30 hover:bg-muted/20 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-foreground/90">
                    {service!.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    ₹{(service!.ollvyFee + (service!.govtFee ?? 0)).toLocaleString('en-IN')} · {service!.slaDays} days
                  </p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
