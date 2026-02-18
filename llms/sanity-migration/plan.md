# W7F Website: Prismic to Sanity Migration Plan

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Assessment of Current Prismic Usage](#2-assessment-of-current-prismic-usage)
3. [Should We Fundamentally Update CMS Data Flow?](#3-should-we-fundamentally-update-cms-data-flow)
4. [New Repo Strategy](#4-new-repo-strategy)
5. [Sanity Schema Design](#5-sanity-schema-design)
6. [Page Builder & Section Types](#6-page-builder--section-types)
7. [Sanity Studio Configuration](#7-sanity-studio-configuration)
8. [Visual Editing Setup](#8-visual-editing-setup)
9. [Data Fetching Architecture](#9-data-fetching-architecture)
10. [Content Migration](#10-content-migration)
11. [Opta Integration Preservation](#11-opta-integration-preservation)
12. [Implementation Phases](#12-implementation-phases)
13. [Risk Register](#13-risk-register)
14. [File-by-File Change Map](#14-file-by-file-change-map)

---

## 1. Executive Summary

**What:** Migrate the World Sevens Football website from Prismic CMS to Sanity CMS.

**Why:** Pain points across all dimensions — content editing UX, developer experience, content modeling limitations, and cost/strategic concerns. Prismic's Slice Machine workflow, flat category fields, client-side relationship filtering, and limited content relationship support are all friction points.

**Approach:** Clean Slate (Approach B). Rather than porting the Prismic model 1:1, redesign the content model from scratch to leverage Sanity's strengths: GROQ for powerful server-side joins, proper document references, Portable Text for rich content, embedded Studio with Visual Editing, and a more intuitive page-builder experience for the client.

**Key Decisions:**
- Embedded Sanity Studio at `/studio` within the Next.js app
- Visual Editing with click-to-edit overlays on the live site
- Script-migrate all existing content from Prismic to Sanity
- New repo (clone of current) to work from

---

## 2. Assessment of Current Prismic Usage

### 2.1 Content Model Overview

The current Prismic repository (`world-sevens-football`) contains **15 custom types** and **6 shared slices**.

#### Custom Types

| Type | Format | Repeatable | Purpose | Field Count |
|------|--------|------------|---------|-------------|
| `tournament` | page | Yes | Tournament events with Opta integration | 23+ fields |
| `blog` | page | Yes | News articles with categories | 12+ fields |
| `team` | custom | Yes | Football clubs | 12 fields |
| `match` | page | Yes | Individual matches | 13+ fields |
| `player` | custom | Yes | Football players | 6 fields |
| `team_member` | page | Yes | Leadership/staff bios | 6 fields |
| `broadcast_partners` | custom | Yes | TV/streaming partners | 9 fields |
| `sponsor` | custom | Yes | Tournament sponsors | 8 fields |
| `awards` | custom | Yes | Tournament awards | 7 fields |
| `policy` | page | Yes | Legal/policy documents | 6 fields |
| `page` | page | Yes | Generic pages (SliceZone) | 2+ SEO fields |
| `website` | custom | No (singleton) | Global site settings | Footer + Navbar config |
| `testimonial` | custom | Yes | Testimonial quotes | 3 fields |
| `image_with_text` | custom | Yes | Standalone image+text blocks | 6 fields |

#### Shared Slices (used in `page` type's SliceZone)

| Slice | Purpose | Key Fields |
|-------|---------|------------|
| `SubpageHero` | Hero section with image | subtitle, heading, description, image |
| `TextBlock` | Rich text content | heading, body, text_align, text_size, content_width |
| `ImageWithText` | Image alongside text | eyebrow, title, description, image, image_position |
| `NewsList` | Blog listing by category | heading, category (Select), manual posts |
| `Divider` | Visual separator | space_above, space_below |
| `CommunityChampions` | Logo showcase grid | heading, description, logos (Group) |

### 2.2 Data Fetching Architecture

**Client Setup:** `src/prismicio.ts` + `src/cms/client.ts`
- Production: `force-cache` with ISR tag `"prismic"` for on-demand revalidation
- Development: 60-second revalidation
- Auto-preview enabled via `@prismicio/next`

**Query Layer:** 11 query files in `src/cms/queries/`:
- `tournaments.ts` — 5 functions (by UID, by status, live, navigation, by Opta ID)
- `blog.ts` — 7 functions (by slug, tag, tournament, team, match, all news)
- `team.ts` — 7 functions (by tournament, Opta ID, UID, department, leadership)
- `navigation.ts` — 2 functions (site settings, nav settings)
- `policies.ts` — 2 functions (by slug, nav list)
- `sponsors.ts`, `broadcast-partners.ts`, `players.ts`, `match.ts`, `social-contents.ts`, `website.ts`

**Route Resolver:** Only one route defined:
```typescript
const routes: Route[] = [
  { type: "tournament", path: "/tournament/:uid" }
];
```

### 2.3 Architectural Weaknesses

These are the specific problems the Sanity migration should solve:

#### Problem 1: Client-Side Relationship Filtering
Teams belong to tournaments via a repeatable Group field with content relationship links. To get teams for a tournament, the code fetches ALL teams and filters client-side:
```typescript
// Current approach in team.ts
const allTeams = await client.getAllByType("team", { fetchLinks: [...] });
const filteredTeams = allTeams.filter(team =>
  team.data.tournaments.some(t => t.tournament.uid === tournamentUID)
);
```
This is O(n) over all teams for every tournament page load. Sanity's GROQ can do this server-side with a single query.

#### Problem 2: Flat Category Strings
Blog categories are a Select field with hardcoded options: `["Announcements", "Tournament Recap", "Match Recap", "Social Impact", "Match Day Preview", "Press Releases", "Youth Events"]`. Adding a new category requires a code deployment (model change). In Sanity, these should be tag documents the client can manage, with support for multiple tags per post.

#### Problem 3: Excessive API Calls Per Page
The homepage makes 10+ separate Prismic API calls plus Opta calls:
1. `getTournaments()` — all tournaments
2. `getLiveTournament()` — filtered query
3. For each completed tournament: `getF1Fixtures()` + `getTeamsByTournament()`
4. `getSocialBlogsByCategory("Tournament Recap")`
5. `getAllNews()`
6. `fetchClubListData()` for each tournament

Sanity's GROQ can consolidate many of these into 1-2 queries with embedded references.

#### Problem 4: Duplicated Content Types
`image_with_text` exists as both a custom type AND a slice. The custom type appears unused in page rendering — it's dead weight in the content model.

#### Problem 5: Rigid Slice Architecture
Prismic's Slice Machine requires model.json definitions, mocks.json, type generation, and adapter setup for every slice. Adding or modifying slices involves touching 4+ files and running codegen. Sanity's schema-as-code approach is faster to iterate on.

#### Problem 6: Limited Rich Text
Prismic's StructuredText is functional but the editing experience is basic. Sanity's Portable Text is more extensible, supports custom inline objects, and the client can embed structured blocks (CTAs, callouts, videos) directly in the text editor.

#### Problem 7: fetchLinks Limitations
Prismic's `fetchLinks` only resolves one level of references and requires specifying individual fields. Deep relationships (tournament -> match -> team -> player) require multiple queries. Sanity's GROQ resolves arbitrarily deep references in one query.

---

## 3. Should We Fundamentally Update CMS Data Flow?

**Yes.** The migration is the right time to restructure how data flows from CMS to components. Here's what should change:

### 3.1 Current Flow (Prismic)

```
Prismic API -> Multiple client.getAllByType() calls -> Client-side filtering
-> Client-side relationship resolution -> Props assembly -> Component render
```

Each page component is responsible for orchestrating multiple API calls, filtering results, and resolving relationships. The homepage alone has ~100 lines of data fetching logic.

### 3.2 New Flow (Sanity)

```
Sanity Content Lake -> 1-2 GROQ queries with embedded references
-> Pre-resolved data -> Component render
```

**Key changes:**

1. **GROQ replaces multiple API calls.** A single GROQ query can fetch a tournament with its teams, matches, awards, and broadcast partners all in one request:
   ```groq
   *[_type == "tournament" && slug.current == $slug][0]{
     ...,
     "teams": *[_type == "team" && references(^._id)]{
       ...,
       "players": *[_type == "player" && references(^._id)]
     },
     "matches": matches[]->{
       ...,
       homeTeam->,
       awayTeam->,
       broadcasts[]->
     },
     awards[]->{..., playerTeam->}
   }
   ```

2. **References replace Groups with Links.** Instead of a Group field containing Link fields (Prismic's pattern for many-to-many), Sanity uses direct references with back-references via GROQ.

3. **Centralized query files remain but simplify.** Keep the `src/cms/queries/` pattern but each function becomes a single GROQ call instead of multi-step fetch+filter.

4. **Server-side filtering replaces client-side.** GROQ filters run in Sanity's Content Lake, not in your Next.js server.

5. **Live Content API replaces ISR tags.** Sanity's `defineLive` from `next-sanity` handles revalidation automatically — no manual cache tags.

### 3.3 What Stays the Same

- **Opta integration layer** (`src/app/api/opta/`) — unchanged. This is external sports data, not CMS content.
- **Component architecture** — the component tree stays the same, only the data source changes.
- **Styling system** — Tailwind CSS v4 + styled-components untouched.
- **Third-party integrations** — Supabase, Klaviyo, Resend, Millicast, Dolby all remain as-is.
- **Route structure** — same URL patterns, same page files.

---

## 4. New Repo Strategy

### 4.1 Setup

1. Create a new repository (e.g., `w7f-website-sanity`) by cloning the current repo
2. Create a fresh branch `sanity-migration` from `main`
3. Remove all Prismic dependencies and configuration
4. Install Sanity dependencies

### 4.2 What Gets Removed

```
# Prismic packages to remove
@prismicio/client
@prismicio/next
@prismicio/react
@prismicio/types
@slicemachine/adapter-next
prismic-ts-codegen
slice-machine-ui

# Prismic files to remove
src/prismicio.ts
src/cms/client.ts
src/cms/slices/          (entire directory -- replaced by Sanity section components)
slicemachine.config.json
customtypes/             (entire directory -- replaced by Sanity schemas)
prismicio-types.d.ts
src/app/api/preview/
src/app/api/exit-preview/
src/app/slice-simulator/
src/components/website-base/prismic-rich-text.tsx
```

### 4.3 What Gets Added

```
# Sanity packages to install
sanity                    # Core Sanity Studio
next-sanity               # Next.js integration
@sanity/image-url         # Image URL builder
@sanity/vision            # GROQ playground (Studio plugin)

# New file structure
src/
  sanity/
    client.ts          # Sanity client + GROQ helpers
    live.ts            # defineLive setup for Live Content API
    image.ts           # Image URL builder utility
    env.ts             # Environment variable validation
    lib/
      queries.ts     # Centralized GROQ query definitions
    schemas/
      index.ts       # Schema registry
      documents/     # Document type schemas
        tournament.ts
        blog.ts
        team.ts
        match.ts
        player.ts
        teamMember.ts
        broadcastPartner.ts
        sponsor.ts
        award.ts
        policy.ts
        page.ts
        blogTag.ts         # NEW: replaces hardcoded Select, multi-tag
        siteSettings.ts    # Singleton: nav + footer + global config
      objects/       # Reusable object types
        portableText.ts    # Rich text configuration
        seo.ts             # SEO metadata object
        link.ts            # Internal/external link object
        footerMenu.ts      # Footer menu structure
      sections/      # Page builder section types (replace slices)
        hero.ts
        textBlock.ts
        imageWithText.ts
        newsList.ts
        divider.ts
        communityChampions.ts
        ctaBanner.ts       # NEW: call-to-action banner
        videoEmbed.ts      # NEW: video section
    structure/
      index.ts       # Custom Studio desk structure
  app/
    studio/
      [[...tool]]/
        page.tsx   # Embedded Sanity Studio route
```

### 4.4 Environment Variables

```env
# Remove
NEXT_PUBLIC_PRISMIC_ENVIRONMENT=...
PRISMIC_ACCESS_TOKEN=...
PRISMIC_WRITE_TOKEN=...

# Add
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=https://worldsevensfootball.com/studio
SANITY_API_READ_TOKEN=<viewer-token>
SANITY_API_WRITE_TOKEN=<editor-token>   # For migration scripts only
```

---

## 5. Sanity Schema Design

### 5.1 Design Principles

1. **References over Groups.** Use Sanity `reference` fields instead of Prismic's Group-with-Link pattern. This enables GROQ joins.
2. **Tag documents over Select fields.** Anything the client might want to add/remove should be a document, not a hardcoded list. Blog posts support multiple tags.
3. **Portable Text over StructuredText.** Richer editing, custom blocks, inline objects.
4. **Singletons for global config.** One `siteSettings` document replaces the `website` custom type with better structure.
5. **Consistent slug/title patterns.** Every document gets `title` + `slug` with auto-generation.

### 5.2 Document Schemas

#### `tournament`
```typescript
defineType({
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
    // Details group
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' },
      validation: Rule => Rule.required() }),
    defineField({ name: 'nickname', type: 'string' }),
    defineField({ name: 'status', type: 'string', options: {
      list: ['Upcoming', 'Live', 'Complete'],
      layout: 'radio'
    }}),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'prizePool', type: 'number' }),
    defineField({ name: 'countryCode', type: 'string',
      description: 'Two-letter ISO code (e.g. US, UK)' }),
    defineField({ name: 'stadiumName', type: 'string' }),
    defineField({ name: 'startDate', type: 'date' }),
    defineField({ name: 'endDate', type: 'date' }),
    defineField({ name: 'numberOfTeams', type: 'number' }),
    defineField({ name: 'ticketsAvailable', type: 'boolean', initialValue: false }),

    // Media group
    defineField({ name: 'heroImage', type: 'image',
      options: { hotspot: true }, group: 'media' }),
    defineField({ name: 'highlightReelLink', type: 'url', group: 'media' }),

    // Opta group
    defineField({ name: 'optaCompetitionId', type: 'string', group: 'opta' }),
    defineField({ name: 'optaSeasonId', type: 'string', group: 'opta' }),
    defineField({ name: 'optaEnabled', type: 'boolean',
      initialValue: false, group: 'opta' }),

    // Relationships -- these use references, queryable via GROQ
    defineField({ name: 'matches', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'match' }] }] }),
    defineField({ name: 'awards', type: 'array',
      of: [{ type: 'reference', to: [{ type: 'award' }] }] }),
    defineField({ name: 'recap', type: 'reference', to: [{ type: 'blog' }] }),

    // Content group
    defineField({ name: 'knowBeforeYouGo', type: 'portableText', group: 'content' }),
    defineField({ name: 'knowBeforeYouGoPdf', type: 'file', group: 'content' }),
    defineField({ name: 'sections', type: 'array', of: sectionTypes, group: 'content' }),

    // Navigation group
    defineField({ name: 'showInNavigation', type: 'boolean',
      initialValue: false, group: 'navigation' }),
    defineField({ name: 'navigationOrder', type: 'number', group: 'navigation' }),
    defineField({ name: 'navImage', type: 'image',
      options: { hotspot: true }, group: 'navigation' }),
    defineField({ name: 'navigationDescription', type: 'string', group: 'navigation' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'status', media: 'heroImage' }
  }
})
```

#### `blog`
```typescript
defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' },
      validation: Rule => Rule.required() }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blogTag' }] }],
      validation: Rule => Rule.required()
    }),
    defineField({ name: 'date', type: 'date' }),
    defineField({ name: 'author', type: 'string' }),
    defineField({ name: 'excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'content', type: 'portableText' }),
    defineField({ name: 'tournament', type: 'reference', to: [{ type: 'tournament' }] }),
    defineField({
      name: 'matches',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'match' }] }]
    }),
    defineField({
      name: 'teams',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'team' }] }]
    }),
    defineField({ name: 'sections', type: 'array', of: sectionTypes }),
    defineField({ name: 'seo', type: 'seo' }),
  ],
  orderings: [
    { title: 'Date (Newest)', name: 'dateDesc',
      by: [{ field: 'date', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', tag0: 'tags.0.name', tag1: 'tags.1.name', media: 'image' },
    prepare: ({ title, tag0, tag1, media }) => ({
      title,
      subtitle: [tag0, tag1].filter(Boolean).join(', ') || 'No tags',
      media
    })
  }
})
```

#### `blogTag` (NEW -- replaces hardcoded Select, supports multiple tags per post)
```typescript
defineType({
  name: 'blogTag',
  title: 'Blog Tag',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' },
      validation: Rule => Rule.required() }),
    defineField({ name: 'description', type: 'text' }),
  ],
  preview: {
    select: { title: 'name' }
  }
})
// Pre-populate with: Announcements, Tournament Recap, Match Recap,
// Social Impact, Match Day Preview, Press Releases, Youth Events
```

#### `team`
```typescript
defineType({
  name: 'team',
  title: 'Team',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' },
      validation: Rule => Rule.required() }),
    defineField({ name: 'optaId', type: 'string' }),
    defineField({ name: 'key', type: 'string',
      description: 'Short team key/abbreviation' }),
    defineField({ name: 'country', type: 'string' }),
    defineField({ name: 'countryCode', type: 'string' }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'colorPrimary', type: 'color' }),
    defineField({ name: 'colorSecondary', type: 'color' }),
    defineField({ name: 'alphabeticalSortString', type: 'string' }),
    defineField({
      name: 'tournaments',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tournament' }] }]
    }),
    defineField({
      name: 'group',
      type: 'string',
      options: { list: ['Group 1', 'Group 2'] }
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'country', media: 'logo' }
  }
})
```

> **Architecture improvement:** With Sanity, "get teams for tournament X" becomes a single GROQ query:
> ```groq
> *[_type == "team" && references($tournamentId)]
> ```
> No more fetching all teams and filtering client-side.

#### `match`
```typescript
defineType({
  name: 'match',
  title: 'Match',
  type: 'document',
  fields: [
    defineField({ name: 'slug', type: 'slug' }),
    defineField({ name: 'optaId', type: 'string' }),
    defineField({ name: 'tournament', type: 'reference',
      to: [{ type: 'tournament' }], validation: Rule => Rule.required() }),
    defineField({ name: 'matchNumber', type: 'number' }),
    defineField({ name: 'homeTeam', type: 'reference', to: [{ type: 'team' }] }),
    defineField({ name: 'homeTeamNameOverride', type: 'string' }),
    defineField({ name: 'awayTeam', type: 'reference', to: [{ type: 'team' }] }),
    defineField({ name: 'awayTeamNameOverride', type: 'string' }),
    defineField({ name: 'startTime', type: 'datetime' }),
    defineField({
      name: 'stage',
      type: 'string',
      options: { list: ['Group Stage', 'Knockout Stage'] }
    }),
    defineField({
      name: 'knockoutStageMatchType',
      type: 'string',
      options: {
        list: ['Group 1 Semifinal', 'Group 2 Semifinal',
               'Third Place Match', 'Final']
      }
    }),
    defineField({
      name: 'broadcasts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'broadcastPartner' }] }]
    }),
    defineField({ name: 'sections', type: 'array', of: sectionTypes }),
  ],
  preview: {
    select: {
      home: 'homeTeam.name', away: 'awayTeam.name',
      date: 'startTime', stage: 'stage'
    },
    prepare: ({ home, away, date, stage }) => ({
      title: `${home || 'TBD'} vs ${away || 'TBD'}`,
      subtitle: `${stage} -- ${date
        ? new Date(date).toLocaleDateString() : 'TBD'}`
    })
  }
})
```

#### `player`
```typescript
defineType({
  name: 'player',
  title: 'Player',
  type: 'document',
  fields: [
    defineField({ name: 'firstName', type: 'string' }),
    defineField({ name: 'lastName', type: 'string' }),
    defineField({ name: 'slug', type: 'slug' }),
    defineField({ name: 'optaId', type: 'string' }),
    defineField({ name: 'headshot', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'team', type: 'reference', to: [{ type: 'team' }] }),
  ],
  preview: {
    select: {
      first: 'firstName', last: 'lastName',
      media: 'headshot', team: 'team.name'
    },
    prepare: ({ first, last, media, team }) => ({
      title: `${first || ''} ${last || ''}`.trim(),
      subtitle: team,
      media
    })
  }
})
```

#### `teamMember`
```typescript
defineType({
  name: 'teamMember',
  title: 'Leadership Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'headshot', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', type: 'portableText' }),
    defineField({ name: 'displayOrder', type: 'number' }),
    defineField({
      name: 'department',
      type: 'string',
      options: {
        list: ['Player Advisor', 'Co-Founder', 'Leadership Team'],
        layout: 'radio'
      }
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }] }
  ],
  preview: {
    select: { title: 'name', subtitle: 'role', media: 'headshot' }
  }
})
```

#### `broadcastPartner`
```typescript
defineType({
  name: 'broadcastPartner',
  title: 'Broadcast Partner',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'logoWhite', type: 'image' }),
    defineField({ name: 'iconLogo', type: 'image' }),
    defineField({ name: 'logoOnPrimary', type: 'image' }),
    defineField({ name: 'colorPrimary', type: 'string' }),
    defineField({ name: 'colorSecondary', type: 'string' }),
    defineField({ name: 'streamingLink', type: 'url' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' }
  }
})
```

#### `sponsor`
```typescript
defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' } }),
    defineField({ name: 'logo', type: 'image' }),
    defineField({ name: 'colorPrimary', type: 'string' }),
    defineField({ name: 'colorSecondary', type: 'string' }),
    defineField({ name: 'websiteLink', type: 'url' }),
    defineField({ name: 'sortOrder', type: 'number' }),
    defineField({ name: 'visibility', type: 'boolean', initialValue: true }),
  ],
  orderings: [
    { title: 'Sort Order', name: 'sortAsc',
      by: [{ field: 'sortOrder', direction: 'asc' }] }
  ]
})
```

#### `award`
```typescript
defineType({
  name: 'award',
  title: 'Award',
  type: 'document',
  fields: [
    defineField({ name: 'awardTitle', type: 'string',
      validation: Rule => Rule.required() }),
    defineField({ name: 'awardSubtitle', type: 'string' }),
    defineField({ name: 'playerName', type: 'string' }),
    defineField({ name: 'playerTeam', type: 'reference', to: [{ type: 'team' }] }),
    defineField({ name: 'playerHeadshot', type: 'image',
      options: { hotspot: true } }),
    defineField({ name: 'sortOrder', type: 'number' }),
  ]
})
```

#### `policy`
```typescript
defineType({
  name: 'policy',
  title: 'Policy',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' },
      validation: Rule => Rule.required() }),
    defineField({ name: 'body', type: 'portableText' }),
    defineField({ name: 'pdf', type: 'file' }),
    defineField({ name: 'hideFromNav', type: 'boolean', initialValue: false }),
    defineField({ name: 'navOrder', type: 'number' }),
  ],
  orderings: [
    { title: 'Nav Order', name: 'orderAsc',
      by: [{ field: 'navOrder', direction: 'asc' }] }
  ]
})
```

#### `page` (with page builder sections)
```typescript
defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' },
      validation: Rule => Rule.required() }),
    defineField({
      name: 'sections',
      title: 'Page Sections',
      type: 'array',
      of: sectionTypes   // See Section 6 below
    }),
    defineField({ name: 'seo', type: 'seo' }),
  ]
})
```

#### `siteSettings` (singleton -- replaces `website` custom type)
```typescript
defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  groups: [
    { name: 'navigation', title: 'Navigation', default: true },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    // Navigation
    defineField({
      name: 'moreInfoMode',
      type: 'string',
      options: { list: ['Recent News', 'Where to watch'], layout: 'radio' },
      group: 'navigation'
    }),
    defineField({
      name: 'whereToWatchPartners',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'broadcastPartner' }] }],
      group: 'navigation'
    }),

    // Footer
    defineField({
      name: 'footerMenus',
      type: 'array',
      of: [{ type: 'footerMenu' }],
      group: 'footer'
    }),
  ]
})
```

### 5.3 Reusable Object Types

#### `portableText` (custom rich text)
```typescript
defineType({
  name: 'portableText',
  title: 'Rich Text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
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
            fields: [
              { name: 'href', type: 'url' },
              { name: 'openInNewTab', type: 'boolean', initialValue: false },
            ]
          }
        ]
      }
    },
    { type: 'image', options: { hotspot: true } },
    // Custom blocks the client can embed in text:
    { type: 'videoEmbed' },    // YouTube/Vimeo/custom player
    { type: 'ctaButton' },     // Call-to-action button
  ]
})
```

#### `seo`
```typescript
defineType({
  name: 'seo',
  title: 'SEO & Metadata',
  type: 'object',
  fields: [
    defineField({ name: 'metaTitle', type: 'string', title: 'Meta Title' }),
    defineField({ name: 'metaDescription', type: 'text',
      title: 'Meta Description', rows: 3 }),
    defineField({ name: 'metaImage', type: 'image', title: 'Social Share Image' }),
  ]
})
```

#### `footerMenu`
```typescript
defineType({
  name: 'footerMenu',
  title: 'Footer Menu',
  type: 'object',
  fields: [
    defineField({ name: 'menuTitle', type: 'string' }),
    defineField({
      name: 'links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'linkText', type: 'string' }),
          defineField({ name: 'linkUrl', type: 'string' }),
          defineField({ name: 'isExternal', type: 'boolean', initialValue: false }),
        ],
        preview: {
          select: { title: 'linkText', subtitle: 'linkUrl' }
        }
      }]
    }),
  ],
  preview: {
    select: { title: 'menuTitle' }
  }
})
```

---

## 6. Page Builder & Section Types

Sanity doesn't have "Slices" -- instead, pages use an array of typed objects (sections). This is more flexible and easier to extend.

### 6.1 Section Types Registry

```typescript
// src/sanity/schemas/sections/index.ts
export const sectionTypes = [
  { type: 'hero' },
  { type: 'textBlock' },
  { type: 'imageWithText' },
  { type: 'newsList' },
  { type: 'divider' },
  { type: 'communityChampions' },
  { type: 'ctaBanner' },       // NEW
  { type: 'videoEmbed' },      // NEW
]
```

### 6.2 Section Schemas

#### `hero` (replaces SubpageHero slice)
```typescript
defineType({
  name: 'hero',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({ name: 'subtitle', type: 'string' }),
    defineField({ name: 'heading', type: 'string',
      validation: Rule => Rule.required() }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'spaceAbove', type: 'boolean', initialValue: true }),
    defineField({ name: 'spaceBelow', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'subtitle' },
    prepare: ({ title, subtitle }) => ({
      title: title || 'Hero Section',
      subtitle: subtitle || ''
    })
  }
})
```

#### `textBlock` (replaces TextBlock slice)
```typescript
defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'body', type: 'portableText' }),
    defineField({
      name: 'textAlign',
      type: 'string',
      options: { list: ['left', 'center', 'right'], layout: 'radio' },
      initialValue: 'left'
    }),
    defineField({
      name: 'textSize',
      type: 'string',
      options: { list: ['small', 'medium', 'large'], layout: 'radio' },
      initialValue: 'medium'
    }),
    defineField({
      name: 'contentWidth',
      type: 'string',
      options: { list: ['full', 'large', 'medium', 'small'], layout: 'radio' },
      initialValue: 'full'
    }),
    defineField({ name: 'spaceAbove', type: 'boolean', initialValue: true }),
    defineField({ name: 'spaceBelow', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare: ({ title }) => ({ title: title || 'Text Block' })
  }
})
```

#### `imageWithText` (replaces ImageWithText slice)
```typescript
defineType({
  name: 'imageWithText',
  title: 'Image with Text',
  type: 'object',
  fields: [
    defineField({ name: 'eyebrow', type: 'string' }),
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'description', type: 'portableText' }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'imagePosition',
      type: 'string',
      options: { list: ['left', 'right'], layout: 'radio' },
      initialValue: 'right'
    }),
    defineField({ name: 'spaceAbove', type: 'boolean', initialValue: true }),
    defineField({ name: 'spaceBelow', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'title', media: 'image' },
    prepare: ({ title, media }) => ({
      title: title || 'Image with Text', media
    })
  }
})
```

#### `newsList` (replaces NewsList slice)
```typescript
defineType({
  name: 'newsList',
  title: 'News List',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({
      name: 'tag',
      type: 'reference',
      to: [{ type: 'blogTag' }],
      description: 'Filter by tag, or leave empty for all posts'
    }),
    defineField({
      name: 'manualPosts',
      title: 'Manual Posts (overrides tag filter)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'blog' }] }]
    }),
    defineField({ name: 'limit', type: 'number', initialValue: 6 }),
    defineField({ name: 'spaceAbove', type: 'boolean', initialValue: true }),
    defineField({ name: 'spaceBelow', type: 'boolean', initialValue: true }),
  ],
  preview: {
    select: { title: 'heading', tag: 'tag.name' },
    prepare: ({ title, tag }) => ({
      title: title || 'News List',
      subtitle: tag ? `Tag: ${tag}` : 'All posts'
    })
  }
})
```

#### `ctaBanner` (NEW section type)
```typescript
defineType({
  name: 'ctaBanner',
  title: 'Call to Action Banner',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'description', type: 'text' }),
    defineField({ name: 'buttonText', type: 'string' }),
    defineField({ name: 'buttonLink', type: 'string' }),
    defineField({ name: 'backgroundImage', type: 'image',
      options: { hotspot: true } }),
    defineField({ name: 'spaceAbove', type: 'boolean', initialValue: true }),
    defineField({ name: 'spaceBelow', type: 'boolean', initialValue: true }),
  ]
})
```

#### `videoEmbed` (NEW section type)
```typescript
defineType({
  name: 'videoEmbed',
  title: 'Video Section',
  type: 'object',
  fields: [
    defineField({ name: 'heading', type: 'string' }),
    defineField({ name: 'videoUrl', type: 'url',
      description: 'YouTube, Vimeo, or direct video URL' }),
    defineField({ name: 'posterImage', type: 'image',
      options: { hotspot: true } }),
    defineField({ name: 'spaceAbove', type: 'boolean', initialValue: true }),
    defineField({ name: 'spaceBelow', type: 'boolean', initialValue: true }),
  ]
})
```

### 6.3 Section Renderer Component

Replace Prismic's `<SliceZone>` with a custom section renderer:

```tsx
// src/components/sections/section-renderer.tsx
import { HeroSection } from './hero-section'
import { TextBlockSection } from './text-block-section'
import { ImageWithTextSection } from './image-with-text-section'
import { NewsListSection } from './news-list-section'
import { DividerSection } from './divider-section'
import { CommunityChampionsSection } from './community-champions-section'
import { CtaBannerSection } from './cta-banner-section'
import { VideoEmbedSection } from './video-embed-section'

const sectionComponents: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  textBlock: TextBlockSection,
  imageWithText: ImageWithTextSection,
  newsList: NewsListSection,
  divider: DividerSection,
  communityChampions: CommunityChampionsSection,
  ctaBanner: CtaBannerSection,
  videoEmbed: VideoEmbedSection,
}

export function SectionRenderer({ sections }: { sections: any[] }) {
  if (!sections?.length) return null

  return (
    <>
      {sections.map((section, index) => {
        const Component = sectionComponents[section._type]
        if (!Component) return null
        return <Component key={section._key || index} {...section} />
      })}
    </>
  )
}
```

---

## 7. Sanity Studio Configuration

### 7.1 Embedded Studio Route

```tsx
// src/app/studio/[[...tool]]/page.tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export const dynamic = 'force-static'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

### 7.2 Studio Configuration

```typescript
// src/sanity/sanity.config.ts
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { presentationTool } from 'sanity/presentation'
import { schemaTypes } from './schemas'
import { structure } from './structure'

export default defineConfig({
  name: 'w7f-studio',
  title: 'World Sevens Football',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/studio',

  plugins: [
    structureTool({ structure }),
    presentationTool({
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
    }),
    visionTool({ defaultApiVersion: '2025-03-04' }),
  ],

  schema: {
    types: schemaTypes,
  },
})
```

### 7.3 Custom Desk Structure

Organize the Studio for the client's workflow:

```typescript
// src/sanity/structure/index.ts
import { StructureBuilder } from 'sanity/structure'

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      // Singleton: Site Settings
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),

      S.divider(),

      // Content groups for the client
      S.listItem()
        .title('Tournaments')
        .child(
          S.list()
            .title('Tournaments')
            .items([
              S.documentTypeListItem('tournament').title('All Tournaments'),
              S.documentTypeListItem('match').title('Matches'),
              S.documentTypeListItem('award').title('Awards'),
            ])
        ),

      S.listItem()
        .title('Teams & Players')
        .child(
          S.list()
            .title('Teams & Players')
            .items([
              S.documentTypeListItem('team').title('Teams'),
              S.documentTypeListItem('player').title('Players'),
            ])
        ),

      S.listItem()
        .title('News & Content')
        .child(
          S.list()
            .title('News & Content')
            .items([
              S.documentTypeListItem('blog').title('Blog Posts'),
              S.documentTypeListItem('blogTag').title('Tags'),
              S.documentTypeListItem('page').title('Pages'),
            ])
        ),

      S.listItem()
        .title('Partners & Sponsors')
        .child(
          S.list()
            .title('Partners & Sponsors')
            .items([
              S.documentTypeListItem('broadcastPartner')
                .title('Broadcast Partners'),
              S.documentTypeListItem('sponsor').title('Sponsors'),
            ])
        ),

      S.listItem()
        .title('Organization')
        .child(
          S.list()
            .title('Organization')
            .items([
              S.documentTypeListItem('teamMember').title('Leadership'),
              S.documentTypeListItem('policy').title('Policies'),
            ])
        ),
    ])
```

---

## 8. Visual Editing Setup

### 8.1 Live Content API

```typescript
// src/sanity/live.ts
import { createClient } from 'next-sanity'
import { defineLive } from 'next-sanity/live'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  useCdn: true,
  apiVersion: '2025-03-04',
  stega: { studioUrl: '/studio' },
})

const token = process.env.SANITY_API_READ_TOKEN
if (!token) throw new Error('Missing SANITY_API_READ_TOKEN')

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})
```

### 8.2 Draft Mode API Route

```typescript
// src/app/api/draft-mode/enable/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  ;(await draftMode()).enable()
  redirect(url || '/')
}
```

### 8.3 SanityLive in Root Layout

```tsx
// src/app/layout.tsx -- add SanityLive component
import { SanityLive } from '@/sanity/live'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  )
}
```

### 8.4 Using sanityFetch in Pages

```tsx
// src/app/(website)/(subpages)/[uid]/page.tsx
import { sanityFetch } from '@/sanity/live'
import { defineQuery } from 'next-sanity'
import { SectionRenderer } from '@/components/sections/section-renderer'

const PAGE_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    sections[]{
      ...,
      _type == "newsList" => {
        ...,
        tag->,
        manualPosts[]->{
          _id, title, slug, image, date, excerpt, tags[]->
        }
      }
    },
    seo
  }
`)

export default async function Page({
  params
}: { params: Promise<{ uid: string }> }) {
  const { uid } = await params
  const { data: page } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug: uid }
  })

  if (!page) notFound()

  return <SectionRenderer sections={page.sections} />
}
```

---

## 9. Data Fetching Architecture

### 9.1 GROQ Query Definitions

```typescript
// src/sanity/lib/queries.ts
import { defineQuery } from 'next-sanity'

// -- Tournaments --
export const TOURNAMENTS_QUERY = defineQuery(`
  *[_type == "tournament"] | order(startDate desc) {
    _id, title, slug, status, featured, nickname,
    prizePool, countryCode, stadiumName, startDate, endDate,
    numberOfTeams, ticketsAvailable, heroImage,
    optaCompetitionId, optaSeasonId, optaEnabled,
    showInNavigation, navigationOrder, navImage, navigationDescription
  }
`)

export const TOURNAMENT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "tournament" && slug.current == $slug][0]{
    ...,
    matches[]->{
      ..., homeTeam->, awayTeam->, broadcasts[]->
    },
    awards[]->{..., playerTeam->},
    recap->{ title, slug, image, date, excerpt },
    "teams": *[_type == "team" && references(^._id)]{
      ...,
      "players": *[_type == "player" && references(^._id)]
    }
  }
`)

export const LIVE_TOURNAMENT_QUERY = defineQuery(`
  *[_type == "tournament" && status == "Live"][0]{
    ...,
    matches[]->{
      ..., homeTeam->, awayTeam->, broadcasts[]->
    },
    "teams": *[_type == "team" && references(^._id)]
  }
`)

export const NAV_TOURNAMENTS_QUERY = defineQuery(`
  *[_type == "tournament" && showInNavigation == true]
    | order(navigationOrder asc) {
    _id, title, slug, status, nickname, countryCode,
    startDate, endDate, navImage, navigationDescription,
    optaCompetitionId, optaSeasonId, optaEnabled
  }
`)

// -- Blog / News --
export const ALL_NEWS_QUERY = defineQuery(`
  *[_type == "blog" && !("press-releases" in tags[]->slug.current)]
    | order(date desc) {
    _id, title, slug, image, date, author, excerpt,
    tags[]->{ _id, name, slug }
  }
`)

export const BLOG_BY_SLUG_QUERY = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    tags[]->{ _id, name, slug },
    tournament->{ title, slug },
    teams[]->{ name, slug, logo, colorPrimary },
    matches[]->{ _id, optaId },
    sections[]{
      ...,
      _type == "newsList" => {
        ...,
        tag->,
        manualPosts[]->{
          _id, title, slug, image, date, excerpt, tags[]->
        }
      }
    }
  }
`)

export const BLOGS_BY_TAG_QUERY = defineQuery(`
  *[_type == "blog" && $tagSlug in tags[]->slug.current]
    | order(date desc) {
    _id, title, slug, image, date, author, excerpt,
    tags[]->{ _id, name, slug }
  }
`)

export const BLOGS_BY_TOURNAMENT_QUERY = defineQuery(`
  *[_type == "blog" && tournament._ref == $tournamentId]
    | order(date desc) {
    _id, title, slug, image, date, author, excerpt,
    tags[]->{ _id, name, slug }
  }
`)

// -- Teams --
export const TEAMS_BY_TOURNAMENT_QUERY = defineQuery(`
  *[_type == "team" && references($tournamentId)]
    | order(alphabeticalSortString asc) {
    ...,
    tournaments[]->{ _id, title, slug }
  }
`)

export const TEAM_BY_OPTA_ID_QUERY = defineQuery(`
  *[_type == "team" && optaId == $optaId][0]
`)

// -- Navigation & Settings --
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    moreInfoMode,
    whereToWatchPartners[]->{
      name, logo, logoWhite, iconLogo, streamingLink
    },
    footerMenus
  }
`)

