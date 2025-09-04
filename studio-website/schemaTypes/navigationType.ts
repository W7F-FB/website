import {defineField, defineType} from 'sanity'

export const navigationType = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'footerColumns',
      title: 'Footer Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Column Heading',
              type: 'string',
              validation: (rule) => rule.required(),
            },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'text',
                      title: 'Link Text',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    },
                    {
                      name: 'href',
                      title: 'Link URL',
                      type: 'string',
                      validation: (rule) => rule.required(),
                    },
                    {
                      name: 'isExternal',
                      title: 'External Link',
                      type: 'boolean',
                      initialValue: false,
                    },
                  ],
                  preview: {
                    select: {
                      title: 'text',
                      subtitle: 'href',
                    },
                  },
                },
              ],
            },
          ],
          preview: {
            select: {
              title: 'heading',
              links: 'links',
            },
            prepare({title, links}) {
              const linksCount = links?.length || 0
              return {
                title: title || 'Untitled Column',
                subtitle: `${linksCount} links`,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      footerColumns: 'footerColumns',
    },
    prepare({footerColumns}) {
      const footerColumnsCount = footerColumns?.length || 0
      return {
        title: 'Navigation',
        subtitle: `${footerColumnsCount} footer columns`,
      }
    },
  },
})
