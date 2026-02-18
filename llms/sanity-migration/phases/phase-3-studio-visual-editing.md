# Phase 3: Sanity Studio & Visual Editing

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Set up an embedded Sanity Studio at `/studio` with custom desk structure, Visual Editing with click-to-edit overlays, and a polished client-facing editing experience.

**Architecture:** Sanity Studio v3 embedded in the Next.js App Router via `next-sanity/studio`. Visual Editing uses `defineLive` from `next-sanity` with stega encoding for automatic click-to-edit overlays. The Presentation Tool provides side-by-side editing in the Studio. Custom desk structure organizes content by workflow with filtered sub-views.

**Tech Stack:** `sanity`, `next-sanity`, `@sanity/vision`, `lucide-react` (icons)

**Prerequisites:** Phase 1 (schemas) and Phase 2 (data fetching) must be complete. All Sanity schemas should be defined and the `sanityFetch` / `defineLive` setup should exist.

---

## Table of Contents

1. [Embedded Studio Setup](#1-embedded-studio-setup)
2. [Custom Desk Structure](#2-custom-desk-structure)
3. [Studio Plugins](#3-studio-plugins)
4. [Visual Editing Implementation](#4-visual-editing-implementation)
5. [Presentation Tool Configuration](#5-presentation-tool-configuration)
6. [Access Control](#6-access-control)
7. [Client Onboarding UX](#7-client-onboarding-ux)
8. [Migration from Prismic Preview](#8-migration-from-prismic-preview)

---

## 1. Embedded Studio Setup

### 1.1 Studio Route

The Studio is a client-side React app embedded at `/studio` using the Next.js App Router catch-all route pattern. `dynamic = 'force-static'` tells Next.js to statically generate the Studio shell for faster loads.

```tsx
// src/app/studio/[[...tool]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

**Why `[[...tool]]`?** The double brackets make the catch-all optional — `/studio` works (loads default tool), and `/studio/structure/tournament/abc123` also works (deep links into the desk structure). Sanity Studio handles its own internal routing.

### 1.2 Studio Layout (Strip Site Chrome)

The Studio needs its own layout to exclude the site's navigation bar, footer, and global styles that would interfere with the Studio UI.

```tsx
// src/app/studio/layout.tsx
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  )
}
```

**Why a separate layout?** The root `src/app/layout.tsx` includes the site nav, footer, `<ClipPaths>`, `<MetallicGradients>`, Google Tag Manager, and the Prismic toolbar. None of these should render inside the Studio. By placing a `layout.tsx` inside `/studio`, Next.js uses this layout instead of the root one for all `/studio/*` routes.

### 1.3 Studio Configuration

```typescript
// src/sanity/sanity.config.ts
'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemas'
import { structure, defaultDocumentNode } from './structure'
import { w7fTheme } from './theme'

export default defineConfig({
  name: 'w7f-studio',
  title: 'World Sevens Football',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  theme: w7fTheme,

  plugins: [
    structureTool({
      structure,
      defaultDocumentNode,
    }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool({
      defaultApiVersion: '2025-03-04',
      defaultDataset: 'production',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
```

**Key points:**
- `basePath: '/studio'` must match the route path exactly
- `'use client'` is required because the Studio is a client-side app
- Plugin order determines tab order in the Studio navbar: Structure (content editing) first, Presentation (visual editing) second, Vision (GROQ playground) third
- The `theme` property applies the W7F branding (see Section 7)

### 1.4 Environment Variables

```env
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=https://worldsevensfootball.com/studio
SANITY_API_READ_TOKEN=<viewer-token>
SANITY_API_WRITE_TOKEN=<editor-token>   # Migration scripts only — never expose to client
```

The `NEXT_PUBLIC_` prefix makes variables available in the browser (required for the Studio client component). `SANITY_API_READ_TOKEN` stays server-side only and is used by `defineLive` for draft content fetching.

### 1.5 Next.js Config Update

```typescript
// next.config.ts — update the images config
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      // Keep any non-Prismic domains that are still needed (e.g., Opta)
    ],
  },
}
```

Remove `images.prismic.io` from the allowed domains and add `cdn.sanity.io`.

---

## 2. Custom Desk Structure

### 2.1 Design Goals

The desk structure is the sidebar navigation the client uses to find and edit content. It should:

1. **Group by workflow** — the client thinks in terms of "I need to update the tournament" or "I need to publish a news article", not "I need to edit a `blog` document type"
2. **Filter by status** — Tournaments have "Live", "Upcoming", and "Completed" states; the client should be able to quickly find what they need
3. **Prevent singleton duplication** — Site Settings should never have a "Create new" button
4. **Use visual icons** — each section gets a recognizable icon for fast scanning
5. **Show document counts** — so the client knows how many items are in each section

### 2.2 Icon Imports

We use `lucide-react` icons because they're already in the project (via shadcn/ui). If the project doesn't have `lucide-react`, install it — it's a lightweight icon library.

```typescript
// Icons used in desk structure
import {
  Trophy,          // Tournaments
  Users,           // Teams & Players
  Newspaper,       // News & Content
  Handshake,       // Partners & Sponsors
  Building2,       // Organization
  Settings,        // Site Settings
  Swords,          // Matches
  Award,           // Awards
  UserCircle,      // Players
  Shield,          // Teams
  Tag,             // Blog Categories
  FileText,        // Pages
  Tv,              // Broadcast Partners
  Star,            // Sponsors
  BadgeCheck,      // Leadership
  ScrollText,      // Policies
  Zap,             // Live Tournaments
  Clock,           // Upcoming Tournaments
  CheckCircle,     // Completed Tournaments
} from 'lucide-react'
```

### 2.3 Complete Desk Structure Implementation

```typescript
// src/sanity/structure/index.ts
import type { StructureResolver, DefaultDocumentNodeResolver } from 'sanity/structure'
import {
  Trophy, Users, Newspaper, Handshake, Building2, Settings,
  Swords, Award, UserCircle, Shield, Tag, FileText,
  Tv, Star, BadgeCheck, ScrollText, Zap, Clock, CheckCircle,
} from 'lucide-react'

// Document types managed through the custom structure
// (excluded from the auto-generated list to avoid duplicates)
const MANAGED_TYPES = [
  'tournament', 'match', 'award',
  'team', 'player',
  'blog', 'blogCategory', 'page',
  'broadcastPartner', 'sponsor',
  'teamMember', 'policy',
  'siteSettings',
]

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      // ─── Site Settings (Singleton) ───────────────────────────
      S.listItem()
        .title('Site Settings')
        .icon(Settings)
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Site Settings')
        ),

      S.divider(),

      // ─── Tournaments ─────────────────────────────────────────
      S.listItem()
        .title('Tournaments')
        .icon(Trophy)
        .child(
          S.list()
            .title('Tournaments')
            .items([
              // All Tournaments
              S.listItem()
                .title('All Tournaments')
                .icon(Trophy)
                .child(
                  S.documentTypeList('tournament')
                    .title('All Tournaments')
                ),

              S.divider(),

              // Live Tournaments (filtered)
              S.listItem()
                .title('Live')
                .icon(Zap)
                .child(
                  S.documentList()
                    .title('Live Tournaments')
                    .filter('_type == "tournament" && status == "Live"')
                    .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                ),

              // Upcoming Tournaments (filtered)
              S.listItem()
                .title('Upcoming')
                .icon(Clock)
                .child(
                  S.documentList()
                    .title('Upcoming Tournaments')
                    .filter('_type == "tournament" && status == "Upcoming"')
                    .defaultOrdering([{ field: 'startDate', direction: 'asc' }])
                ),

              // Completed Tournaments (filtered)
              S.listItem()
                .title('Completed')
                .icon(CheckCircle)
                .child(
                  S.documentList()
                    .title('Completed Tournaments')
                    .filter('_type == "tournament" && status == "Complete"')
                    .defaultOrdering([{ field: 'startDate', direction: 'desc' }])
                ),

              S.divider(),

              // Matches
              S.listItem()
                .title('Matches')
                .icon(Swords)
                .child(
                  S.documentTypeList('match')
                    .title('All Matches')
                ),

              // Awards
              S.listItem()
                .title('Awards')
                .icon(Award)
                .child(
                  S.documentTypeList('award')
                    .title('All Awards')
                ),
            ])
        ),

      // ─── Teams & Players ─────────────────────────────────────
      S.listItem()
        .title('Teams & Players')
        .icon(Users)
        .child(
          S.list()
            .title('Teams & Players')
            .items([
              S.listItem()
                .title('Teams')
                .icon(Shield)
                .child(
                  S.documentTypeList('team')
                    .title('All Teams')
                    .defaultOrdering([
                      { field: 'alphabeticalSortString', direction: 'asc' },
                    ])
                ),

              S.listItem()
                .title('Players')
                .icon(UserCircle)
                .child(
                  S.documentTypeList('player')
                    .title('All Players')
                ),
            ])
        ),

      // ─── News & Content ──────────────────────────────────────
      S.listItem()
        .title('News & Content')
        .icon(Newspaper)
        .child(
          S.list()
            .title('News & Content')
            .items([
              S.listItem()
                .title('Blog Posts')
                .icon(Newspaper)
                .child(
                  S.documentTypeList('blog')
                    .title('All Blog Posts')
                    .defaultOrdering([{ field: 'date', direction: 'desc' }])
                ),

              S.listItem()
                .title('Categories')
                .icon(Tag)
                .child(
                  S.documentTypeList('blogCategory')
                    .title('Blog Categories')
                ),

              S.divider(),

              S.listItem()
                .title('Pages')
                .icon(FileText)
                .child(
                  S.documentTypeList('page')
                    .title('All Pages')
                ),
            ])
        ),

      // ─── Partners & Sponsors ─────────────────────────────────
      S.listItem()
        .title('Partners & Sponsors')
        .icon(Handshake)
        .child(
          S.list()
            .title('Partners & Sponsors')
            .items([
              S.listItem()
                .title('Broadcast Partners')
                .icon(Tv)
                .child(
                  S.documentTypeList('broadcastPartner')
                    .title('All Broadcast Partners')
                ),

              S.listItem()
                .title('Sponsors')
                .icon(Star)
                .child(
                  S.documentTypeList('sponsor')
                    .title('All Sponsors')
                    .defaultOrdering([{ field: 'sortOrder', direction: 'asc' }])
                ),
            ])
        ),

      // ─── Organization ────────────────────────────────────────
      S.listItem()
        .title('Organization')
        .icon(Building2)
        .child(
          S.list()
            .title('Organization')
            .items([
              S.listItem()
                .title('Leadership')
                .icon(BadgeCheck)
                .child(
                  S.documentTypeList('teamMember')
                    .title('Leadership Team')
                    .defaultOrdering([
                      { field: 'displayOrder', direction: 'asc' },
                    ])
                ),

              S.listItem()
                .title('Policies')
                .icon(ScrollText)
                .child(
                  S.documentTypeList('policy')
                    .title('All Policies')
                    .defaultOrdering([{ field: 'navOrder', direction: 'asc' }])
                ),
            ])
        ),

      S.divider(),

      // ─── Remaining types (safety net) ────────────────────────
      // Any document types NOT in MANAGED_TYPES will appear here
      // automatically. This prevents accidentally hiding new types.
      ...S.documentTypeListItems().filter(
        (item) => !MANAGED_TYPES.includes(item.getId() as string)
      ),
    ])

// Default document node — used for custom document views (e.g., preview pane)
export const defaultDocumentNode: DefaultDocumentNodeResolver = (
  S,
  { schemaType }
) => {
  // For now, use the default form view for all types.
  // Later, you can add a preview pane for specific types:
  //
  // if (schemaType === 'blog') {
  //   return S.document().views([
  //     S.view.form(),
  //     S.view.component(PreviewPane).title('Preview'),
  //   ])
  // }
  return S.document()
}
```

### 2.4 Singleton Pattern Explained

The Site Settings document uses `S.document().documentId('siteSettings')` instead of `S.documentTypeList('siteSettings')`. This is critical:

- `S.documentTypeList('siteSettings')` — renders a list with a "Create new" button. The client could accidentally create multiple Site Settings documents, causing confusion.
- `S.document().documentId('siteSettings')` — always opens the same single document. No list, no "Create new" button.

You also need to hide the "Create new" action for the `siteSettings` schema type. Add this to the schema definition:

```typescript
// In src/sanity/schemas/documents/siteSettings.ts
defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // ... fields ...
  // Prevent creating new documents of this type from anywhere in the Studio
  __experimental_actions: [/* 'create', */ 'update', 'delete', 'publish'],
})
```

> **Note:** `__experimental_actions` is a Sanity v3 feature for restricting document actions. By omitting `'create'`, the client cannot create new Site Settings documents even if they somehow navigate to the type list.

### 2.5 Document Count Badges

Sanity Studio v3 supports custom badges on list items. To show document counts next to each group:

```typescript
// src/sanity/structure/helpers.ts
import type { StructureBuilder } from 'sanity/structure'

/**
 * Creates a list item with a document count badge.
 * The count appears as a subtitle in the sidebar.
 */
export function documentTypeListWithCount(
  S: StructureBuilder,
  typeName: string,
  title: string,
  icon?: React.ComponentType
) {
  return S.listItem()
    .title(title)
    .icon(icon)
    .child(
      S.documentTypeList(typeName)
        .title(title)
    )
}
```

For actual count badges in the sidebar, you would need a custom Studio plugin with a custom list item component that fetches counts via the Sanity client. This is possible but adds complexity. The simpler approach is to rely on the Studio's built-in "(N documents)" subtitle that appears when you open each document list.

**Recommendation:** Start without custom count badges. The default Studio behavior shows document counts when you navigate into a list. If the client explicitly requests badge counts on the top-level sidebar, implement it as a follow-up enhancement.

---

## 3. Studio Plugins

### 3.1 structureTool

The Structure Tool is the primary content editing interface — the desk with sidebar navigation.

```typescript
import { structureTool } from 'sanity/structure'

structureTool({
  structure,             // Custom desk structure (Section 2)
  defaultDocumentNode,   // Custom document views (optional)
})
```

**What it provides:**
- Sidebar navigation with the custom structure
- Document editing forms (auto-generated from schemas)
- Document actions (publish, unpublish, duplicate, delete)
- Revision history

### 3.2 presentationTool

The Presentation Tool enables side-by-side editing: the Studio form on the left, a live preview of the website on the right. When the editor clicks a field in the form, the preview scrolls to and highlights that element.

```typescript
import { presentationTool } from 'sanity/presentation'

presentationTool({
  previewUrl: {
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
})
```

**What it provides:**
- Split-screen: Studio form + live website preview
- Click-to-edit: click on content in the preview to jump to that field in the form
- Real-time updates: changes in the form reflect immediately in the preview
- URL bar: navigate to any page on the site within the preview

Full configuration details in [Section 5](#5-presentation-tool-configuration).

### 3.3 visionTool

The Vision Tool is a GROQ query playground built into the Studio. It's invaluable for developers debugging queries and for the migration process.

```typescript
import { visionTool } from '@sanity/vision'

visionTool({
  defaultApiVersion: '2025-03-04',
  defaultDataset: 'production',
})
```

**What it provides:**
- GROQ query editor with syntax highlighting
- Real-time query results
- Parameter input (for parameterized queries)
- API version selector
- Dataset selector

**Who uses it:** Developers only. The client won't need this, but it's lightweight and doesn't clutter the UI — it's just another tab in the Studio navbar.

---

## 4. Visual Editing Implementation

Visual Editing is the headline feature of Sanity's modern stack. It lets editors click directly on content in the live website preview and jump to the corresponding field in the Studio. Here's the complete setup.

### 4.1 How Visual Editing Works (Conceptual)

1. **Stega encoding** — Sanity embeds invisible Unicode characters in string values returned by queries. These characters encode the document ID, field path, and Studio URL.
2. **Overlay UI** — When the site is loaded inside the Presentation Tool's iframe, `SanityLive` detects the stega-encoded strings and renders clickable overlays on top of them.
3. **Click-to-edit** — When the editor clicks an overlay, the Studio navigates to that field in the form editor.
4. **Live updates** — When the editor changes a value in the form, the preview updates in real-time without a page refresh.

**The stega characters are invisible to users** — they don't affect rendering, copy-paste, or SEO. They're stripped in production when stega is disabled.

### 4.2 defineLive Configuration

`defineLive` is the core of the Visual Editing setup. It creates a `sanityFetch` function (for server-side data fetching) and a `SanityLive` component (for client-side live updates).

```typescript
// src/sanity/live.ts
import { createClient } from 'next-sanity'
import { defineLive } from 'next-sanity/live'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2025-03-04',
  // stega configuration — embeds invisible editing metadata in strings
  stega: {
    studioUrl: '/studio',  // Where to open the Studio when clicking overlays
  },
})

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error(
    'Missing SANITY_API_READ_TOKEN — required for draft content and Visual Editing'
  )
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,      // Used server-side for fetching draft content
  browserToken: token,     // Used client-side for live updates in preview
})
```

**Key configuration details:**

| Property | Value | Purpose |
|----------|-------|---------|
| `useCdn: true` | CDN for production, bypassed in draft mode | Fast reads in production, fresh data in preview |
| `apiVersion` | `'2025-03-04'` | Pin to a specific API version for stability |
| `stega.studioUrl` | `'/studio'` | Tells overlays where to open the editing UI |
| `serverToken` | Viewer-scoped token | Allows fetching draft (unpublished) content server-side |
| `browserToken` | Viewer-scoped token | Allows the `SanityLive` component to subscribe to live updates |

### 4.3 Draft Mode API Routes

Draft mode tells Next.js to bypass the static cache and fetch fresh data on every request. This is how the Presentation Tool's preview shows unpublished changes.

#### Enable Draft Mode

```typescript
// src/app/api/draft-mode/enable/route.ts
import { client } from '@/sanity/client'
import { token } from '@/sanity/env'
import { defineEnableDraftMode } from 'next-sanity/draft-mode'

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
})
```

`defineEnableDraftMode` from `next-sanity/draft-mode` handles the security handshake with the Presentation Tool. It:
1. Validates the request came from the Studio (via a shared secret)
2. Calls `draftMode().enable()` to activate Next.js draft mode
3. Redirects to the requested preview URL

#### Disable Draft Mode

```typescript
// src/app/api/draft-mode/disable/route.ts
import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  ;(await draftMode()).disable()
  return NextResponse.json({ status: 'Draft mode disabled' })
}
```

### 4.4 SanityLive Component in Root Layout

`SanityLive` is a client component that:
- Subscribes to real-time content updates when draft mode is active
- Renders the Visual Editing overlay UI (clickable outlines around editable content)
- Does nothing in production when draft mode is off (zero performance impact)

```tsx
// src/app/layout.tsx — updated for Sanity
import { SanityLive } from '@/sanity/live'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth scroll-pt-24">
      <body className="w7f-v2 bg-background font-body min-h-dvh">
        {/* ... existing components (ClipPaths, MetallicGradients, etc.) ... */}
        {children}
        <SanityLive />
        {/* REMOVE: <PrismicPreview repositoryName="world-sevens-football" /> */}
        {/* REMOVE: Prismic toolbar <Script> tag */}
      </body>
    </html>
  )
}
```

### 4.5 How encodeDataAttribute Works

For **string fields** (title, heading, description), stega encoding is automatic — no code changes needed. The invisible characters are embedded in the string value returned by `sanityFetch`.

For **non-string fields** (images, booleans, references, arrays), stega can't embed metadata in the value itself. Instead, you use `encodeDataAttribute` to add a `data-sanity` attribute to the HTML element:

```tsx
// Example: making a hero image clickable for Visual Editing
import { stegaClean } from 'next-sanity'