// -- Leadership --
export const TEAM_MEMBERS_BY_DEPARTMENT_QUERY = defineQuery(`
  *[_type == "teamMember" && department == $department]
    | order(displayOrder asc, name asc) {
    _id, name, slug, role, headshot, bio, displayOrder, department
  }
`)

// -- Policies --
export const POLICY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "policy" && slug.current == $slug][0]
`)

export const POLICIES_NAV_QUERY = defineQuery(`
  *[_type == "policy" && hideFromNav != true]
    | order(navOrder asc) {
    _id, name, slug, pdf
  }
`)

// -- Sponsors & Partners --
export const SPONSORS_QUERY = defineQuery(`
  *[_type == "sponsor" && visibility == true]
    | order(sortOrder asc) {
    _id, name, slug, logo, websiteLink
  }
`)

export const BROADCAST_PARTNERS_QUERY = defineQuery(`
  *[_type == "broadcastPartner"] {
    _id, name, logo, logoWhite, iconLogo, logoOnPrimary,
    colorPrimary, colorSecondary, streamingLink
  }
`)
```

### 9.2 Refactored Query Functions

```typescript
// src/cms/queries/tournaments.ts -- AFTER migration
import { sanityFetch } from '@/sanity/live'
import {
  TOURNAMENTS_QUERY,
  TOURNAMENT_BY_SLUG_QUERY,
  LIVE_TOURNAMENT_QUERY,
  NAV_TOURNAMENTS_QUERY,
} from '@/sanity/lib/queries'

export async function getTournaments() {
  const { data } = await sanityFetch({ query: TOURNAMENTS_QUERY })
  return data
}

export async function getTournamentBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: TOURNAMENT_BY_SLUG_QUERY,
    params: { slug }
  })
  return data
}

export async function getLiveTournament() {
  const { data } = await sanityFetch({ query: LIVE_TOURNAMENT_QUERY })
  return data
}

export async function getNavigationTournaments() {
  const { data } = await sanityFetch({ query: NAV_TOURNAMENTS_QUERY })
  return data
}
```

