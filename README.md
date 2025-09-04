# W7F Website

This project uses Sanity CMS for content management alongside a Next.js frontend.

## Commit Conventions

This project follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for commit messages. All commits should use the format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types include:
- `feat:` - new features
- `fix:` - bug fixes
- `docs:` - documentation updates
- `style:` - formatting changes
- `refactor:` - code refactoring
- `test:` - adding tests
- `chore:` - maintenance tasks

## Content Management System (CMS)

This project uses **Sanity CMS** for headless content management, providing a powerful and flexible backend for managing website content.

### Architecture
- **Sanity Studio**: Located in `studio-website/` directory - a customizable content editing interface
- **Frontend**: Next.js application in the main directory that fetches content from Sanity
- **Content Delivery**: Real-time content updates via Sanity's Content Lake

### Key Features
- **Structured Content**: Define custom schemas for flexible content modeling
- **Real-time Collaboration**: Multiple editors can work simultaneously
- **GROQ Queries**: Powerful query language for fetching exactly the data you need
- **Image CDN**: Automatic image optimization and transformations
- **Version Control**: Built-in revision history for all content changes

### Development Workflow
1. **Schema Definition**: Define content types in `studio-website/schemaTypes/`
2. **Content Creation**: Use Sanity Studio to create and manage content
3. **Frontend Integration**: Query content using GROQ in Next.js components
4. **Live Updates**: Content changes appear immediately on the frontend

### Documentation & Resources
- [Sanity Documentation](https://www.sanity.io/docs) - Complete guide to Sanity CMS
- [GROQ Documentation](https://www.sanity.io/docs/groq) - Query language reference
- [Sanity Studio Documentation](https://www.sanity.io/docs/sanity-studio) - Studio customization guide
- [Next.js Integration](https://www.sanity.io/docs/nextjs) - Sanity + Next.js best practices
- [Image URLs](https://www.sanity.io/docs/image-urls) - Image optimization and transformations

## Image Optimization

When working with Sanity images, always use `auto=format` parameter for optimal image delivery (includes AVIF support):

```javascript
const imageUrl = urlFor(image)
  .width(800)
  .height(600)
  .auto('format') // Enables AVIF + automatic format selection
  .url()
```

This ensures images are served in the most efficient format supported by each browser (AVIF → WebP → JPEG/PNG).

## Component Conventions

All components in this project follow consistent patterns for maintainability and type safety:

### Structure
- Import React and utilities at the top
- Use `React.forwardRef` for proper ref forwarding
- Accept `React.ComponentProps<"element">` for full HTML element support
- Destructure `className` and spread remaining props

### Props Type Declarations
- **If a component has no additional props**: Declare props type inline, don't create a separate type/interface
- **If a component has additional props**: Create a separate interface that extends the base props
- Use `React.ComponentProps<"element">` or `React.HTMLAttributes<HTMLElement>` as base types

### Styling
- Use the `cn` utility from `@/lib/utils` for class merging
- Always accept and merge `className` prop with base styles

### Examples

**Component with no additional props (inline declaration):**
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const MyComponent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("base-styles", className)}
      {...props}
    />
  )
})

MyComponent.displayName = "MyComponent"
```

**Component with additional props (separate interface):**
```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends React.ComponentProps<"div"> {
  variant?: "primary" | "secondary"
  size?: "sm" | "md" | "lg"
}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-styles", variant, size, className)}
        {...props}
      />
    )
  }
)

MyComponent.displayName = "MyComponent"
```

### Exports
- Use named exports in curly braces
- Set `displayName` for better debugging

## Sanity Visual Editing & Drag-and-Drop Implementation

This project uses Sanity's Visual Editing with Presentation mode to enable drag-and-drop functionality for content management. Follow these conventions when implementing new dynamic components:

### Architecture Overview

```
┌─────────────────────────┐     ┌─────────────────────┐
│   Sanity Studio         │     │   Next.js App       │
│                         │     │                     │
│  - Schema definitions   │────▶│  - Server components│
│  - Presentation mode    │     │  - Client wrappers  │
│  - Visual overlays      │     │  - Data attributes  │
└─────────────────────────┘     └─────────────────────┘
                │                          │
                └──────────┬───────────────┘
                           │
                    ┌──────▼──────┐
                    │ Draft Mode  │
                    │  - Preview  │
                    │  - Editing  │
                    └─────────────┘
```

### 1. Schema Design Conventions

When creating schemas for drag-and-drop content:

```typescript
// schemaTypes/[name]Type.ts
export const myContentType = defineType({
  name: 'myContent',
  title: 'My Content',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
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
                    // Nested array fields...
                  ],
                  preview: {
                    select: { /* preview config */ },
                  },
                },
              ],
            },
          ],
          preview: {
            select: { /* preview config */ },
          },
        },
      ],
    }),
  ],
})
```

**Key Requirements:**
- Arrays must be used for reorderable content
- Each array item MUST have a `_key` (automatically generated)
- Nested arrays must be wrapped in object types
- Include preview configurations for better Studio UX

### 2. Component Structure Pattern

Follow this three-part pattern for drag-and-drop components:

#### a) Server Component (Data Fetching)
```tsx
// components/[feature]/[name]-main.tsx
import { getData } from "@/sanity/queries/data"
import { DynamicItems } from "./dynamic-items"