interface HeroProps {
  heading: string       // Stega-encoded automatically
  image: SanityImage    // NOT a string — needs manual annotation
  encodeDataAttribute?: (path: string) => string
}

function HeroSection({ heading, image, encodeDataAttribute }: HeroProps) {
  return (
    <section>
      {/* String field — stega handles this automatically */}
      <h1>{heading}</h1>

      {/* Image field — use data-sanity attribute */}
      <img
        src={urlFor(image).url()}
        data-sanity={encodeDataAttribute?.('image')}
        alt={stegaClean(image.alt) || ''}
      />
    </section>
  )
}
```

**The `stegaClean` helper** strips stega characters from strings when you need the raw value (e.g., for `alt` attributes, URLs, or comparisons). Import it from `next-sanity`.

### 4.6 Components That Need Visual Editing Annotations

The following components should have `encodeDataAttribute` support for non-string fields:

| Component | Fields Needing Manual Annotation | Why |
|-----------|----------------------------------|-----|
| Hero Section | `image` | Image is not a string |
| Image With Text | `image`, `imagePosition` | Image + select field |
| News List | `category` (reference), `manualPosts` (array) | References/arrays aren't strings |
| Community Champions | `logos` (array of images) | Array of non-strings |
| CTA Banner | `backgroundImage` | Image |
| Video Embed | `posterImage` | Image |
| Blog Post | `image`, `category` (reference) | Non-string fields |
| Tournament | `heroImage`, `status` (select) | Non-string fields |

**String fields that work automatically** (no annotation needed): `heading`, `title`, `subtitle`, `description`, `eyebrow`, `body` (Portable Text), `name`, `excerpt`, `author`.

### 4.7 Passing encodeDataAttribute to Components

When using `sanityFetch` in a page, the returned data includes an `encodeDataAttribute` function. Pass it down through the component tree:

```tsx
// Example page component
import { sanityFetch } from '@/sanity/live'
import { defineQuery } from 'next-sanity'