### 9.3 Homepage Data Fetching -- Before vs. After

**Before (Prismic) -- ~100 lines, 10+ API calls:**
```typescript
const [allTournaments, liveTournament] = await Promise.all([
  getTournaments(), getLiveTournament()
]);
const completeTournaments = allTournaments
  .filter(t => t.data.status === "Complete")...;
const heroTournamentsWithChampions = await Promise.all(
  completeTournaments.map(async (t) => {
    const [fixtures, teams] = await Promise.all([
      getF1Fixtures(...), getTeamsByTournament(t.uid)
    ]);
    // ... find champion by matching Opta IDs ...
  })
);
const tournamentRecapBlogs = await getSocialBlogsByCategory("Tournament Recap");
const allBlogs = await getAllNews();
// ... more fetching ...
```

**After (Sanity) -- ~20 lines, 2-3 GROQ calls + Opta:**
```typescript
const HOMEPAGE_QUERY = defineQuery(`{
  "tournaments": *[_type == "tournament"] | order(startDate desc) {
    ...,
    "teams": *[_type == "team" && references(^._id)]{
      ..., logo, optaId
    },
    recap->{ title, slug, image },
    awards[]->{..., playerTeam->}
  },
  "liveTournament": *[_type == "tournament" && status == "Live"][0]{
    ...,
    matches[]->{
      ..., homeTeam->, awayTeam->, broadcasts[]->
    },
    "teams": *[_type == "team" && references(^._id)]
  },
  "recentNews": *[_type == "blog"
    && !("press-releases" in tags[]->slug.current)]
    | order(date desc) [0...4] {
    _id, title, slug, image, date, excerpt, tags[]->
  },
  "recapBlog": *[_type == "blog"
    && "tournament-recap" in tags[]->slug.current]
    | order(date desc) [0] {
    _id, title, slug, image, date, excerpt
  }
}`)

const { data } = await sanityFetch({ query: HOMEPAGE_QUERY })
// Opta calls remain for live sports data -- these are NOT CMS content
```

