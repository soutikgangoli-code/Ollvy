/**
 * Race a thenable (a Supabase PostgREST builder is a PromiseLike) against a
 * timeout. On timeout, rejects with TimeoutError instead of letting a stalled
 * request hang for the full Cloudflare 522 window (~100s). Universal (server +
 * client). Generalises the inline Promise.race already in getAllServiceSlugs.
 */
export class TimeoutError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TimeoutError'
  }
}

export const DB_TIMEOUT_MS = 5000
export const AUTH_TIMEOUT_MS = 8000 // auth.getSession may refresh a token (network)

export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  label: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timer = setTimeout(
          () => reject(new TimeoutError(`${label} timed out after ${ms}ms`)),
          ms,
        )
      }),
    ])
  } finally {
    if (timer) clearTimeout(timer)
  }
}
