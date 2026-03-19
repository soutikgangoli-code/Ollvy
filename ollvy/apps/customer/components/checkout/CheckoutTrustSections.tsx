'use client'

import { useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Comparison Section
interface ComparisonItem {
  feature: string
  ollvy: string
  other: string
}

interface ComparisonSectionProps {
  items?: ComparisonItem[]
  className?: string
}

const defaultComparisons: ComparisonItem[] = [
  {
    feature: 'Price transparency',
    ollvy: 'Fixed price shown upfront, no hidden charges',
    other: 'Base price + "processing fees" added later',
  },
  {
    feature: 'Document verification',
    ollvy: 'Errors flagged before filing, rework on us',
    other: 'Application rejected, refile fees on you',
  },
  {
    feature: 'CA assignment',
    ollvy: 'Dedicated CA with direct WhatsApp contact',
    other: 'Rotated between support agents',
  },
  {
    feature: 'Progress tracking',
    ollvy: 'Real-time status in your dashboard',
    other: 'Email updates, no visibility',
  },
  {
    feature: 'Post-incorporation support',
    ollvy: 'Same CA available for follow-up services',
    other: 'Start over with new agent each time',
  },
]

export function ComparisonSection({ items = defaultComparisons, className }: ComparisonSectionProps) {
  return (
    <div className={cn('py-12', className)}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">COMPARE</p>
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">Ollvy vs. doing it yourself</h3>

      <div className="border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-3 bg-muted border-b border-border">
          <div className="p-4 text-sm font-medium text-muted-foreground">Feature</div>
          <div className="p-4 text-sm font-medium text-[hsl(var(--ollvy-green-fg))]">Ollvy</div>
          <div className="p-4 text-sm font-medium text-muted-foreground">Others</div>
        </div>

        {/* Rows */}
        {items.map((item, index) => (
          <div
            key={index}
            className={cn(
              'grid grid-cols-3 border-b border-border last:border-b-0',
              index % 2 === 1 && 'bg-muted'
            )}
          >
            <div className="p-4 text-sm text-foreground font-medium">{item.feature}</div>
            <div className="p-4 text-sm text-muted-foreground">{item.ollvy}</div>
            <div className="p-4 text-sm text-muted-foreground">{item.other}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Testimonials Section
interface Testimonial {
  quote: string
  name: string
  title: string
}

interface TestimonialsSectionProps {
  testimonials?: Testimonial[]
  serviceName?: string
  className?: string
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: 'The CA assigned to me was incredibly responsive. Got my incorporation done in 12 days flat, including the name approval delay from MCA.',
    name: 'Rahul Verma',
    title: 'Founder - SaaS startup, Bangalore',
  },
  {
    quote: 'I had tried another service before and got stuck in document loops for weeks. Ollvy flagged all issues upfront and we filed correctly the first time.',
    name: 'Priya Sharma',
    title: 'Co-founder - D2C brand, Mumbai',
  },
  {
    quote: 'What I liked most was the WhatsApp access to my CA. No ticket systems, no waiting for email replies. Just quick answers when I needed them.',
    name: 'Amit Patel',
    title: 'Founder - Consulting firm, Delhi',
  },
]

export function TestimonialsSection({
  testimonials = defaultTestimonials,
  serviceName = 'Pvt Ltd registration',
  className,
}: TestimonialsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className={cn('py-12', className)}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">TESTIMONIALS</p>
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">
        What customers say about {serviceName}
      </h3>

      {/* Desktop: show all 3 */}
      <div className="hidden md:grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="border border-border rounded-xl p-5"
          >
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              "{testimonial.quote}"
            </p>
            <div>
              <p className="text-sm font-medium text-foreground">{testimonial.name}</p>
              <p className="text-xs text-muted-foreground">{testimonial.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: carousel */}
      <div className="md:hidden">
        <div className="border border-border rounded-xl p-5">
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            "{testimonials[currentIndex].quote}"
          </p>
          <div>
            <p className="text-sm font-medium text-foreground">{testimonials[currentIndex].name}</p>
            <p className="text-xs text-muted-foreground">{testimonials[currentIndex].title}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={goToPrev}
            className="p-2 border border-border rounded hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <div
                key={index}
                className={cn(
                  'w-2 h-2 rounded-full',
                  index === currentIndex ? 'bg-[hsl(var(--ollvy-green))]' : 'bg-border'
                )}
              />
            ))}
          </div>
          <button
            onClick={goToNext}
            className="p-2 border border-border rounded hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </div>
  )
}

// FAQ Section
interface FAQItem {
  question: string
  answer: string
}

interface FAQSectionProps {
  faqs?: FAQItem[]
  className?: string
}

const defaultFAQs: FAQItem[] = [
  {
    question: 'Can I register with just 1 director?',
    answer: 'No, a Private Limited Company requires a minimum of 2 directors and 2 shareholders. However, both roles can be held by the same 2 people. If you want to operate solo, consider an LLP or One Person Company (OPC) instead.',
  },
  {
    question: 'Do I need a physical office address for registration?',
    answer: 'Yes, you need a registered office address where official communication can be sent. This can be a rented space, owned property, or a virtual office. You\'ll need to provide proof of address (rent agreement or utility bill).',
  },
  {
    question: 'What if my preferred company name is taken?',
    answer: 'We check name availability before filing via MCA\'s RUN portal. If your first choice is taken, we\'ll suggest alternatives. You can provide up to 6 name options in order of preference.',
  },
  {
    question: 'Can I convert to a Pvt Ltd later if I start as a proprietorship?',
    answer: 'Yes, you can convert from a proprietorship to a Pvt Ltd later, but it involves a separate registration process with additional fees. Starting as a Pvt Ltd is recommended if you plan to raise funding or have multiple co-founders.',
  },
  {
    question: 'Will someone from Ollvy help me after incorporation is done?',
    answer: 'Yes, your assigned CA remains available for post-incorporation queries. For ongoing compliance (annual filings, GST returns), you can continue working with them through our platform at discounted rates.',
  },
]

export function FAQSection({ faqs = defaultFAQs, className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className={cn('py-12', className)}>
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">FAQ</p>
      <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-6">Frequently asked questions</h3>

      <div className="border border-border rounded-xl divide-y divide-border">
        {faqs.map((faq, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-muted transition-colors"
            >
              <span className="font-medium text-foreground pr-4">{faq.question}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform',
                  openIndex === index && 'rotate-180'
                )}
              />
            </button>
            {openIndex === index && (
              <div className="px-4 pb-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