const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    sections[]{
      ...,
      _type == "newsList" => {
        ...,
        category->,
        manualPosts[]->{ _id, title, slug, image, date, excerpt, category-> }
      }
    },
    seo
  }
`)

export default async function Page({
  params,
}: {
  params: Promise<{ uid: string }>
}) {
  const { uid } = await params
  const { data: page, encodeDataAttribute } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug: uid },
  })

  if (!page) notFound()

  return (
    <SectionRenderer
      sections={page.sections}
      encodeDataAttribute={encodeDataAttribute}
    />
  )
}
```

The `SectionRenderer` should forward `encodeDataAttribute` to each section component, scoping it to the section's path:

```tsx
// src/components/sections/section-renderer.tsx
export function SectionRenderer({
  sections,
  encodeDataAttribute,
}: {
  sections: any[]
  encodeDataAttribute?: (path: string | string[]) => string
}) {
  if (!sections?.length) return null

  return (
    <>
      {sections.map((section, index) => {
        const Component = sectionComponents[section._type]
        if (!Component) return null
        return (
          <Component
            key={section._key || index}
            {...section}
            encodeDataAttribute={
              encodeDataAttribute
                ? (field: string) =>
                    encodeDataAttribute(`sections[${index}].${field}`)
                : undefined
            }
          />
        )
      })}
    </>
  )
}
```

