/**
 * SWR fetcher utility
 */

export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    // Try to extract error details from response body
    let errorMessage = 'An error occurred while fetching the data.'
    try {
      const contentType = res.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        const errorData = await res.json()
        if (errorData.error) {
          errorMessage = typeof errorData.error === 'string'
            ? errorData.error
            : errorData.error.message || errorMessage
        } else if (errorData.message) {
          errorMessage = errorData.message
        }
      } else {
        const text = await res.text()
        if (text && text.length < 200) {
          errorMessage = text
        }
      }
    } catch {
      // If parsing fails, use status text as fallback
      errorMessage = res.statusText || errorMessage
    }
    const error = new Error(errorMessage)
    ;(error as any).status = res.status
    throw error
  }
  return res.json()
}
