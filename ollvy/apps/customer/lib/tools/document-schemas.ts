import { DocumentCategory } from '@/components/tools/DocumentChecklistContent'

export function generateDocumentListSchema(
  categories: DocumentCategory[],
  pageTitle: string,
  pageUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${pageTitle} - Required Documents`,
    description: `Complete list of documents required for ${pageTitle}`,
    url: pageUrl,
    numberOfItems: categories.reduce((acc, cat) => acc + cat.items.length, 0),
    itemListElement: categories.flatMap((category, catIndex) =>
      category.items.map((item, itemIndex) => ({
        '@type': 'ListItem',
        position: catIndex * 100 + itemIndex + 1,
        item: {
          '@type': 'HowToSupply',
          name: item.name,
          description: item.note,
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
            item.details.length > 0 && {
              itemListElement: item.details.map((detail, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: detail,
              })),
            }),
        },
      }))
    ),
  }
}