---

## 5. Presentation Tool Configuration

### 5.1 How the Presentation Tool Works

The Presentation Tool provides a split-screen view in the Studio:

```
┌──────────────────────────────────────────────────────┐
│  Sanity Studio Navbar  [Structure] [Presentation] [Vision]  │
├────────────────────┬─────────────────────────────────┤
│                    │                                 │
│  Document Form     │    Live Website Preview         │
│  (editing fields)  │    (iframe of your site)        │
│                    │                                 │
│  Title: [______]   │    ┌─────────────────────┐     │
│  Image: [choose]   │    │  Your actual site    │     │
│  Body:  [editor]   │    │  with click-to-edit  │     │
│                    │    │  overlays             │     │
│                    │    └─────────────────────┘     │
│                    │                                 │
├────────────────────┴─────────────────────────────────┤
│  Preview URL: [https://localhost:3000/tournament/xyz]  │
└──────────────────────────────────────────────────────┘
```

**Flow:**
1. Editor opens the Presentation Tool tab
2. Studio loads the website in an iframe
3. Studio sends a request to `/api/draft-mode/enable` to activate draft mode in the iframe
4. The iframe renders the site with `SanityLive` active, showing clickable overlays
5. Editor clicks on content in the preview → Studio navigates to that field in the form
6. Editor changes a field in the form → preview updates in real-time