---

## 10. Content Migration

### 10.1 Migration Strategy

Use the **Sanity Migration API** + **Prismic REST API** to script-migrate all content.

### 10.2 Migration Script Structure

```
scripts/
  migrate.ts                 # Main orchestrator
  prismic-client.ts          # Prismic API helper
  sanity-client.ts           # Sanity mutation client
  transformers/
    tournament.ts          # Prismic tournament -> Sanity tournament
    blog.ts
    team.ts
    match.ts
    player.ts
    teamMember.ts
    broadcastPartner.ts
    sponsor.ts
    award.ts
    policy.ts
    page.ts
    siteSettings.ts
    richText.ts            # Prismic StructuredText -> Portable Text
  utils/
    id-map.ts              # Prismic ID -> Sanity ID mapping
    image-upload.ts        # Download Prismic images -> upload to Sanity
    rich-text-converter.ts # StructuredText -> Portable Text converter
```

### 10.3 Migration Order (respects dependencies)

1. **Blog Tags** -- no dependencies, create first
2. **Broadcast Partners** -- no dependencies
3. **Sponsors** -- no dependencies
4. **Teams** -- references tournaments (created later, use deferred refs)
5. **Players** -- references teams
6. **Tournaments** -- references matches, awards, blogs, teams
7. **Matches** -- references tournaments, teams, broadcast partners
8. **Awards** -- references teams
9. **Team Members** -- no document dependencies
10. **Policies** -- no dependencies
11. **Blogs** -- references tags, tournaments, teams, matches
12. **Pages** -- may reference blogs in NewsList sections
13. **Site Settings** -- references broadcast partners

