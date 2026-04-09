// lib/guides/types/learn-section-table.ts
// Add this interface to your existing LearnSection type

export interface LearnSectionTable {
  caption?: string   // renders as <caption> - used by Google for featured snippets
  headers: string[]  // <th> cells
  rows: string[][]   // <td> cells - each inner array is one row
}

// Updated LearnSection with table support:
// interface LearnSection {
//   number?: string
//   heading: string
//   body: string
//   bullets?: string[]
//   table?: LearnSectionTable   <-- add this
//   note?: string
// }
