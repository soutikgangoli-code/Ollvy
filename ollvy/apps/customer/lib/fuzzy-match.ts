// Forgiving text matching for search boxes — substring, out-of-order/partial
// typing (subsequence), and typos (per-word edit distance). Shared by the
// questionnaire class search and the services search.

export function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (!m) return n
  if (!n) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  for (let i = 1; i <= m; i++) {
    const curr = [i]
    for (let j = 1; j <= n; j++) {
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    prev = curr
  }
  return prev[n]
}

// True if `query` reasonably matches `text`: exact substring, an in-order
// subsequence, or within a small edit distance of any word (typo tolerance).
export function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase().trim()
  if (!q) return true
  const t = (text || '').toLowerCase()
  if (!t) return false
  if (t.includes(q)) return true

  // subsequence: query characters appear in order somewhere in the text
  let i = 0
  for (let k = 0; k < t.length && i < q.length; k++) {
    if (t[k] === q[i]) i++
  }
  if (i === q.length) return true

  // typo tolerance against each word
  const threshold = q.length <= 4 ? 1 : 2
  return t.split(/[^a-z0-9]+/).some((w) => w.length > 0 && levenshtein(q, w) <= threshold)
}

// Match a query against several fields (name, description, etc.).
export function fuzzyMatchAny(query: string, fields: Array<string | null | undefined>): boolean {
  if (!query.trim()) return true
  return fields.some((f) => f && fuzzyMatch(query, f))
}