### 10.4 Rich Text Conversion

Prismic StructuredText -> Sanity Portable Text requires a transformer:

```typescript
// scripts/utils/rich-text-converter.ts
function prismicToPortableText(
  structuredText: PrismicRichTextField
): PortableTextBlock[] {
  return structuredText.map(node => {
    switch (node.type) {
      case 'paragraph':
      case 'heading1':
      case 'heading2':
      case 'heading3':
      case 'heading4':
        return {
          _type: 'block',
          _key: generateKey(),
          style: mapStyle(node.type),
          children: convertSpans(node.spans, node.text),
          markDefs: extractMarkDefs(node.spans),
        }
      case 'image':
        return {
          _type: 'image',
          _key: generateKey(),
          asset: { _type: 'reference', _ref: uploadedImageId },
        }
      case 'embed':
        return {
          _type: 'videoEmbed',
          _key: generateKey(),
          url: node.oembed.embed_url,
        }
      case 'list-item':
      case 'o-list-item':
        return {
          _type: 'block',
          _key: generateKey(),
          style: 'normal',
          listItem: node.type === 'list-item' ? 'bullet' : 'number',
          level: 1,
          children: convertSpans(node.spans, node.text),
          markDefs: extractMarkDefs(node.spans),
        }
      default:
        return null
    }
  }).filter(Boolean)
}
```

