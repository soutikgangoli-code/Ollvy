import { DocumentCategory } from '@/components/tools/DocumentChecklistContent'

export function generateDocumentListSchema(
  categories: DocumentCategory[],
  pageTitle: string,
  pageUrl: string
) {
  // Validate inputs to prevent invalid schema generation
  if (!categories || !Array.isArray(categories)) {
    return null
  }

  const validCategories = categories.filter(cat => cat && Array.isArray(cat.items))
  if (validCategories.length === 0) {
    return null
  }

  // Calculate running position for items across all categories
  // This avoids the catIndex * 100 assumption that breaks with >100 items
  let runningPosition = 0
  const itemListElement = validCategories.flatMap((category) =>
    category.items.map((item) => {
      runningPosition++
      return {
        '@type': 'ListItem',
        position: runningPosition,
        item: {
          '@type': 'HowToSupply',
          name: item.name || 'Unnamed Document',
          description: item.note || '',
          ...(item.whatIsIt && {
            disambiguatingDescription: item.whatIsIt,
          }),
          ...(item.howToGet && {
            potentialAction: {
              '@type': 'Action',
              name: 'How to obtain',
              description: item.howToGet,
            },
          }),
          ...(item.usualIssues && {
            hasPart: {
              '@type': 'Warning',
              name: 'Common Issues',
              description: item.usualIssues,
            },
          }),
          ...(item.details &&
            Array.isArray(item.details) &&
            item.details.length > 0 && {
              itemListElement: item.details.map((detail, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: detail,
              })),
            }),
        },
      }
    })
  )

  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${pageTitle} - Required Documents`,
    description: `Complete list of documents required for ${pageTitle}`,
    url: pageUrl,
    numberOfItems: itemListElement.length,
    itemListElement,
  }
}
