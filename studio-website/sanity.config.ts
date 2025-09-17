import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from '@sanity/presentation'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Website',

  projectId: '439zkmb5',
  dataset: 'production',

  plugins: [
    structureTool({
      title: 'Content',
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Navigation')
              .id('navigation')
              .child(
                S.document()
                  .schemaType('navigation')
                  .documentId('navigation')
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !['navigation'].includes(listItem.getId() ?? '')
            ),
          ]),
    }),
    // visionTool(), // Temporarily disabled for cleaner editor experience
    presentationTool({
      previewUrl: {
        origin: 'http://localhost:3000/',
        previewMode: {
          enable: '/api/sanity/draft-mode/enable?secret=67D747C6-7006-4780-9334-165499A8944C',
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