### 10.5 Image Migration

```typescript
// scripts/utils/image-upload.ts
import { createClient } from '@sanity/client'

const sanityClient = createClient({
  projectId: '...',
  dataset: 'production',
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2025-03-04',
  useCdn: false,
})

async function uploadImageFromUrl(
  imageUrl: string,
  filename: string
) {
  const response = await fetch(imageUrl)
  const buffer = await response.arrayBuffer()

  const asset = await sanityClient.assets.upload(
    'image',
    Buffer.from(buffer),
    { filename }
  )

  return asset._id
}
```

### 10.6 ID Mapping

Maintain a map of Prismic document IDs -> Sanity document IDs for resolving references:

```typescript
// scripts/utils/id-map.ts
const idMap = new Map<string, string>()

// Prismic ID -> Sanity ID
// e.g., "YxKz1REAACYA..." -> "tournament-fort-lauderdale-2025"
function sanityId(prismicType: string, prismicUid: string): string {
  // Use readable IDs based on type + uid for easier debugging
  return `${prismicType}-${prismicUid}`
}
```

---

## 11. Opta Integration Preservation

The Opta sports data integration is **independent of the CMS** and requires minimal changes.

### 11.1 What Stays the Same

- `src/app/api/opta/` -- all API routes unchanged
- `src/types/opta-feeds/` -- all TypeScript types unchanged
- `src/lib/opta/` -- utility functions unchanged
- Feed types: F1, F2, F3, F9, F13, F24, F40, F15, F30 -- all unchanged