### 5.2 Presentation Tool Configuration

```typescript
// In sanity.config.ts
presentationTool({
  previewUrl: {
    // The previewMode.enable URL is called when the Presentation Tool opens.
    // It activates Next.js draft mode so the iframe shows unpublished content.
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
})
```

**For production deployments**, you may need to specify the preview origin explicitly if the Studio and the website are on different domains:

```typescript
presentationTool({
  previewUrl: {
    origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000',
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
})
```

### 5.3 URL Resolution

The Presentation Tool needs to know which URL to open when the editor navigates to a document. By default, it opens `/` (the homepage). For specific documents, the Studio uses **document-based URL resolution**.

The simplest approach is to use the `locate` callback on the `presentationTool`:

```typescript
// src/sanity/presentation/locate.ts
import { defineLocations, type DocumentLocationsResolver } from 'sanity/presentation'

export const locate: DocumentLocationsResolver = (params, context) => {
  // Map document types to their frontend URLs
  if (params.type === 'tournament') {
    return defineLocations({
      select: { slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.slug ? `Tournament: ${doc.slug}` : 'Tournament',
            href: `/tournament/${doc?.slug}`,
          },
        ],
      }),
    })
  }

  if (params.type === 'blog') {
    return defineLocations({
      select: { slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.slug ? `News: ${doc.slug}` : 'Blog Post',
            href: `/news/${doc?.slug}`,
          },
        ],
      }),
    })
  }

  if (params.type === 'page') {
    return defineLocations({
      select: { slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.slug ? `Page: ${doc.slug}` : 'Page',
            href: `/${doc?.slug}`,
          },
        ],
      }),
    })
  }

  if (params.type === 'policy') {
    return defineLocations({
      select: { slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.slug ? `Policy: ${doc.slug}` : 'Policy',
            href: `/resources/${doc?.slug}`,
          },
        ],
      }),
    })
  }

  if (params.type === 'team') {
    return defineLocations({
      select: { slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.slug ? `Club: ${doc.slug}` : 'Club',
            href: `/club/${doc?.slug}`,
          },
        ],
      }),
    })
  }

  if (params.type === 'siteSettings') {
    return defineLocations({
      locations: [
        { title: 'Homepage', href: '/' },
      ],
    })
  }

  return undefined
}
```

Then add it to the Presentation Tool config:

```typescript
// In sanity.config.ts
import { locate } from './presentation/locate'

presentationTool({
  locate,
  previewUrl: {
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
})
```

---

## 6. Access Control

### 6.1 CORS Origins

Sanity's API requires CORS origins to be configured for any domain that makes requests to the Content Lake. Configure these in the Sanity project dashboard or via the CLI.

**Required origins:**

| Origin | Purpose |
|--------|---------|
| `http://localhost:3000` | Local development |
| `https://worldsevensfootball.com` | Production |
| `https://www.worldsevensfootball.com` | Production (www) |
| `https://*.vercel.app` | Preview deployments (if using Vercel) |

**Configure via CLI:**

```bash
npx sanity cors add http://localhost:3000 --credentials
npx sanity cors add https://worldsevensfootball.com --credentials
npx sanity cors add https://www.worldsevensfootball.com --credentials
```

The `--credentials` flag allows authenticated requests (needed for draft mode and the Studio).

### 6.2 API Token Scopes

Create two API tokens in the Sanity dashboard (manage.sanity.io → Project → API → Tokens):

| Token | Label | Scope | Used For |
|-------|-------|-------|----------|
| `SANITY_API_READ_TOKEN` | "Website Viewer" | **Viewer** | `defineLive` — fetching draft content for preview, `SanityLive` subscriptions |
| `SANITY_API_WRITE_TOKEN` | "Migration Script" | **Editor** | Content migration scripts only (Section 10 of master plan). Never deployed to production. |

**Important:** The Viewer token is sufficient for all runtime operations. It can read published and draft content but cannot create, update, or delete. The Editor token is only needed during migration and should be kept in local `.env` files, never committed or deployed.

