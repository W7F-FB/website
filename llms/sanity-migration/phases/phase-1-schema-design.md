# Phase 1: Sanity Schema Design

> Companion document to the master migration plan (`llms/sanity-migration/plan.md`, Sections 5 & 6).
> This document contains production-ready Sanity v3 TypeScript for every schema, plus the complete Prismic-to-Sanity field mapping.

---

## Table of Contents

1. [Schema Architecture Overview](#1-schema-architecture-overview)
2. [Document Schemas](#2-document-schemas)
3. [Object Schemas](#3-object-schemas)
4. [Section Schemas](#4-section-schemas)
5. [Schema Registry](#5-schema-registry)
6. [Prismic-to-Sanity Field Mapping Table](#6-prismic-to-sanity-field-mapping-table)
7. [Design Decisions Log](#7-design-decisions-log)

---

## 1. Schema Architecture Overview

### 1.1 Directory Structure

```
src/sanity/schemas/
├── index.ts                    # Schema registry — exports `schemaTypes` array
├── documents/
│   ├── tournament.ts
│   ├── blog.ts
│   ├── blogCategory.ts         # NEW — replaces hardcoded Select options
│   ├── team.ts
│   ├── match.ts
│   ├── player.ts
│   ├── teamMember.ts
│   ├── broadcastPartner.ts
│   ├── sponsor.ts
│   ├── award.ts
│   ├── policy.ts
│   ├── page.ts
│   ├── testimonial.ts          # Carried over from Prismic
│   └── siteSettings.ts         # Singleton — replaces `website` custom type
├── objects/
│   ├── portableText.ts         # Rich text block configuration
│   ├── seo.ts                  # SEO metadata object
│   ├── footerMenu.ts           # Footer menu with nested links
│   ├── link.ts                 # Reusable internal/external link
│   └── ctaButton.ts            # Embeddable CTA for Portable Text
└── sections/
    ├── index.ts                # Exports `sectionTypes` array for page builders
    ├── hero.ts
    ├── textBlock.ts
    ├── imageWithText.ts
    ├── newsList.ts
    ├── divider.ts
    ├── communityChampions.ts
    ├── ctaBanner.ts            # NEW section type
    └── videoEmbed.ts           # NEW section type
```

### 1.2 Registration Pattern

Every schema file exports a named `defineType` call. The registry (`index.ts`) collects them into a flat array passed to `sanity.config.ts`:

```typescript
// src/sanity/schemas/index.ts
import { type SchemaTypeDefinition } from 'sanity'
import { tournamentType } from './documents/tournament'
// ... all other imports
export const schemaTypes: SchemaTypeDefinition[] = [
  tournamentType,
  // ... all other types
]
```

```typescript
// src/sanity/sanity.config.ts
import { schemaTypes } from './schemas'
export default defineConfig({
  // ...
  schema: { types: schemaTypes },
})
```

### 1.3 Conventions

| Convention | Rule |
|-----------|------|
| **Field naming** | `camelCase` (Sanity convention). Prismic `snake_case` fields are converted. |
| **Slug fields** | Every document with a public URL gets `slug` with `options: { source: 'title' }` (or `'name'`). |
| **Required fields** | Title/name fields and slugs are `validation: Rule => Rule.required()`. |
| **Groups** | Used on complex documents (tournament, siteSettings) to organize Studio tabs. |
| **Preview** | Every document and section type defines a `preview` for Studio list views. |
| **Color fields** | Use `@sanity/color-input` plugin — `type: 'color'` for all color fields. |
| **Rich text** | Reusable `portableText` object type for all long-form content. |

### 1.4 Plugin Dependencies

| Plugin | Purpose |
|--------|---------|
| `@sanity/color-input` | Color picker fields (team colors, partner brand colors) |
| `@sanity/vision` | GROQ playground in Studio |
| `sanity` | Core Studio + `structureTool` + `presentationTool` |
| `next-sanity` | Next.js integration, `defineLive`, `NextStudio` |

---

## 2. Document Schemas

### 2.1 `tournament`

The most complex document type. Uses field groups to organize 20+ fields across tabs.

```typescript
// src/sanity/schemas/documents/tournament.ts
import { defineType, defineField } from 'sanity'
import { sectionTypes } from '../sections'

export const tournamentType = defineType({
  name: 'tournament',
  title: 'Tournament',
  type: 'document',
  groups: [
    { name: 'details', title: 'Details', default: true },
    { name: 'media', title: 'Media' },
    { name: 'opta', title: 'Opta Integration' },
    { name: 'navigation', title: 'Navigation' },
    { name: 'content', title: 'Content' },
  ],
  fields: [
    // ── Details ──────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'details',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'details',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nickname',
      title: 'Nickname',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'details',
      options: {
        list: [
          { title: 'Upcoming', value: 'Upcoming' },
          { title: 'Live', value: 'Live' },
          { title: 'Complete', value: 'Complete' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),
    defineField({
      name: 'prizePool',
      title: 'Prize Pool',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'countryCode',
      title: 'Country Code',
      type: 'string',
      group: 'details',
      description: 'Two-letter ISO code (e.g. US, UK, FR)',
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'stadiumName',
      title: 'Stadium Name',
      type: 'string',
      group: 'details',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      group: 'details',
    }),
    defineField({
      name: 'numberOfTeams',
      title: 'Number of Teams',
      type: 'number',
      group: 'details',
    }),
    defineField({
      name: 'ticketsAvailable',
      title: 'Tickets Available',
      type: 'boolean',
      group: 'details',
      initialValue: false,
    }),

    // ── Media ────────────────────────────────────────────────
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
    }),
    defineField({
      name: 'highlightReelLink',
      title: 'Highlight Reel Link',
      type: 'url',
      group: 'media',
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),

    // ── Opta ─────────────────────────────────────────────────
    defineField({
      name: 'optaCompetitionId',
      title: 'Opta Competition ID',
      type: 'string',
      group: 'opta',
    }),
    defineField({
      name: 'optaSeasonId',
      title: 'Opta Season ID',
      type: 'string',
      group: 'opta',
    }),
    defineField({
      name: 'optaEnabled',
      title: 'Opta Enabled',
      type: 'boolean',
      group: 'opta',
      initialValue: false,
    }),

    // ── Relationships ────────────────────────────────────────
    defineField({
      name: 'matches',
      title: 'Matches',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'match' }] }],
    }),
    defineField({
      name: 'awards',
      title: 'Awards',
      type: 'array',
      group: 'details',
      of: [{ type: 'reference', to: [{ type: 'award' }] }],
    }),
    defineField({
      name: 'recap',
      title: 'Recap Blog Post',
      type: 'reference',
      group: 'details',
      to: [{ type: 'blog' }],
    }),

    // ── Content ──────────────────────────────────────────────
    defineField({
      name: 'knowBeforeYouGo',
      title: 'Know Before You Go',
      type: 'portableText',
      group: 'content',
    }),
    defineField({
      name: 'knowBeforeYouGoPdf',
      title: 'Know Before You Go PDF',
      type: 'file',
      group: 'content',
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      group: 'content',
      of: sectionTypes,
    }),

    // ── Navigation ───────────────────────────────────────────
    defineField({
      name: 'showInNavigation',
      title: 'Show in Navigation',
      type: 'boolean',
      group: 'navigation',
      initialValue: false,
    }),
    defineField({
      name: 'navigationOrder',
      title: 'Navigation Order',
      type: 'number',
      group: 'navigation',
      description: 'Lower numbers appear first',
    }),
    defineField({
      name: 'navImage',
      title: 'Navigation Image',
      type: 'image',
      group: 'navigation',
      options: { hotspot: true },
    }),
    defineField({
      name: 'navigationDescription',
      title: 'Navigation Description',
      type: 'string',
      group: 'navigation',
    }),
  ],

  orderings: [
    {
      title: 'Start Date (Newest)',
      name: 'startDateDesc',
      by: [{ field: 'startDate', direction: 'desc' }],
    },
    {
      title: 'Nav Order',
      name: 'navOrderAsc',
      by: [{ field: 'navigationOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'status',
      media: 'heroImage',
    },
  },
})
```

**Changes vs Prismic:**
- `uid` → `slug` (Sanity convention)
- `hero_image` → `heroImage` (camelCase)
- `highlight_reel_link` → `highlightReelLink` with `url` type (was `Text`)
- `matches` Group-with-Link → direct `reference` array (GROQ-queryable)
- `awards` Group-with-Link → direct `reference` array
- `know_before_you_go_pdf` Link-to-Media → `file` type
- `slices` → `sections` array
- Tab `Main` + `Navigation` → field groups (details, media, opta, navigation, content)

---

### 2.2 `blog`

```typescript
// src/sanity/schemas/documents/blog.ts
import { defineType, defineField } from 'sanity'
import { sectionTypes } from '../sections'

export const blogType = defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publish Date',
      type: 'date',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'portableText',
    }),
    defineField({
      name: 'tournament',
      title: 'Tournament',
      type: 'reference',
      to: [{ type: 'tournament' }],
    }),
    defineField({
      name: 'matches',
      title: 'Related Matches',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'match' }] }],
    }),
    defineField({
      name: 'teams',
      title: 'Related Teams',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'team' }] }],
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: sectionTypes,
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Metadata',
      type: 'seo',
    }),
  ],

  orderings: [
    {
      title: 'Date (Newest)',
      name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }],
    },
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'category.name',
      media: 'image',
    },
  },
})
```

**Changes vs Prismic:**
- `category` Select (7 hardcoded options) → `reference` to `blogCategory` document
- `matches` Group-with-Link → direct `reference` array
- `teams` Group-with-Link → direct `reference` array
- `content` StructuredText → `portableText`
- `excerpt` was `Text` → `text` with `rows: 3`
- Added `seo` object (not present in Prismic blog)
- `slices` → `sections`
- `tournament` Link → direct `reference`

---

### 2.3 `blogCategory` (NEW)

Replaces the hardcoded Select field on `blog.category`. Client can add/edit/remove categories without code changes.

```typescript
// src/sanity/schemas/documents/blogCategory.ts
import { defineType, defineField } from 'sanity'

export const blogCategoryType = defineType({
  name: 'blogCategory',
  title: 'Blog Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
  ],

  preview: {
    select: { title: 'name' },
  },
})

// Pre-populate during migration with:
// Announcements, Tournament Recap, Match Recap,
// Social Impact, Match Day Preview, Press Releases, Youth Events
```

---

### 2.4 `team`

```typescript
// src/sanity/schemas/documents/team.ts
import { defineType, defineField } from 'sanity'

export const teamType = defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'optaId',
      title: 'Opta ID',
      type: 'string',
    }),
    defineField({
      name: 'key',
      title: 'Key',
      type: 'string',
      description: 'Short team key/abbreviation',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'countryCode',
      title: 'Country Code',
      type: 'string',
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'colorPrimary',
      title: 'Primary Color',
      type: 'color',
    }),
    defineField({
      name: 'colorSecondary',
      title: 'Secondary Color',
      type: 'color',
    }),
    defineField({
      name: 'alphabeticalSortString',
      title: 'Alphabetical Sort String',
      type: 'string',
    }),
    defineField({
      name: 'tournaments',
      title: 'Tournaments',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tournament' }] }],
    }),
    defineField({
      name: 'group',
      title: 'Group',
      type: 'string',
      options: {
        list: [
          { title: 'Group 1', value: 'Group 1' },
          { title: 'Group 2', value: 'Group 2' },
        ],
      },
    }),
  ],

  orderings: [
    {
      title: 'Alphabetical',
      name: 'alphaAsc',
      by: [{ field: 'alphabeticalSortString', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'country',
      media: 'logo',
    },
  },
})
```

**Changes vs Prismic:**
- `color_primary` / `color_secondary` Prismic Color (hex string) → Sanity `color` type (via `@sanity/color-input`). Access in code changes from `team.data.color_primary` to `team.colorPrimary.hex`.
- `tournaments` Group-with-Link → direct `reference` array
- GROQ enables reverse queries: `*[_type == "team" && references($tournamentId)]`

---

### 2.5 `match`

```typescript
// src/sanity/schemas/documents/match.ts
import { defineType, defineField } from 'sanity'
import { sectionTypes } from '../sections'

export const matchType = defineType({
  name: 'match',
  title: 'Match',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
    }),
    defineField({
      name: 'optaId',
      title: 'Opta ID',
      type: 'string',
    }),
    defineField({
      name: 'tournament',
      title: 'Tournament',
      type: 'reference',
      to: [{ type: 'tournament' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'matchNumber',
      title: 'Match Number',
      type: 'number',
    }),
    defineField({
      name: 'homeTeam',
      title: 'Home Team',
      type: 'reference',
      to: [{ type: 'team' }],
    }),
    defineField({
      name: 'homeTeamNameOverride',
      title: 'Home Team Name Override',
      type: 'string',
      description: 'Overrides team name (e.g. for TBD placeholder)',
    }),
    defineField({
      name: 'awayTeam',
      title: 'Away Team',
      type: 'reference',
      to: [{ type: 'team' }],
    }),
    defineField({
      name: 'awayTeamNameOverride',
      title: 'Away Team Name Override',
      type: 'string',
      description: 'Overrides team name (e.g. for TBD placeholder)',
    }),
    defineField({
      name: 'startTime',
      title: 'Start Time',
      type: 'datetime',
    }),
    defineField({
      name: 'stage',
      title: 'Stage',
      type: 'string',
      options: {
        list: [
          { title: 'Group Stage', value: 'Group Stage' },
          { title: 'Knockout Stage', value: 'Knockout Stage' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'knockoutStageMatchType',
      title: 'Knockout Stage Match Type',
      type: 'string',
      options: {
        list: [
          { title: 'Group 1 Semifinal', value: 'Group 1 Semifinal' },
          { title: 'Group 2 Semifinal', value: 'Group 2 Semifinal' },
          { title: 'Third Place Match', value: 'Third Place Match' },
          { title: 'Final', value: 'Final' },
        ],
      },
      hidden: ({ parent }) => parent?.stage !== 'Knockout Stage',
    }),
    defineField({
      name: 'broadcasts',
      title: 'Broadcast Partners',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'broadcastPartner' }] }],
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: sectionTypes,
    }),
  ],

  orderings: [
    {
      title: 'Match Number',
      name: 'matchNumberAsc',
      by: [{ field: 'matchNumber', direction: 'asc' }],
    },
    {
      title: 'Start Time',
      name: 'startTimeAsc',
      by: [{ field: 'startTime', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      home: 'homeTeam.name',
      away: 'awayTeam.name',
      date: 'startTime',
      stage: 'stage',
    },
    prepare({ home, away, date, stage }) {
      return {
        title: `${home || 'TBD'} vs ${away || 'TBD'}`,
        subtitle: `${stage || ''} — ${date ? new Date(date).toLocaleDateString() : 'TBD'}`,
      }
    },
  },
})
```

**Changes vs Prismic:**
- `home_team` / `away_team` Link → direct `reference`
- `broadcasts` Group-with-Link → direct `reference` array
- `tournament` Link → direct `reference`
- `knockout_stage_match_type` → conditionally hidden when stage is not 'Knockout Stage'
- `start_time` Timestamp → `datetime`

---

### 2.6 `player`

```typescript
// src/sanity/schemas/documents/player.ts
import { defineType, defineField } from 'sanity'

export const playerType = defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  fields: [
    defineField({
      name: 'firstName',
      title: 'First Name',
      type: 'string',
    }),
    defineField({
      name: 'lastName',
      title: 'Last Name',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
    }),
    defineField({
      name: 'optaId',
      title: 'Opta ID',
      type: 'string',
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'team',
      title: 'Team',
      type: 'reference',
      to: [{ type: 'team' }],
    }),
  ],

  preview: {
    select: {
      first: 'firstName',
      last: 'lastName',
      media: 'headshot',
      team: 'team.name',
    },
    prepare({ first, last, media, team }) {
      return {
        title: `${first || ''} ${last || ''}`.trim(),
        subtitle: team,
        media,
      }
    },
  },
})
```

**Changes vs Prismic:**
- `team` Link → direct `reference`
- `first_name` / `last_name` → `firstName` / `lastName`

---

### 2.7 `teamMember`

```typescript
// src/sanity/schemas/documents/teamMember.ts
import { defineType, defineField } from 'sanity'

export const teamMemberType = defineType({
  name: 'teamMember',
  title: 'Leadership Member',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'role',
      title: 'Role/Position',
      type: 'string',
    }),
    defineField({
      name: 'headshot',
      title: 'Headshot',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'portableText',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Player Advisor', value: 'Player Advisor' },
          { title: 'Co-Founder', value: 'Co-Founder' },
          { title: 'Leadership Team', value: 'Leadership Team' },
        ],
        layout: 'radio',
      },
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'headshot',
    },
  },
})
```

**Changes vs Prismic:**
- `bio` StructuredText → `portableText`
- `display_order` → `displayOrder` (camelCase)
- Tab `Main` + `Settings` → flat fields (simple enough without groups)
- Headshot thumbnails (small/medium) handled by Sanity's image pipeline

---

### 2.8 `broadcastPartner`

```typescript
// src/sanity/schemas/documents/broadcastPartner.ts
import { defineType, defineField } from 'sanity'

export const broadcastPartnerType = defineType({
  name: 'broadcastPartner',
  title: 'Broadcast Partner',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'logoWhite',
      title: 'Logo (White)',
      type: 'image',
    }),
    defineField({
      name: 'iconLogo',
      title: 'Icon Logo',
      type: 'image',
    }),
    defineField({
      name: 'logoOnPrimary',
      title: 'Logo on Primary',
      type: 'image',
    }),
    defineField({
      name: 'colorPrimary',
      title: 'Primary Color',
      type: 'color',
    }),
    defineField({
      name: 'colorSecondary',
      title: 'Secondary Color',
      type: 'color',
    }),
    defineField({
      name: 'streamingLink',
      title: 'Streaming Link',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),
  ],

  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
```

**Changes vs Prismic:**
- `color_primary` / `color_secondary` were Text → now `color` type for consistent Studio UX
- `streaming_link` Text → `url` with validation
- `logo_white` → `logoWhite`, `icon_logo` → `iconLogo`, etc. (camelCase)

---

### 2.9 `sponsor`

```typescript
// src/sanity/schemas/documents/sponsor.ts
import { defineType, defineField } from 'sanity'

export const sponsorType = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'colorPrimary',
      title: 'Primary Color',
      type: 'color',
    }),
    defineField({
      name: 'colorSecondary',
      title: 'Secondary Color',
      type: 'color',
    }),
    defineField({
      name: 'websiteLink',
      title: 'Website Link',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
    defineField({
      name: 'visibility',
      title: 'Visible',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  orderings: [
    {
      title: 'Sort Order',
      name: 'sortAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
      media: 'logo',
    },
  },
})
```

**Changes vs Prismic:**
- `sort_order` was Text (!) → `number` (type correction)
- `website_link` Text → `url` with validation
- `color_primary` / `color_secondary` Text → `color` type

---

### 2.10 `award`

```typescript
// src/sanity/schemas/documents/award.ts
import { defineType, defineField } from 'sanity'

export const awardType = defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({
      name: 'awardTitle',
      title: 'Award Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'awardSubtitle',
      title: 'Award Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'playerName',
      title: 'Player Name',
      type: 'string',
    }),
    defineField({
      name: 'playerTeam',
      title: 'Player Team',
      type: 'reference',
      to: [{ type: 'team' }],
    }),
    defineField({
      name: 'playerHeadshot',
      title: 'Player Headshot',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],

  orderings: [
    {
      title: 'Sort Order',
      name: 'sortAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'awardTitle',
      subtitle: 'playerName',
      media: 'playerHeadshot',
    },
  },
})
```

**Changes vs Prismic:**
- `player_team` Link → direct `reference`
- `sort_order` was Text (!) → `number` (type correction)
- `uid` dropped (awards don't have standalone pages)

---

### 2.11 `policy`

```typescript
// src/sanity/schemas/documents/policy.ts
import { defineType, defineField } from 'sanity'

export const policyType = defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Policy Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Policy Content',
      type: 'portableText',
    }),
    defineField({
      name: 'pdf',
      title: 'PDF File',
      type: 'file',
    }),
    defineField({
      name: 'hideFromNav',
      title: 'Hide From Navigation',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'navOrder',
      title: 'Navigation Order',
      type: 'number',
      description: 'Lower numbers appear first',
    }),
  ],

  orderings: [
    {
      title: 'Nav Order',
      name: 'orderAsc',
      by: [{ field: 'navOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'name',
    },
  },
})
```

**Changes vs Prismic:**
- `body` StructuredText → `portableText`
- `pdf` Link-to-Media → `file`
- `hide_from_nav` → `hideFromNav`
- `order` → `navOrder` (more descriptive)
- Tab `Main` + `Settings` → flat fields

---

### 2.12 `page`

Generic page with a page builder (section array). The simplest document type.

```typescript
// src/sanity/schemas/documents/page.ts
import { defineType, defineField } from 'sanity'
import { sectionTypes } from '../sections'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: sectionTypes,
    }),
    defineField({
      name: 'seo',
      title: 'SEO & Metadata',
      type: 'seo',
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
})
```

**Changes vs Prismic:**
- Added `title` field (Prismic `page` had no title, only uid)
- `slices` SliceZone → `sections` array
- `meta_title` / `meta_description` / `meta_image` → `seo` object

---

### 2.13 `testimonial`

Carried over from Prismic. Simple quote + author document.

```typescript
// src/sanity/schemas/documents/testimonial.ts
import { defineType, defineField } from 'sanity'

export const testimonialType = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'author', maxLength: 96 },
    }),
  ],

  preview: {
    select: {
      title: 'author',
      subtitle: 'quote',
    },
  },
})
```

**Changes vs Prismic:**
- `testimonial` (field name) → `quote` (less confusing; the field was named the same as the type)
- Field `testimonial` was `Text` → `text` with `rows: 4`
- `uid` → `slug`

---

### 2.14 `siteSettings` (Singleton)

Replaces the Prismic `website` custom type. Managed as a singleton with a fixed document ID.

```typescript
// src/sanity/schemas/documents/siteSettings.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'navigation', title: 'Navigation', default: true },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    // ── Navigation ───────────────────────────────────────────
    defineField({
      name: 'moreInfoMode',
      title: 'More Info Mode',
      type: 'string',
      group: 'navigation',
      options: {
        list: [
          { title: 'Recent News', value: 'Recent News' },
          { title: 'Where to watch', value: 'Where to watch' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'whereToWatchPartners',
      title: 'Where to Watch Partners',
      type: 'array',
      group: 'navigation',
      of: [{ type: 'reference', to: [{ type: 'broadcastPartner' }] }],
    }),

    // ── Footer ───────────────────────────────────────────────
    defineField({
      name: 'footerMenus',
      title: 'Footer Menus',
      type: 'array',
      group: 'footer',
      of: [defineArrayMember({ type: 'footerMenu' })],
    }),
  ],

  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
```

**Changes vs Prismic:**
- `website` → `siteSettings` (more descriptive)
- Non-repeatable type → singleton pattern (fixed document ID in desk structure)
- `where_to_watch_partners` Group-with-Link → direct `reference` array
- `footer_menus` nested Group → `footerMenu` object type in array
- Tab `Footer` + `Navbar` → field groups

---

## 3. Object Schemas

### 3.1 `portableText`

Configured for the site's rich text needs: headings, basic formatting, links, images, and embeddable custom blocks.

```typescript
// src/sanity/schemas/objects/portableText.ts
import { defineType, defineArrayMember } from 'sanity'

export const portableTextType = defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
                validation: (Rule: any) =>
                  Rule.uri({
                    allowRelative: true,
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              },
              {
                name: 'openInNewTab',
                type: 'boolean',
                title: 'Open in new tab',
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      options: { hotspot: true },
    }),
    defineArrayMember({ type: 'ctaButton' }),
  ],
})
```

**Design notes:**
- Matches the Prismic StructuredText capabilities: paragraphs, headings (h2-h4), lists, bold, italic, hyperlinks, images
- Adds `ctaButton` as an embeddable custom block (not available in Prismic)
- `blockquote` style added (Prismic had it in some fields)
- No h1 in Portable Text — h1 is the page title, not embedded in rich text
- No h5/h6 — consistent with existing typography components

---

### 3.2 `seo`

Reusable SEO metadata object, used by `page` and `blog`.

```typescript
// src/sanity/schemas/objects/seo.ts
import { defineType, defineField } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO & Metadata',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title for social media and search engines',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Brief summary of the page',
    }),
    defineField({
      name: 'metaImage',
      title: 'Social Share Image',
      type: 'image',
      description: 'Recommended: 2400x1260px',
    }),
  ],
})
```

---

### 3.3 `footerMenu`

Reusable object for footer menu columns. Each menu has a title and an array of links.

```typescript
// src/sanity/schemas/objects/footerMenu.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const footerMenuType = defineType({
  name: 'footerMenu',
  title: 'Footer Menu',
  type: 'object',
  fields: [
    defineField({
      name: 'menuTitle',
      title: 'Menu Title',
      type: 'string',
    }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [defineArrayMember({ type: 'link' })],
    }),
  ],

  preview: {
    select: { title: 'menuTitle' },
  },
})
```

---

### 3.4 `link`

Reusable link object for footer menus and anywhere else a labeled link is needed.

```typescript
// src/sanity/schemas/objects/link.ts
import { defineType, defineField } from 'sanity'

export const linkType = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'linkText',
      title: 'Link Text',
      type: 'string',
    }),
    defineField({
      name: 'linkUrl',
      title: 'URL',
      type: 'string',
      description: 'Internal path (e.g. /about) or external URL',
    }),
    defineField({
      name: 'isExternal',
      title: 'External Link',
      type: 'boolean',
      initialValue: false,
    }),
  ],

  preview: {
    select: {
      title: 'linkText',
      subtitle: 'linkUrl',
    },
  },
})
```

---

### 3.5 `ctaButton`

Embeddable CTA block for use inside Portable Text. Not available in Prismic — new capability.

```typescript
// src/sanity/schemas/objects/ctaButton.ts
import { defineType, defineField } from 'sanity'

export const ctaButtonType = defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary', value: 'primary' },
          { title: 'Secondary', value: 'secondary' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],

  preview: {
    select: { title: 'text', subtitle: 'url' },
  },
})
```

---

## 4. Section Schemas

All section types are `type: 'object'` and are used inside `sections` arrays on documents.

### 4.0 Section Types Registry

```typescript
// src/sanity/schemas/sections/index.ts
import { defineArrayMember } from 'sanity'

export const sectionTypes = [
  defineArrayMember({ type: 'hero' }),
  defineArrayMember({ type: 'textBlock' }),
  defineArrayMember({ type: 'imageWithText' }),
  defineArrayMember({ type: 'newsList' }),
  defineArrayMember({ type: 'divider' }),
  defineArrayMember({ type: 'communityChampions' }),
  defineArrayMember({ type: 'ctaBanner' }),
  defineArrayMember({ type: 'videoEmbed' }),
]
```

### 4.1 `hero`

Replaces the Prismic `SubpageHero` slice.

```typescript
// src/sanity/schemas/sections/hero.ts
import { defineType, defineField } from 'sanity'

export const heroType = defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'heading', subtitle: 'subtitle', media: 'image' },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Hero Section',
        subtitle: subtitle || '',
        media,
      }
    },
  },
})
```

**Changes vs Prismic `SubpageHero`:**
- `heading` was StructuredText (single h1) → `string` (simpler, it's always one line)
- `description` was StructuredText (single paragraph) → `text` (simpler)
- Renamed from `SubpageHero` → `hero` (cleaner name)

---

### 4.2 `textBlock`

```typescript
// src/sanity/schemas/sections/textBlock.ts
import { defineType, defineField } from 'sanity'

export const textBlockType = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
    defineField({
      name: 'textAlign',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Center', value: 'center' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'textSize',
      title: 'Text Size',
      type: 'string',
      options: {
        list: [
          { title: 'Small', value: 'small' },
          { title: 'Medium', value: 'medium' },
          { title: 'Large', value: 'large' },
        ],
        layout: 'radio',
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'contentWidth',
      title: 'Content Width',
      type: 'string',
      options: {
        list: [
          { title: 'Full', value: 'full' },
          { title: 'Large', value: 'large' },
          { title: 'Medium', value: 'medium' },
          { title: 'Small', value: 'small' },
        ],
        layout: 'radio',
      },
      initialValue: 'full',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Text Block' }
    },
  },
})
```

**Changes vs Prismic `TextBlock`:**
- `heading` was StructuredText (single h2) → `string`
- `body` StructuredText → `portableText`
- `text_align` → `textAlign`, `text_size` → `textSize`, `content_width` → `contentWidth`
- Preserves `paddingTop` / `paddingBottom` from Prismic (controls internal padding)

---

### 4.3 `imageWithText`

```typescript
// src/sanity/schemas/sections/imageWithText.ts
import { defineType, defineField } from 'sanity'

export const imageWithTextType = defineType({
  name: 'imageWithText',
  title: 'Image with Text',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: 'Small heading above title',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'portableText',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          { title: 'Left', value: 'left' },
          { title: 'Right', value: 'right' },
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'paddingTop',
      title: 'Padding Top',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'paddingBottom',
      title: 'Padding Bottom',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'title', media: 'image' },
    prepare({ title, media }) {
      return {
        title: title || 'Image with Text',
        media,
      }
    },
  },
})
```

**Changes vs Prismic `ImageWithText`:**
- `eyebrow` was `Text` → `string`
- `title` was StructuredText (single h3) → `string`
- `description` StructuredText → `portableText`
- `image_position` → `imagePosition`
- Preserves `paddingTop` / `paddingBottom`

---

### 4.4 `newsList`

```typescript
// src/sanity/schemas/sections/newsList.ts
import { defineType, defineField } from 'sanity'

export const newsListType = defineType({
  name: 'newsList',
  title: 'News List',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category Filter',
      type: 'reference',
      to: [{ type: 'blogCategory' }],
      description: 'Filter by category, or leave empty for all posts',
    }),
    defineField({
      name: 'manualPosts',
      title: 'Manual Posts',
      type: 'array',
      description: 'Overrides category filter when populated',
      of: [{ type: 'reference', to: [{ type: 'blog' }] }],
    }),
    defineField({
      name: 'limit',
      title: 'Max Posts',
      type: 'number',
      initialValue: 6,
      description: 'Maximum number of posts to display',
    }),
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'heading', category: 'category.name' },
    prepare({ title, category }) {
      return {
        title: title || 'News List',
        subtitle: category ? `Category: ${category}` : 'All posts',
      }
    },
  },
})
```

**Changes vs Prismic `NewsList`:**
- `heading` was StructuredText (single h2) → `string`
- `category` was Select (4 hardcoded options) → `reference` to `blogCategory`
- `posts` Group-with-Link → direct `reference` array (`manualPosts`)
- Added `limit` field (not in Prismic — default 6)

---

### 4.5 `divider`

```typescript
// src/sanity/schemas/sections/divider.ts
import { defineType, defineField } from 'sanity'

export const dividerType = defineType({
  name: 'divider',
  title: 'Divider',
  type: 'object',
  fields: [
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    prepare() {
      return { title: '── Divider ──' }
    },
  },
})
```

**Changes vs Prismic `Divider`:** Identical structure, just camelCase field names.

---

### 4.6 `communityChampions`

```typescript
// src/sanity/schemas/sections/communityChampions.ts
import { defineType, defineField, defineArrayMember } from 'sanity'

export const communityChampionsType = defineType({
  name: 'communityChampions',
  title: 'Community Champions',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'portableText',
    }),
    defineField({
      name: 'logos',
      title: 'Logos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'championLogo',
          fields: [
            defineField({
              name: 'tournament',
              title: 'Tournament',
              type: 'reference',
              to: [{ type: 'tournament' }],
            }),
            defineField({
              name: 'logo',
              title: 'Logo',
              type: 'image',
            }),
          ],
          preview: {
            select: { title: 'tournament.title', media: 'logo' },
            prepare({ title, media }) {
              return {
                title: title || 'Ungrouped Logo',
                media,
              }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: title || 'Community Champions' }
    },
  },
})
```

**Changes vs Prismic `CommunityChampions`:**
- `heading` was StructuredText (single h2) → `string`
- `description` StructuredText → `portableText`
- `logos` Group-with-Link → array of inline objects (tournament ref + logo image)
- Tournament grouping preserved per user requirement

---

### 4.7 `ctaBanner` (NEW)

Call-to-action banner section. Not present in Prismic — new capability.

```typescript
// src/sanity/schemas/sections/ctaBanner.ts
import { defineType, defineField } from 'sanity'

export const ctaBannerType = defineType({
  name: 'ctaBanner',
  title: 'Call to Action Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Button Link',
      type: 'string',
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'heading', media: 'backgroundImage' },
    prepare({ title, media }) {
      return {
        title: title || 'CTA Banner',
        media,
      }
    },
  },
})
```

---

### 4.8 `videoEmbed` (NEW)

Video section for embedding YouTube, Vimeo, or direct video URLs. Not present in Prismic — new capability.

```typescript
// src/sanity/schemas/sections/videoEmbed.ts
import { defineType, defineField } from 'sanity'

export const videoEmbedType = defineType({
  name: 'videoEmbed',
  title: 'Video Section',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or direct video URL',
      validation: (Rule) =>
        Rule.uri({ allowRelative: false, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'posterImage',
      title: 'Poster Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Thumbnail shown before video plays',
    }),
    defineField({
      name: 'spaceAbove',
      title: 'Space Above',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'spaceBelow',
      title: 'Space Below',
      type: 'boolean',
      initialValue: true,
    }),
  ],

  preview: {
    select: { title: 'heading', media: 'posterImage' },
    prepare({ title, media }) {
      return {
        title: title || 'Video Section',
        media,
      }
    },
  },
})
```

---

## 5. Schema Registry

```typescript
// src/sanity/schemas/index.ts
import { type SchemaTypeDefinition } from 'sanity'

// Document types
import { tournamentType } from './documents/tournament'
import { blogType } from './documents/blog'
import { blogCategoryType } from './documents/blogCategory'
import { teamType } from './documents/team'
import { matchType } from './documents/match'
import { playerType } from './documents/player'
import { teamMemberType } from './documents/teamMember'
import { broadcastPartnerType } from './documents/broadcastPartner'
import { sponsorType } from './documents/sponsor'
import { awardType } from './documents/award'
import { policyType } from './documents/policy'
import { pageType } from './documents/page'
import { testimonialType } from './documents/testimonial'
import { siteSettingsType } from './documents/siteSettings'

// Object types
import { portableTextType } from './objects/portableText'
import { seoType } from './objects/seo'
import { footerMenuType } from './objects/footerMenu'
import { linkType } from './objects/link'
import { ctaButtonType } from './objects/ctaButton'

// Section types (page builder blocks)
import { heroType } from './sections/hero'
import { textBlockType } from './sections/textBlock'
import { imageWithTextType } from './sections/imageWithText'
import { newsListType } from './sections/newsList'
import { dividerType } from './sections/divider'
import { communityChampionsType } from './sections/communityChampions'
import { ctaBannerType } from './sections/ctaBanner'
import { videoEmbedType } from './sections/videoEmbed'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Documents (14)
  tournamentType,
  blogType,
  blogCategoryType,
  teamType,
  matchType,
  playerType,
  teamMemberType,
  broadcastPartnerType,
  sponsorType,
  awardType,
  policyType,
  pageType,
  testimonialType,
  siteSettingsType,

  // Objects (5)
  portableTextType,
  seoType,
  footerMenuType,
  linkType,
  ctaButtonType,

  // Sections (8)
  heroType,
  textBlockType,
  imageWithTextType,
  newsListType,
  dividerType,
  communityChampionsType,
  ctaBannerType,
  videoEmbedType,
]
```

**Total schema count: 27** (14 documents + 5 objects + 8 sections)

---

## 6. Prismic-to-Sanity Field Mapping Table

### 6.1 `tournament`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | Auto-generated from `title` |
| `title` | `title` | Text → string | — |
| `nickname` | `nickname` | Text → string | — |
| `status` | `status` | Select → string (list) | Same options: Upcoming, Live, Complete |
| `featured` | `featured` | Boolean → boolean | — |
| `hero_image` | `heroImage` | Image → image | Added hotspot |
| `prize_pool` | `prizePool` | Number → number | — |
| `country_code` | `countryCode` | Text → string | Added max(2) validation |
| `stadium_name` | `stadiumName` | Text → string | — |
| `start_date` | `startDate` | Date → date | — |
| `end_date` | `endDate` | Date → date | — |
| `number_of_teams` | `numberOfTeams` | Number → number | — |
| `tickets_available` | `ticketsAvailable` | Boolean → boolean | — |
| `highlight_reel_link` | `highlightReelLink` | Text → url | Added URL validation |
| `opta_competition_id` | `optaCompetitionId` | Text → string | — |
| `opta_season_id` | `optaSeasonId` | Text → string | — |
| `opta_enabled` | `optaEnabled` | Boolean → boolean | — |
| `matches` (Group→Link) | `matches` | Group-with-Link → reference[] | Direct references, GROQ-queryable |
| `awards` (Group→Link) | `awards` | Group-with-Link → reference[] | Direct references |
| `recap` | `recap` | Link → reference | — |
| `know_before_you_go` | `knowBeforeYouGo` | StructuredText → portableText | — |
| `know_before_you_go_pdf` | `knowBeforeYouGoPdf` | Link-to-Media → file | — |
| `slices` | `sections` | Slices → array of section objects | — |
| `show_in_navigation` | `showInNavigation` | Boolean → boolean | — |
| `navigation_order` | `navigationOrder` | Number → number | — |
| `nav_image` | `navImage` | Image → image | Added hotspot |
| `navigation_description` | `navigationDescription` | Text → string | — |

### 6.2 `blog`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | Auto-generated from `title` |
| `title` | `title` | Text → string | — |
| `image` | `image` | Image → image | Added hotspot |
| `category` | `category` | Select (7 options) → reference | References `blogCategory` document |
| `date` | `date` | Date → date | — |
| `author` | `author` | Text → string | — |
| `excerpt` | `excerpt` | Text → text (rows: 3) | — |
| `content` | `content` | StructuredText → portableText | — |
| `tournament` | `tournament` | Link → reference | — |
| `matches` (Group→Link) | `matches` | Group-with-Link → reference[] | — |
| `teams` (Group→Link) | `teams` | Group-with-Link → reference[] | — |
| `slices` | `sections` | Slices → array of section objects | — |
| *(none)* | `seo` | *(new)* | Added SEO metadata object |

### 6.3 `team`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | Auto-generated from `name` |
| `name` | `name` | Text → string | — |
| `opta_id` | `optaId` | Text → string | — |
| `key` | `key` | Text → string | — |
| `country` | `country` | Text → string | — |
| `country_code` | `countryCode` | Text → string | Added max(2) validation |
| `logo` | `logo` | Image → image | — |
| `color_primary` | `colorPrimary` | Color (hex) → color | Uses `@sanity/color-input`; access via `.hex` |
| `color_secondary` | `colorSecondary` | Color (hex) → color | Uses `@sanity/color-input`; access via `.hex` |
| `alphabetical_sort_string` | `alphabeticalSortString` | Text → string | — |
| `tournaments` (Group→Link) | `tournaments` | Group-with-Link → reference[] | Also queryable in reverse via GROQ `references()` |
| `group` | `group` | Select → string (list) | Same options |

### 6.4 `match`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | — |
| `opta_id` | `optaId` | Text → string | — |
| `tournament` | `tournament` | Link → reference | Required |
| `match_number` | `matchNumber` | Number → number | — |
| `home_team` | `homeTeam` | Link → reference | — |
| `home_team_name_override` | `homeTeamNameOverride` | Text → string | — |
| `away_team` | `awayTeam` | Link → reference | — |
| `away_team_name_override` | `awayTeamNameOverride` | Text → string | — |
| `start_time` | `startTime` | Timestamp → datetime | — |
| `stage` | `stage` | Select → string (list) | Same options |
| `knockout_stage_match_type` | `knockoutStageMatchType` | Select → string (list) | Conditionally hidden |
| `broadcasts` (Group→Link) | `broadcasts` | Group-with-Link → reference[] | — |
| `slices` | `sections` | Slices → array of section objects | — |

### 6.5 `player`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | — |
| `opta_id` | `optaId` | Text → string | — |
| `first_name` | `firstName` | Text → string | — |
| `last_name` | `lastName` | Text → string | — |
| `headshot` | `headshot` | Image → image | Added hotspot |
| `team` | `team` | Link → reference | — |

### 6.6 `team_member`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `name` | `name` | Text → string | — |
| `uid` | `slug` | UID → slug | Auto-generated from `name` |
| `role` | `role` | Text → string | — |
| `headshot` | `headshot` | Image → image | Thumbnails handled by Sanity pipeline |
| `bio` | `bio` | StructuredText → portableText | — |
| `display_order` | `displayOrder` | Number → number | — |
| `department` | `department` | Select → string (list/radio) | Same options |

### 6.7 `broadcast_partners`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | Auto-generated from `name` |
| `name` | `name` | Text → string | — |
| `logo` | `logo` | Image → image | — |
| `logo_white` | `logoWhite` | Image → image | — |
| `icon_logo` | `iconLogo` | Image → image | — |
| `logo_on_primary` | `logoOnPrimary` | Image → image | — |
| `color_primary` | `colorPrimary` | Text (hex) → color | Was Text, now color picker |
| `color_secondary` | `colorSecondary` | Text (hex) → color | Was Text, now color picker |
| `streaming_link` | `streamingLink` | Text → url | Added URL validation |

### 6.8 `sponsor`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | Auto-generated from `name` |
| `name` | `name` | Text → string | — |
| `logo` | `logo` | Image → image | — |
| `color_primary` | `colorPrimary` | Text (hex) → color | Was Text, now color picker |
| `color_secondary` | `colorSecondary` | Text (hex) → color | Was Text, now color picker |
| `website_link` | `websiteLink` | Text → url | Added URL validation |
| `sort_order` | `sortOrder` | **Text → number** | **Type correction** — was stored as text |
| `visibility` | `visibility` | Boolean → boolean | — |

### 6.9 `awards`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | *(dropped)* | — | Awards don't have standalone pages |
| `award_title` | `awardTitle` | Text → string | — |
| `award_subtitle` | `awardSubtitle` | Text → string | — |
| `player_name` | `playerName` | Text → string | — |
| `player_team` | `playerTeam` | Link → reference | — |
| `player_headshot` | `playerHeadshot` | Image → image | Added hotspot |
| `sort_order` | `sortOrder` | **Text → number** | **Type correction** — was stored as text |

### 6.10 `policy`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `name` | `name` | Text → string | — |
| `uid` | `slug` | UID → slug | Auto-generated from `name` |
| `body` | `body` | StructuredText → portableText | — |
| `pdf` | `pdf` | Link-to-Media → file | — |
| `hide_from_nav` | `hideFromNav` | Boolean → boolean | — |
| `order` | `navOrder` | Number → number | Renamed for clarity |

### 6.11 `page`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | Auto-generated from `title` |
| *(none)* | `title` | *(new)* | Added for Studio UX |
| `slices` | `sections` | Slices → array of section objects | — |
| `meta_title` | `seo.metaTitle` | Text → seo object | Grouped into `seo` object |
| `meta_description` | `seo.metaDescription` | Text → seo object | Grouped into `seo` object |
| `meta_image` | `seo.metaImage` | Image → seo object | Grouped into `seo` object |

### 6.12 `testimonial`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| `uid` | `slug` | UID → slug | Auto-generated from `author` |
| `testimonial` | `quote` | Text → text (rows: 4) | Renamed to avoid field/type name collision |
| `author` | `author` | Text → string | — |

### 6.13 `website` → `siteSettings`

| Prismic Field | Sanity Field | Type Change | Notes |
|---|---|---|---|
| *(type)* | *(type)* | `website` → `siteSettings` | Renamed for clarity |
| `more_info_mode` | `moreInfoMode` | Select → string (list/radio) | Same options |
| `where_to_watch_partners` (Group→Link) | `whereToWatchPartners` | Group-with-Link → reference[] | — |
| `footer_menus` (nested Group) | `footerMenus` | Nested Group → array of `footerMenu` objects | — |
| `footer_menus[].menu_title` | `footerMenus[].menuTitle` | Text → string | — |
| `footer_menus[].menu_links` (nested Group) | `footerMenus[].links` | Nested Group → array of `link` objects | — |
| `footer_menus[].menu_links[].link_text` | `footerMenus[].links[].linkText` | Text → string | — |
| `footer_menus[].menu_links[].link_url` | `footerMenus[].links[].linkUrl` | Text → string | — |
| `footer_menus[].menu_links[].is_external` | `footerMenus[].links[].isExternal` | Boolean → boolean | — |

### 6.14 Dropped Types

| Prismic Type | Reason |
|---|---|
| `image_with_text` (custom type) | Dead weight. Exists as both custom type AND slice. Custom type appears unused in rendering. Only the slice version carries forward as a section type. |

---

## 7. Design Decisions Log

### 7.1 References vs Groups-with-Links

| Decision | Rationale |
|---|---|
| **All Group-with-Link patterns → direct reference arrays** | Prismic requires wrapping content relationships in a Group field. Sanity supports arrays of references natively. This simplifies the data shape and enables GROQ reverse queries (`references()`) without client-side filtering. |

**Example — Teams by Tournament:**

```
// Prismic: O(n) client-side
const allTeams = await client.getAllByType("team");
const filtered = allTeams.filter(t =>
  t.data.tournaments.some(t => t.tournament.uid === slug)
);

// Sanity: O(1) server-side
*[_type == "team" && references($tournamentId)]
```

### 7.2 Slugs vs UIDs

| Decision | Rationale |
|---|---|
| **Prismic UID → Sanity `slug` type** | Sanity's `slug` type provides: auto-generation from a source field, uniqueness validation, and `slug.current` in GROQ. Functionally identical to Prismic's UID but with better Studio UX. |

### 7.3 Color Type vs String

| Decision | Rationale |
|---|---|
| **Use `@sanity/color-input` plugin for all color fields** | Provides a proper color picker in Studio instead of typing hex codes manually. Data shape is `{ hex, alpha, hsl, hsv, rgb }` — components access `field.hex`. Slightly more complex during migration (convert hex string → color object) but better ongoing UX for the client. |

**Migration note:** Convert `"#FF0000"` → `{ _type: 'color', hex: '#FF0000', alpha: 1 }`

### 7.4 Categories as Documents vs Selects

| Decision | Rationale |
|---|---|
| **Blog categories → `blogCategory` document type** | Prismic hardcodes 7 category options in the `blog` model. Adding a new category requires a code deployment. Sanity's approach: create a `blogCategory` document type. The client can add/edit/remove categories from Studio without developer involvement. |

**Pre-populated categories during migration:**
- Announcements
- Tournament Recap
- Match Recap
- Social Impact
- Match Day Preview
- Press Releases
- Youth Events

### 7.5 Portable Text vs Simple Strings for Headings

| Decision | Rationale |
|---|---|
| **Slice headings → plain `string` fields** | Prismic uses StructuredText even for single-line headings (e.g., `SubpageHero.heading` is StructuredText limited to `heading1`). This is unnecessary complexity — a heading is always one line with no formatting. Sanity uses `string` for these fields, which simplifies the data shape and component code. Rich text (`portableText`) is reserved for body content. |

**Affected fields:**
- `hero.heading` (was StructuredText/h1)
- `hero.description` (was StructuredText/paragraph)
- `textBlock.heading` (was StructuredText/h2)
- `imageWithText.title` (was StructuredText/h3)
- `newsList.heading` (was StructuredText/h2)
- `communityChampions.heading` (was StructuredText/h2)

### 7.6 Padding vs Spacing Fields

| Decision | Rationale |
|---|---|
| **Preserve both `paddingTop/paddingBottom` and `spaceAbove/spaceBelow` where they exist** | Some Prismic slices (TextBlock, ImageWithText) have both padding AND spacing booleans — they control different things. Padding affects internal content spacing within the component; spacing affects the gap between sections. Consolidating would break existing layouts. Sections that only have spacing (Hero, Divider, NewsList, CommunityChampions) keep just `spaceAbove/spaceBelow`. |

### 7.7 Singleton Pattern for Site Settings

| Decision | Rationale |
|---|---|
| **`siteSettings` as singleton document with fixed ID** | Prismic's `website` type was `repeatable: false`. Sanity achieves this via the desk structure: a fixed `documentId: 'siteSettings'` in the `S.document()` builder. This prevents multiple instances and provides a direct edit link in the Studio sidebar. |

### 7.8 `image_with_text` Custom Type — Dropped

| Decision | Rationale |
|---|---|
| **Drop the `image_with_text` custom type entirely** | It duplicates the `ImageWithText` shared slice and appears unused in page rendering. The slice version carries forward as the `imageWithText` section type. |

### 7.9 `testimonial` — Included

| Decision | Rationale |
|---|---|
| **Include `testimonial` as a document type** | Per user direction, testimonials are carried over. The field `testimonial` is renamed to `quote` to avoid the type-name/field-name collision. |

### 7.10 Knockout Stage Match Type — Conditional Visibility

| Decision | Rationale |
|---|---|
| **`knockoutStageMatchType` field hidden unless `stage === 'Knockout Stage'`** | In Prismic, both fields are always visible regardless of the match stage. Sanity allows conditional field visibility via `hidden: ({ parent }) => ...`. This improves the editing experience by hiding irrelevant options. |

### 7.11 Type Corrections

| Field | Was (Prismic) | Now (Sanity) | Why |
|---|---|---|---|
| `sponsor.sort_order` | Text | number | Was incorrectly typed as text in Prismic; should always be numeric |
| `awards.sort_order` | Text | number | Same — stored as text but used for ordering |
| `broadcast_partners.streaming_link` | Text | url | Should be a validated URL |
| `sponsor.website_link` | Text | url | Should be a validated URL |
| `tournament.highlight_reel_link` | Text | url | Should be a validated URL |

### 7.12 New Section Types

| Section | Purpose |
|---|---|
| `ctaBanner` | Call-to-action banner with heading, description, button, and background image. Provides a dedicated CTA section the client can drop into any page. |
| `videoEmbed` | Video section with heading, URL, and poster image. Supports YouTube/Vimeo embeds as a first-class section type. |

### 7.13 `ctaButton` Portable Text Block

| Decision | Rationale |
|---|---|
| **Add `ctaButton` as embeddable block in Portable Text** | Prismic's StructuredText doesn't support custom inline objects. Sanity's Portable Text does. This lets editors embed styled CTA buttons directly within rich text content — useful for blog posts and policy pages. |

---

*Phase document authored: 2026-02-17*
*Based on master plan: `llms/sanity-migration/plan.md` (Sections 5 & 6)*
*Total schemas: 27 (14 documents + 5 objects + 8 sections)*
