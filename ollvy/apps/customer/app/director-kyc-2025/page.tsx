import { Metadata } from 'next'
import { DeadlinePage } from '@/components/deadline/DeadlinePage'
import { getDeadlineBySlug } from '@/lib/deadlines'
import { notFound } from 'next/navigation'

const deadline = getDeadlineBySlug('director-kyc-2025')

export const metadata: Metadata = deadline
  ? {
      title: deadline.seoTitle,
      description: deadline.seoDescription,
      alternates: {
        canonical: deadline.canonicalUrl,
      },
      openGraph: {
        title: deadline.seoTitle,
        description: deadline.seoDescription,
        url: deadline.canonicalUrl,
        siteName: 'Ollvy',
        images: [{ url: 'https://www.ollvy.com/logo.png', width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: deadline.seoTitle,
        description: deadline.seoDescription,
        images: ['https://www.ollvy.com/logo.png'],
      },
    }
  : {}

export default function DirectorKYC2025Page() {
  if (!deadline) {
    notFound()
  }

  return <DeadlinePage deadline={deadline} />
}
