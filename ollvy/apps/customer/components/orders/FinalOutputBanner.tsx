'use client'

interface FinalDoc {
  file_url?: string
  file_name?: string
  description?: string
}

interface FinalOutputBannerProps {
  finalDoc?: FinalDoc | null
}

export function FinalOutputBanner({ finalDoc }: FinalOutputBannerProps) {
  // Only show banner if document exists AND has a file_url (meaning it was uploaded)
  if (!finalDoc || !finalDoc.file_url) return null

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
