import { Metadata } from 'next'
import { DeadlinePage } from '@/components/deadline/DeadlinePage'
import { getDeadlineBySlug } from '@/lib/deadlines'
import { notFound } from 'next/navigation'

const deadline = getDeadlineBySlug('itr-2025')

export const metadata: Metadata = deadline
  ? {
      title: deadline.seoTitle,
      description: deadline.seoDescription,
      alternates: {
        canonical: deadline.canonicalUrl,
      },
    }
  : {}

export default function ITR2025Page() {
  if (!deadline) {
    notFound()
  }

  return <DeadlinePage deadline={deadline} />
}