export async function MainComponent() {
  const data = await getData()
  
  const sanityConfig = {
    projectId: '439zkmb5',
    dataset: 'production',
    baseUrl: '/studio',
  }

  return (
    <Container>
      {/* Static content */}
      
      {data ? (
        <DynamicItems
          documentId={data._id}
          documentType={data._type}
          items={data.items}
          {...sanityConfig}
        />
      ) : (
        <FallbackContent />
      )}
    </Container>
  )
}
```

#### b) Client Component (Drag & Drop)
```tsx
// components/[feature]/dynamic-items.tsx
'use client'

import { createDataAttribute, useOptimistic } from '@sanity/visual-editing'
import { stegaClean } from '@sanity/client/stega'

interface DynamicItemsProps {
  documentId: string
  documentType: string
  items: ItemData[] | undefined
  projectId: string
  dataset: string
  baseUrl: string
}

export function DynamicItems({
  documentId,
  documentType,
  items: initialItems,
  projectId,
  dataset,
  baseUrl,
}: DynamicItemsProps) {
  // Enable optimistic updates
  const items = useOptimistic<ItemData[] | undefined>(
    initialItems,
    (currentItems, action) => {
      if (action.id !== documentId) return currentItems
      
      const updatedItems = action.document?.items
      if (updatedItems && Array.isArray(updatedItems)) {
        return updatedItems as ItemData[]
      }
      
      return currentItems
    }
  )

  if (!items || items.length === 0) return null

  return (
    <>
      {items.map((item) => (
        <div
          key={item._key}
          data-sanity={createDataAttribute({
            projectId,
            dataset,
            baseUrl,
            id: documentId,
            type: documentType,
            path: `items[_key=="${item._key}"]`,
          }).toString()}
        >
          {/* Render item content */}
          {/* Use stegaClean() for text to prevent overlay conflicts */}
          <h3>{stegaClean(item.heading)}</h3>
        </div>
      ))}
    </>
  )
}
```

### 3. Data Attributes Convention

Always include proper data attributes for Visual Editing:

```typescript
// For array containers (optional - enables click-to-edit on container)
data-sanity={createDataAttribute({
  projectId,
  dataset,
  baseUrl,
  id: documentId,
  type: documentType,
  path: 'items', // Array field name
}).toString()}

// For array items (required for drag-and-drop)
data-sanity={createDataAttribute({
  projectId,
  dataset,
  baseUrl,
  id: documentId,
  type: documentType,
  path: `items[_key=="${item._key}"]`, // Path with key selector
}).toString()}

// For nested arrays
data-sanity={createDataAttribute({
  projectId,
  dataset,
  baseUrl,
  id: documentId,
  type: documentType,
  path: `items[_key=="${item._key}"].subItems[_key=="${subItem._key}"]`,
}).toString()}
```

### 4. Query Patterns

Create type-safe queries with proper data structure:

```typescript
// sanity/queries/[feature].ts
type MyData = {
  _id: string
  _type: string
  items?: Array<{
    _key: string
    heading?: string
    links?: Array<{
      _key: string
      text?: string
      href?: string
    }>
  }>
}

export async function getMyData(): Promise<MyData | null> {
  return sanityFetch(
    `*[_type == "myContent" && _id == "documentId"][0]{
      _id,
      _type,
      items[] {
        _key,
        heading,
        links[] {
          _key,
          text,
          href
        }
      }
    }`
  )
}
```

### 5. Studio Configuration

For singleton documents (like Navigation):

```typescript
// sanity.config.ts
structureTool({
  structure: (S) =>
    S.list()
      .title('Content')
      .items([
        S.listItem()
          .title('Navigation')
          .id('siteSettings')
          .child(
            S.document()
              .schemaType('siteSettings')
              .documentId('siteSettings')
          ),
        // Other items...
      ]),
})
```

### 6. Best Practices

1. **Client Components**: Only the drag-and-drop wrapper needs to be client-side
2. **Optimistic Updates**: Always implement for instant feedback
3. **Stega Cleaning**: Use `stegaClean()` on text to prevent overlay conflicts
4. **Fallback Content**: Always provide fallback for when Sanity data doesn't exist
5. **Type Safety**: Define TypeScript types for all Sanity data structures
6. **Path Accuracy**: Ensure data-sanity paths exactly match your schema structure

### 7. Testing Drag & Drop

1. Enable draft mode: `/api/sanity/draft-mode/enable?secret=67D747C6-7006-4780-9334-165499A8944C`
2. Open Presentation mode in Studio: `/studio/presentation`
3. Verify:
   - Overlay controls appear on hover
   - Elements can be dragged and reordered
   - Changes save automatically
   - Optimistic updates work instantly

### 8. Common Patterns

**Pattern 1: Simple List**
```
Schema: array of objects
Component: Client wrapper with useOptimistic
Path: `fieldName[_key=="${item._key}"]`
```

**Pattern 2: Nested Lists**
```
Schema: array of objects containing arrays
Component: Nested client components
Path: `parent[_key=="${parentKey}"].children[_key=="${childKey}"]`
```

**Pattern 3: Mixed Static/Dynamic**
```
Server Component: Fetches all data
Client Component: Only wraps dynamic sections
Static Content: Rendered directly in server component
```