### 11.2 What Changes

The only change is how Opta data connects to CMS data:

**Before:** Prismic `team.data.opta_id` matched against Opta team IDs
**After:** Sanity `team.optaId` matched against Opta team IDs -- same field, different access path

```typescript
// Before (Prismic)
const winnerOptaId = normalizeOptaId(winnerRef);
champion = teams.find(
  team => normalizeOptaId(`t${team.data.opta_id}`) === winnerOptaId
);

// After (Sanity)
const winnerOptaId = normalizeOptaId(winnerRef);
champion = teams.find(
  team => normalizeOptaId(`t${team.optaId}`) === winnerOptaId
);
```

The fix is mechanical -- change `team.data.opta_id` to `team.optaId` everywhere. The Opta API calls, XML parsing, and feed processing are completely untouched.

---

## 12. Implementation Phases

### Phase 1: Foundation (Days 1-3)

**Goal:** New repo with Sanity Studio running at `/studio`

- [ ] Clone repo to `w7f-website-sanity`
- [ ] Remove Prismic dependencies and files (see Section 4.2)
- [ ] Install `sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision`
- [ ] Create Sanity project via `npx sanity init`
- [ ] Set up environment variables
- [ ] Create all document schemas (Section 5.2)
- [ ] Create all object schemas (Section 5.3)
- [ ] Create all section schemas (Section 6.2)
- [ ] Configure Studio (Section 7.2)
- [ ] Set up custom desk structure (Section 7.3)
- [ ] Create embedded Studio route at `/studio`
- [ ] Verify Studio loads and all schemas appear correctly
- [ ] Update `next.config.ts` -- replace `images.prismic.io` with Sanity CDN hostname

### Phase 2: Data Fetching Layer (Days 4-6)

**Goal:** All GROQ queries written, sanityFetch working

- [ ] Set up Sanity client (`src/sanity/client.ts`)
- [ ] Set up Live Content API (`src/sanity/live.ts`)
- [ ] Set up image URL builder (`src/sanity/image.ts`)
- [ ] Write all GROQ query definitions (Section 9.1)
- [ ] Refactor query functions in `src/cms/queries/` to use sanityFetch
- [ ] Create Portable Text renderer to replace `prismic-rich-text.tsx`
- [ ] Create `SectionRenderer` component (Section 6.3)
- [ ] Set up draft mode API route (Section 8.2)
- [ ] Add `SanityLive` to root layout (Section 8.3)

### Phase 3: Page Migration (Days 7-12)

**Goal:** All pages render with Sanity data

Migrate pages in this order (simplest to most complex):

- [ ] **Policies** (`resources/[slug]`) -- simple single-doc pages
- [ ] **Leadership** (`leadership/`) -- list of team members by department
- [ ] **Dynamic Pages** (`[uid]`) -- SliceZone -> SectionRenderer
- [ ] **News** (`news/[slug]`) -- blog posts with categories
- [ ] **Contact** (`contact/`) -- may be static or CMS-driven
- [ ] **FAQs** (`faqs/`) -- may be static or CMS-driven
- [ ] **Club Pages** (`club/[slug]`) -- team data + Opta integration
- [ ] **Tournament Pages** (`tournament/[slug]`) -- most complex, Opta + CMS
- [ ] **Tournament Schedule** (`tournament/[slug]/schedule/`)
- [ ] **Match Pages** (`tournament/[slug]/match/[matchSlug]`) -- heavy Opta
- [ ] **Homepage** (`/`) -- consolidate all data fetching
- [ ] **Navigation** -- refactor to use Sanity site settings
- [ ] **Footer** -- refactor to use Sanity site settings

### Phase 4: Content Migration (Days 13-15)

**Goal:** All Prismic content migrated to Sanity

- [ ] Write migration scripts (Section 10.2)
- [ ] Build rich text converter (Prismic StructuredText -> Portable Text)
- [ ] Build image migration utility
- [ ] Run migration in this order (Section 10.3):
  1. Blog Tags
  2. Broadcast Partners, Sponsors
  3. Teams
  4. Players
  5. Tournaments
  6. Matches
  7. Awards
  8. Team Members
  9. Policies
  10. Blogs
  11. Pages
  12. Site Settings
