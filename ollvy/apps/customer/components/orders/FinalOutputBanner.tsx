'use client'
import { useEffect, useState } from 'react'
import { getClient } from '@/lib/supabase'

interface FinalOutputBannerProps {
  orderId: string
}

interface FinalDoc {
  file_url: string
  file_name: string
  description?: string
}

export function FinalOutputBanner({ orderId }: FinalOutputBannerProps) {
  const [finalDoc, setFinalDoc] = useState<FinalDoc | null>(null)
  const supabase = getClient()

  useEffect(() => {
    supabase
      .from('order_work_documents')
      .select('file_url, file_name, description')
      .eq('order_id', orderId)
      .eq('tag', 'final_output')
      .eq('direction', 'to_customer')
      .limit(1)
      .maybeSingle()
      .then(({ data }) => setFinalDoc(data))
  }, [orderId])

  if (!finalDoc) return null

  return (
    <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 rounded-lg p-5 mb-4">
      <p className="text-emerald-800 dark:text-emerald-200 font-semibold">Your document is ready</p>
      {finalDoc.description && (
        <p className="text-emerald-700 dark:text-emerald-300 text-sm mt-1">{finalDoc.description}</p>
      )}
      <a
        href={finalDoc.file_url}
        download
        className="mt-3 inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
      >
        Download Now
      </a>
    </div>
  )
}