### 6.3 Role-Based Access

Configure roles in the Sanity dashboard (manage.sanity.io → Project → Members):

| Role | Who | Permissions |
|------|-----|-------------|
| **Administrator** | Developer(s) | Full access — schemas, datasets, plugins, settings |
| **Editor** | W7F content team | Create, edit, publish, delete documents. Cannot modify schemas or project settings. |
| **Viewer** | Stakeholders (optional) | Read-only access to content. Can preview but not edit. |

**Recommended:** Start with just Administrator (you) and Editor (the client). Add Viewer later if stakeholders need read-only access.

### 6.4 Dataset Configuration

| Dataset | Purpose | Token Access |
|---------|---------|-------------|
| `production` | Live content | Viewer (runtime), Editor (migration) |
| `staging` (optional) | Content staging/testing | Editor |

**Recommendation:** Start with a single `production` dataset. Only create a `staging` dataset if the client needs a content staging workflow (edit → review → promote to production). Sanity's draft/published document states usually make a separate staging dataset unnecessary.

---

## 7. Client Onboarding UX

### 7.1 Custom Studio Theme

Apply W7F branding to the Studio so it feels like the client's own tool, not a generic CMS.

```typescript
// src/sanity/theme.ts
import { buildLegacyTheme } from 'sanity'

const W7F_COLORS = {
  navy: '#000a2b',
  teal: '#00ffbe',
  white: '#ffffff',
  gray: '#6b7280',
  darkGray: '#1f2937',
  red: '#ef4444',
  yellow: '#f59e0b',
  green: '#10b981',
}

export const w7fTheme = buildLegacyTheme({
  /* Base theme colors */
  '--black': W7F_COLORS.navy,
  '--white': W7F_COLORS.white,

  '--gray': W7F_COLORS.gray,
  '--gray-base': W7F_COLORS.gray,

  '--component-bg': W7F_COLORS.white,
  '--component-text-color': W7F_COLORS.navy,

  /* Brand */
  '--brand-primary': W7F_COLORS.teal,

  /* Default button */
  '--default-button-color': W7F_COLORS.gray,
  '--default-button-primary-color': W7F_COLORS.teal,
  '--default-button-success-color': W7F_COLORS.green,
  '--default-button-warning-color': W7F_COLORS.yellow,
  '--default-button-danger-color': W7F_COLORS.red,

  /* State */
  '--state-info-color': W7F_COLORS.teal,
  '--state-success-color': W7F_COLORS.green,
  '--state-warning-color': W7F_COLORS.yellow,
  '--state-danger-color': W7F_COLORS.red,

  /* Navbar */
  '--main-navigation-color': W7F_COLORS.navy,
  '--main-navigation-color--inverted': W7F_COLORS.white,

  /* Focus */
  '--focus-color': W7F_COLORS.teal,
})
```

**Result:** The Studio navbar will be dark navy (`#000a2b`), primary buttons and focus rings will be the W7F teal (`#00ffbe`), and the overall feel will match the W7F brand.

### 7.2 Studio Logo

Add the W7F logo to the Studio navbar:

```tsx
// src/sanity/components/StudioLogo.tsx
import Image from 'next/image'

export function StudioLogo() {
  return (
    <Image
      src="/images/w7f-logo-white.svg"  // Use the white logo for the dark navbar
      alt="W7F"
      width={32}
      height={32}
      style={{ objectFit: 'contain' }}
    />
  )
}
```

Then add it to the Studio config:

```typescript
// In sanity.config.ts
import { StudioLogo } from './components/StudioLogo'

export default defineConfig({
  // ...
  icon: StudioLogo,
  // ...
})
```

### 7.3 Field Descriptions and Placeholder Text

Good field descriptions turn the Studio into self-service documentation. The client shouldn't need to ask "what goes here?" for any field.

Here are the field descriptions to add to each schema (add `description` to each `defineField` call):

#### Tournament Fields

| Field | Description |
|-------|-------------|
| `title` | `'The full tournament name (e.g., "Fort Lauderdale 2025")'` |
| `slug` | `'URL path — auto-generated from title. Only change this if the URL needs to differ from the title.'` |
| `nickname` | `'Short display name used in navigation and compact layouts (e.g., "Fort Lauderdale")'` |
| `status` | `'Controls where this tournament appears on the site. "Live" shows real-time scores.'` |
| `featured` | `'Featured tournaments get prominent placement on the homepage'` |
| `prizePool` | `'Total prize pool in USD (numbers only, no $ sign)'` |
| `countryCode` | `'Two-letter country code for the flag icon (e.g., US, UK, AE)'` |
| `stadiumName` | `'Full venue name (e.g., "DRV PNK Stadium")'` |
| `heroImage` | `'Main tournament banner image. Recommended: 1920×1080px, landscape orientation.'` |
| `optaCompetitionId` | `'From Opta — links this tournament to live sports data. Ask the dev team for this value.'` |
| `optaSeasonId` | `'From Opta — the season ID for this tournament. Ask the dev team for this value.'` |
| `showInNavigation` | `'Show this tournament in the main navigation dropdown'` |
| `navigationOrder` | `'Lower numbers appear first in the navigation (1 = first, 2 = second, etc.)'` |
| `knowBeforeYouGo` | `'Information for attendees — displayed on the tournament page. Supports rich text formatting.'` |

#### Blog Fields

| Field | Description |
|-------|-------------|
| `title` | `'Article headline — keep under 80 characters for best display'` |
| `category` | `'Choose the article category. This determines where the article appears on the site.'` |
| `date` | `'Publication date — articles are sorted by this date (newest first)'` |
| `excerpt` | `'Brief summary shown in article cards and social sharing. 2-3 sentences max.'` |
| `content` | `'The full article body. Use headings (H2, H3) to structure the content.'` |
| `tournament` | `'Link to a tournament if this article is about a specific event'` |
| `image` | `'Featured image — shown in article cards and at the top of the article. Recommended: 1200×675px.'` |

