// Human label for a saved answer whose question has no DB definition (e.g. the
// per-class trademark goods/services fields injected at load time). Keeps the
// admin + customer answer panels coherent for synthetic / dynamic answers.
export function deriveAnswerLabel(key: string): string {
  const cls = key.match(/^goods_services_class_(\d+)$/)
  if (cls) return `Goods & services in Class ${cls[1]}`
  return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}
