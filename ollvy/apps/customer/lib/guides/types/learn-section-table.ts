/**
 * Type for comparison/reference tables inside LearnSection
 *
 * Used by LearnSectionBlock to render data tables in guide pages.
 * Each table can optionally have a caption for context.
 */

export interface LearnSectionTable {
  /** Optional caption displayed above the table */
  caption?: string
  /** Header row values */
  headers: string[]
  /** Data rows - each row is an array of cell values matching headers */
  rows: string[][]
}