#### Site Settings Fields

| Field | Description |
|-------|-------------|
| `moreInfoMode` | `'Controls what appears in the "More Info" section of the navigation dropdown'` |
| `whereToWatchPartners` | `'Broadcast partners shown in the "Where to Watch" navigation section. Drag to reorder.'` |
| `footerMenus` | `'Footer navigation columns. Each menu has a title and a list of links. Drag to reorder columns.'` |

### 7.4 Placeholder Text in String Fields

Use `placeholder` in `defineField` to show example text in empty fields:

```typescript
defineField({
  name: 'title',
  type: 'string',
  placeholder: 'e.g., Fort Lauderdale 2025',
  // ...
})

defineField({
  name: 'excerpt',
  type: 'text',
  placeholder: 'Write a brief 2-3 sentence summary of this article...',
  rows: 3,
  // ...
})

defineField({
  name: 'countryCode',
  type: 'string',
  placeholder: 'US',
  // ...
})
```

### 7.5 Welcome Screen (Custom Studio Tool)

Optionally, add a custom "Welcome" tool that displays helpful information when the client first opens the Studio:

```tsx
// src/sanity/components/WelcomeTool.tsx
export function WelcomeTool() {
  return (
    <div style={{ padding: '2rem', maxWidth: '640px', margin: '0 auto' }}>
      <h1>Welcome to W7F Content Studio</h1>
      <p>Use the sidebar to navigate to content types. Here are some common tasks:</p>
      <ul>
        <li><strong>Add a news article:</strong> Go to News & Content → Blog Posts → Create</li>
        <li><strong>Update a tournament:</strong> Go to Tournaments → find the tournament</li>
        <li><strong>Edit the navigation:</strong> Go to Site Settings</li>
        <li><strong>Preview changes:</strong> Click the "Presentation" tab above</li>
      </ul>
      <p>Need help? Contact the development team.</p>
    </div>
  )
}
```

This is optional and can be added after launch if the client requests guided onboarding.

---

## 8. Migration from Prismic Preview

### 8.1 What Gets Removed

| Prismic Component | File | What It Does |
|-------------------|------|--------------|
| `<PrismicPreview>` | `src/app/layout.tsx` | Renders Prismic's preview toolbar at the bottom of the page |
| Prismic toolbar `<Script>` | `src/app/layout.tsx` | Loads `prismic.js` for the preview toolbar UI |
| `redirectToPreviewURL` | `src/app/api/preview/route.ts` | Handles Prismic's preview URL redirect (activates preview mode) |
| `exitPreview` | `src/app/api/exit-preview/route.ts` | Deactivates Prismic preview mode |
| `enableAutoPreviews` | `src/cms/client.ts`, `src/prismicio.ts` | Configures the Prismic client for auto-preview in draft mode |
| `@prismicio/next` | `package.json` | Provides `PrismicPreview`, `redirectToPreviewURL`, `exitPreview` |

### 8.2 What Replaces Each Piece

| Prismic Component | Sanity Replacement | File |
|-------------------|--------------------|------|
| `<PrismicPreview repositoryName="...">` | `<SanityLive />` | `src/app/layout.tsx` |
| Prismic toolbar `<Script>` | (Removed — Sanity overlays are built into `SanityLive`) | `src/app/layout.tsx` |
| `src/app/api/preview/route.ts` | `src/app/api/draft-mode/enable/route.ts` | New file |
| `src/app/api/exit-preview/route.ts` | `src/app/api/draft-mode/disable/route.ts` | New file |
| `enableAutoPreviews` in client setup | `defineLive` with stega encoding | `src/sanity/live.ts` |
| `cache: "force-cache"` + `tags: ["prismic"]` for ISR | `defineLive` handles revalidation automatically | `src/sanity/live.ts` |
| `Route[]` route resolver in client config | `locate` resolver in `presentationTool` config | `src/sanity/presentation/locate.ts` |

### 8.3 Migration Steps (Preview System)

1. **Remove Prismic preview components from layout:**
   - Delete `<PrismicPreview repositoryName="world-sevens-football" />`
   - Delete the `<Script>` tag loading `prismic.js`
   - Remove `import { PrismicPreview } from "@prismicio/next"`

2. **Add Sanity components to layout:**
   - Add `<SanityLive />` before the closing `</body>` tag
   - Add `import { SanityLive } from '@/sanity/live'`

3. **Replace preview API routes:**
   - Delete `src/app/api/preview/route.ts`
   - Delete `src/app/api/exit-preview/route.ts`
   - Create `src/app/api/draft-mode/enable/route.ts` (using `defineEnableDraftMode`)
   - Create `src/app/api/draft-mode/disable/route.ts` (manual `draftMode().disable()`)

4. **Remove Prismic client preview config:**
   - Delete `src/prismicio.ts` entirely (route resolver and preview config)
   - Delete `src/cms/client.ts` entirely (Prismic client factory)
   - Replace with `src/sanity/live.ts` (defineLive) and `src/sanity/client.ts` (base client)

5. **Remove Prismic packages:**
   ```bash
   npm uninstall @prismicio/client @prismicio/next @prismicio/react @slicemachine/adapter-next
   ```

6. **Remove Prismic config files:**
   - Delete `slicemachine.config.json`
   - Delete `prismicio-types.d.ts`
   - Delete `src/app/slice-simulator/` (entire directory)

### 8.4 Key Behavioral Differences

