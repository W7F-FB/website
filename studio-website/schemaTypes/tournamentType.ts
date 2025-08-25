import {defineField, defineType} from 'sanity'

export const tournamentType = defineType({
  name: 'tournament',
  title: 'Tournament',
  type: 'document',
  fieldsets: [
    {
      name: 'dateRange',
      title: 'Date Range',
      options: {
        collapsible: true,
        collapsed: false,
      },
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'countryCode',
      title: 'Country Code',
      type: 'string',
      validation: (rule) => rule.required().length(2).uppercase(),
      description: 'Two-letter country code (e.g., US, UK, FR)',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      fieldset: 'dateRange',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      fieldset: 'dateRange',
      validation: (rule) => rule.required().min(rule.valueOfField('startDate')),
    }),
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'object',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show in Navigation',
          type: 'boolean',
          description: 'Display this tournament in the main navigation menu',
          initialValue: false,
        }),
        defineField({
          name: 'navigationOrder',
          title: 'Navigation Order',
          type: 'number',
          description: 'Order in navigation (lower numbers appear first)',
          initialValue: 100,
          hidden: ({parent}) => !parent?.enabled,
        }),
        defineField({
          name: 'navImage',
          title: 'Nav Image',
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
              validation: (rule) => rule.required(),
            }
          ],
          validation: (rule) => rule.required(),
          hidden: ({parent}) => !parent?.enabled,
        }),
      ],
    }),
  ],
})