- [ ] Verify all content renders correctly
- [ ] Spot-check images, links, rich text formatting

### Phase 5: Visual Editing & Polish (Days 16-18)

**Goal:** Visual Editing working, client can use the system

- [ ] Configure Presentation tool in Studio
- [ ] Enable stega encoding on Sanity client
- [ ] Test Visual Editing overlays on all page types
- [ ] Add `encodeDataAttribute` to key components for Visual Editing targets
- [ ] Set up proper CORS origins for Studio
- [ ] Configure Sanity project access roles (admin, editor)
- [ ] Test draft preview workflow end-to-end
- [ ] Write client-facing documentation for the Studio

### Phase 6: Testing & Cutover (Days 19-21)

**Goal:** Production-ready

- [ ] Full regression test of all pages
- [ ] Verify Opta integration works identically
- [ ] Test all API routes (Klaviyo, Resend, Opta, etc.)
- [ ] Performance audit -- verify GROQ queries are fast
- [ ] Update DNS / deployment to point to new repo
- [ ] Remove old Prismic repo access (after grace period)
- [ ] Monitor for 48 hours post-launch

---

## 13. Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Rich text conversion loses formatting | Medium | Medium | Build comprehensive test suite for StructuredText -> Portable Text; visually compare every blog post |
| Opta ID matching breaks after migration | Low | High | The field is a simple string copy; write a verification script that confirms all Opta IDs match |
| Image quality/dimensions change | Low | Medium | Upload original resolution images; Sanity's image pipeline handles responsive sizing |
| Client confused by new Studio | Medium | Medium | Write documentation; do a walkthrough session; customize Studio desk structure for their workflow |
| GROQ query performance on complex pages | Low | Medium | Use Sanity's CDN (useCdn: true); GROQ is typically faster than Prismic's REST API for resolved queries |
| Visual Editing overlays don't work on all components | Medium | Low | Start with key components (headings, text, images); progressively add stega encoding |
| Prismic content changes during migration window | Medium | High | Freeze Prismic edits during final migration run; or run a delta migration script |

---

## 14. File-by-File Change Map

### Files to DELETE

| File/Directory | Reason |
|---------------|--------|
| `src/prismicio.ts` | Replaced by `src/sanity/client.ts` |
| `src/cms/client.ts` | Replaced by `src/sanity/client.ts` |
| `src/cms/slices/` (entire directory) | Replaced by section components |
| `slicemachine.config.json` | Prismic-specific |
| `customtypes/` (entire directory) | Replaced by Sanity schemas |
| `prismicio-types.d.ts` | Types come from Sanity schema + GROQ inference |
| `src/app/api/preview/route.ts` | Replaced by Sanity draft mode |
| `src/app/api/exit-preview/route.ts` | Replaced by Sanity draft mode |
| `src/app/slice-simulator/` | Prismic-specific dev tool |
| `src/components/website-base/prismic-rich-text.tsx` | Replaced by Portable Text renderer |

### Files to CREATE

| File | Purpose |
|------|---------|
| `src/sanity/sanity.config.ts` | Studio configuration |
| `src/sanity/client.ts` | Sanity client setup |
| `src/sanity/live.ts` | Live Content API (`defineLive`) |
| `src/sanity/image.ts` | Image URL builder |
| `src/sanity/env.ts` | Environment variable validation |
| `src/sanity/lib/queries.ts` | All GROQ queries |
| `src/sanity/schemas/index.ts` | Schema registry |
| `src/sanity/schemas/documents/*.ts` | 13 document schemas (includes blogTag) |
| `src/sanity/schemas/objects/*.ts` | 4 object schemas |
| `src/sanity/schemas/sections/*.ts` | 8 section schemas |
| `src/sanity/structure/index.ts` | Custom desk structure |
| `src/app/studio/[[...tool]]/page.tsx` | Embedded Studio |
| `src/app/api/draft-mode/enable/route.ts` | Visual Editing draft mode |
| `src/components/sections/section-renderer.tsx` | Section rendering engine |
| `src/components/sections/*-section.tsx` | 8 section components |
| `src/components/portable-text.tsx` | Portable Text renderer |
| `scripts/migrate.ts` | Content migration orchestrator |
| `scripts/transformers/*.ts` | 13 content transformers |
| `scripts/utils/*.ts` | Migration utilities |

### Files to MODIFY

| File | Change |
|------|--------|
| `package.json` | Remove Prismic deps, add Sanity deps |
| `next.config.ts` | Replace `images.prismic.io` with `cdn.sanity.io` |
| `src/app/layout.tsx` | Remove `PrismicPreview`, add `SanityLive` |
| `src/app/(website)/(home)/page.tsx` | Refactor data fetching to GROQ |
| `src/app/(website)/(subpages)/[uid]/page.tsx` | SliceZone -> SectionRenderer |
| `src/app/(website)/(subpages)/news/[slug]/page.tsx` | Prismic -> Sanity queries |
| `src/app/(website)/(subpages)/tournament/[slug]/page.tsx` | Prismic -> Sanity queries |
| `src/app/(website)/(subpages)/tournament/[slug]/match/[matchSlug]/page.tsx` | Prismic -> Sanity queries |
| `src/app/(website)/(subpages)/club/[slug]/page.tsx` | Prismic -> Sanity queries |
| `src/app/(website)/(subpages)/leadership/page.tsx` | Prismic -> Sanity queries |
| `src/app/(website)/(subpages)/resources/[slug]/page.tsx` | Prismic -> Sanity queries |
| `src/app/(website)/(subpages)/faqs/page.tsx` | Prismic -> Sanity queries (if CMS-driven) |
| `src/app/(website)/(subpages)/contact/page.tsx` | Prismic -> Sanity queries (if CMS-driven) |
| `src/components/website-base/nav/nav-main.tsx` | Refactor data fetching |
| `src/components/website-base/footer/footer-main.tsx` | Refactor data fetching |
| `src/cms/queries/*.ts` (all 11 files) | Rewrite using sanityFetch + GROQ |
| `src/cms/utils.ts` | Update image helpers for Sanity |
| `src/cms/index.ts` | Update exports |
| `src/lib/utils.ts` | Update `mapBlogDocumentToMetadata` for Sanity shape |
| `.env.local` | Swap Prismic vars for Sanity vars |
| `.gitignore` | Add `.sanity/` if needed |
| `tsconfig.json` | Add path alias `@/sanity` if not covered by `@/` |

### Files UNCHANGED

| File/Directory | Why |
|---------------|-----|
| `src/app/api/opta/` | External sports data -- no CMS dependency |
| `src/app/api/klaviyo/` | Email marketing -- no CMS dependency |
| `src/app/api/resend/` | Transactional email -- no CMS dependency |
| `src/dolby/` | Video integration -- no CMS dependency |
| `src/components/ui/` | UI primitives -- no CMS dependency |
| `src/components/blocks/` | Presentation components -- receive data via props (may need minor type updates) |
| `src/hooks/` | Custom hooks -- no CMS dependency |
| `src/styles/` | Styling -- no CMS dependency |
| `src/types/opta-feeds/` | Opta types -- no CMS dependency |
| `src/lib/opta/` | Opta utilities -- no CMS dependency |

---

*Plan authored: 2026-02-17*
*Approach: Clean Slate (Approach B)*
*Target: ~21 working days across 6 phases*
