import {defineField, defineType} from 'sanity'

export const tournamentType = defineType({
  name: 'tournament',
  title: 'Tournament',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'navImage',
      title: 'Nav Image',
      type: 'image',
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
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      validation: (rule) => rule.required().min(rule.valueOfField('startDate')),
    }),
    defineField({
      name: 'showInNavigation',
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
      hidden: ({document}) => !document?.showInNavigation,
      initialValue: 100,
    }),
  ],
})
