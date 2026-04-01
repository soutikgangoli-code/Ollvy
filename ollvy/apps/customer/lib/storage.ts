import { getClient } from './supabase'

/**
 * Gets a signed URL for a file in Supabase storage.
 * Handles both storage paths (bucket/path) and legacy full URLs.
 *
 * @param fileUrl - Either a storage path like "order-documents/orders/..." or a full URL
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL for accessing the file
 */
export async function getSignedUrl(
  fileUrl: string,
  expiresIn: number = 3600
): Promise<string | null> {
  // If it's already a full URL (legacy), return as-is
  // But these won't work for private buckets - they'll 404
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://')) {
    // Try to extract bucket and path from Supabase public URL
    // Format: https://xxx.supabase.co/storage/v1/object/public/bucket-name/path
    const publicMatch = fileUrl.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
    if (publicMatch) {
      const [, bucket, path] = publicMatch
      const supabase = getClient()
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn)

      if (!error && data?.signedUrl) {
        return data.signedUrl
      }
    }
    // If we can't parse it, return the original URL
    return fileUrl
  }

  // It's a storage path format: "bucket-name/path/to/file"
  const [bucket, ...pathParts] = fileUrl.split('/')
  const filePath = pathParts.join('/')

  if (!bucket || !filePath) {
    console.error('Invalid storage path:', fileUrl)
    return null
  }

  const supabase = getClient()
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(filePath, expiresIn)

  if (error) {
    console.error('Failed to generate signed URL:', error)
    return null
  }

  return data.signedUrl
}

/**
 * Downloads a file from Supabase storage.
 * Opens the signed URL in a new tab for download.
 */
export async function downloadFile(fileUrl: string, fileName?: string): Promise<void> {
  const signedUrl = await getSignedUrl(fileUrl)

  if (!signedUrl) {
    throw new Error('Failed to get download URL')
  }

  // Create a temporary link and click it to download
  const link = document.createElement('a')
  link.href = signedUrl
  link.download = fileName || 'download'
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