| Behavior | Prismic | Sanity |
|----------|---------|--------|
| Preview activation | Click "Preview" in Prismic dashboard → redirects to site with preview cookie | Open Presentation Tool in Studio → iframe loads site with draft mode |
| Preview toolbar | Floating bar at bottom of page (via `<PrismicPreview>`) | Click-to-edit overlays on content (via `<SanityLive>`) |
| Exiting preview | Click "Exit preview" in toolbar → calls `/api/exit-preview` | Close the Studio's Presentation Tool, or call `/api/draft-mode/disable` |
| Cache invalidation | Manual: `revalidateTag("prismic")` via webhook | Automatic: `defineLive` subscribes to content changes |
| Preview URL routing | Route resolver in Prismic client config (`routes: Route[]`) | `locate` function in `presentationTool` config |
| Who initiates preview | Content editor from Prismic dashboard | Content editor from embedded Studio at `/studio` |

---

## Implementation Checklist

These are the tasks for implementing Phase 3, in dependency order:

### Task 1: Studio Route & Layout
- [ ] Create `src/app/studio/[[...tool]]/page.tsx`
- [ ] Create `src/app/studio/layout.tsx` (strips site chrome)
- [ ] Verify Studio loads at `localhost:3000/studio`

### Task 2: Studio Configuration
- [ ] Create `src/sanity/sanity.config.ts` with all three plugins
- [ ] Create `src/sanity/theme.ts` with W7F branding
- [ ] Verify Studio renders with custom theme

### Task 3: Custom Desk Structure
- [ ] Create `src/sanity/structure/index.ts` with full structure
- [ ] Verify all 5 content groups appear in sidebar
- [ ] Verify filtered tournament views work (Live/Upcoming/Completed)
- [ ] Verify Site Settings opens as singleton (no "Create new")

### Task 4: Visual Editing — defineLive
- [ ] Create `src/sanity/live.ts` with `defineLive` setup
- [ ] Create `src/sanity/env.ts` for environment variable validation
- [ ] Add `<SanityLive />` to root layout
- [ ] Verify stega encoding is present in development (inspect string values)

### Task 5: Draft Mode Routes
- [ ] Create `src/app/api/draft-mode/enable/route.ts`
- [ ] Create `src/app/api/draft-mode/disable/route.ts`
- [ ] Verify draft mode activates via the Presentation Tool

### Task 6: Presentation Tool — URL Resolution
- [ ] Create `src/sanity/presentation/locate.ts` with document type URL mapping
- [ ] Add `locate` to `presentationTool` config
- [ ] Verify clicking a tournament in Structure → opens preview at `/tournament/[slug]`
- [ ] Verify clicking a blog post → opens preview at `/news/[slug]`

### Task 7: Field Descriptions & Placeholder Text
- [ ] Add `description` to all tournament schema fields
- [ ] Add `description` to all blog schema fields
- [ ] Add `description` to site settings fields
- [ ] Add `placeholder` to key string/text fields
- [ ] Verify descriptions appear in Studio form views

### Task 8: Studio Logo
- [ ] Create `src/sanity/components/StudioLogo.tsx`
- [ ] Add `icon: StudioLogo` to Studio config
- [ ] Verify logo appears in Studio navbar

### Task 9: Access Control
- [ ] Configure CORS origins (localhost, production domain, Vercel previews)
- [ ] Create Viewer API token ("Website Viewer")
- [ ] Create Editor API token ("Migration Script") — for Phase 4 only
- [ ] Set up Editor role for the client in Sanity dashboard

### Task 10: Remove Prismic Preview
- [ ] Remove `<PrismicPreview>` from root layout
- [ ] Remove Prismic toolbar `<Script>` from root layout
- [ ] Delete `src/app/api/preview/route.ts`
- [ ] Delete `src/app/api/exit-preview/route.ts`
- [ ] Verify no Prismic preview imports remain

### Task 11: End-to-End Verification
- [ ] Open Studio at `/studio` → verify all content groups load
- [ ] Open Presentation Tool → verify live preview loads in iframe
- [ ] Edit a field in the Studio form → verify preview updates in real-time
- [ ] Click on content in the preview → verify Studio navigates to the correct field
- [ ] Verify Studio theme matches W7F branding
- [ ] Verify production build works (`npm run build`) with Studio route

---

## File Summary

### Files to Create

| File | Purpose |
|------|---------|
| `src/app/studio/[[...tool]]/page.tsx` | Embedded Studio route |
| `src/app/studio/layout.tsx` | Studio layout (no site chrome) |
| `src/sanity/sanity.config.ts` | Studio configuration |
| `src/sanity/theme.ts` | Custom W7F theme |
| `src/sanity/live.ts` | `defineLive` setup |
| `src/sanity/env.ts` | Environment variable validation |
| `src/sanity/structure/index.ts` | Custom desk structure |
| `src/sanity/presentation/locate.ts` | URL resolution for Presentation Tool |
| `src/sanity/components/StudioLogo.tsx` | W7F logo in Studio navbar |
| `src/app/api/draft-mode/enable/route.ts` | Enable draft mode |
| `src/app/api/draft-mode/disable/route.ts` | Disable draft mode |

### Files to Modify

| File | Change |
|------|--------|
| `src/app/layout.tsx` | Remove `PrismicPreview` + Prismic script, add `SanityLive` |
| `next.config.ts` | Replace `images.prismic.io` with `cdn.sanity.io` |
| `.env.local` | Add Sanity env vars, remove Prismic vars |

### Files to Delete

| File | Reason |
|------|--------|
| `src/app/api/preview/route.ts` | Replaced by `/api/draft-mode/enable` |
| `src/app/api/exit-preview/route.ts` | Replaced by `/api/draft-mode/disable` |

---

*Phase document authored: 2026-02-17*
*Depends on: Phase 1 (schemas), Phase 2 (data fetching)*
*Estimated effort: 2-3 days*
