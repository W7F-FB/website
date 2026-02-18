# Phase 2: Data Flow & GROQ Query Architecture

> **For Claude:** This is an architecture reference document for the Sanity migration. Use it alongside `plan.md` (master plan) and the Phase 1 foundation document when implementing Phase 2.

**Goal:** Replace the entire Prismic data fetching layer with Sanity's GROQ-based architecture — client setup, query definitions, query functions, Portable Text rendering, caching, and error handling.

**Architecture:** Single `defineLive` entrypoint from `next-sanity` provides `sanityFetch` (server) and `SanityLive` (client). All queries become GROQ strings passed to `sanityFetch`. Caching is handled automatically by the Live Content API with CDN + stale-while-revalidate. Portable Text replaces Prismic StructuredText using the same typography components.

**Tech Stack:** `next-sanity`, `@sanity/image-url`, `@portabletext/react`, GROQ, Next.js App Router (RSC)

---

## Table of Contents

1. [Current Architecture Assessment](#1-current-architecture-assessment)
2. [New Architecture Design](#2-new-architecture-design)
3. [Sanity Client Setup](#3-sanity-client-setup)
4. [GROQ Query Definitions](#4-groq-query-definitions)
5. [Query Function Refactoring](#5-query-function-refactoring)
6. [Homepage Data Consolidation](#6-homepage-data-consolidation)
7. [Portable Text Renderer](#7-portable-text-renderer)
8. [Error Handling Patterns](#8-error-handling-patterns)
9. [Caching & Revalidation Strategy](#9-caching--revalidation-strategy)

---

## 1. Current Architecture Assessment

### 1.1 Client Setup

Two near-duplicate client files exist:

| File | Lines | Active? | Caching Strategy |
|------|-------|---------|------------------|
| `src/prismicio.ts` | 53 | **Yes** — all query files import from here | `{ next: { tags: ["prismic"], revalidate: 60 } }` for all environments |
| `src/cms/client.ts` | 52 | **No** — dead code, nothing imports it | Production: `force-cache` with tag; Dev: `revalidate: 60` |

Both use `@prismicio/client` with `enableAutoPreviews`. The route resolver only maps `tournament` → `/tournament/:uid`. The `page` and `policy` routes are commented out.

**Key insight:** `src/cms/client.ts` is dead code. All 11 query files import from `src/prismicio.ts`. The divergent caching strategies never applied in practice.

### 1.2 Query Layer Overview

**11 query files** in `src/cms/queries/` export **40 functions** across **944 lines of code**.

| File | Functions | Lines | Document Types |
|------|-----------|-------|----------------|
| `blog.ts` | 11 | 210 | `blog` |
| `team.ts` | 8 | 167 | `team`, `team_member` |
| `tournaments.ts` | 5 | 115 | `tournament` |
| `website.ts` | 3 | 128 | `website`, `broadcast_partners` |
| `navigation.ts` | 2 | 91 | `website` |
| `policies.ts` | 2 | 57 | `policy` |
| `sponsors.ts` | 2 | 45 | `sponsor` |
| `players.ts` | 2 | 44 | `player` |
| `match.ts` | 2 | 36 | `match` |
| `broadcast-partners.ts` | 2 | 26 | `broadcast_partners` |
| `social-contents.ts` | 1 | 25 | `image_with_text` |

### 1.3 Query Patterns

Every query function follows this pattern:

```typescript
export async function getSomething(param?: string) {
  const client = createClient();
  try {
    const result = await client.getAllByType("type", {
      orderings: [...],
      filters: [...],
    });
    return result;
  } catch (error) {
    // one of 3 inconsistent error handling patterns
  }
}
```

**No query reuses client instances** — each function creates a fresh client via `createClient()`.

### 1.4 Relationship Resolution

Relationship handling is the weakest part of the current architecture:

| Pattern | Usage | Problem |
|---------|-------|---------|
| **No resolution** | Most queries | Consumer gets raw content relationship references, must make separate calls |
| **`fetchLinks`** | Only `getTeamsByTournament()` (1 function) | Resolves 10 fields from linked tournament documents; limited to 1 level deep |
| **`graphQuery`** | Never used | Not utilized anywhere despite supporting deeper resolution |
| **Sequential N+1** | `getNavigationSettings()` | 9 sequential API calls (1 website + 8 broadcast partners by UID in a `for...of` loop) |
| **Client-side filtering** | 5 functions | Fetch ALL documents, filter in JavaScript |

### 1.5 Client-Side Filtering (Performance Issues)

These functions fetch the entire document collection and filter in JavaScript:

| Function | File | What It Fetches | Why |
|----------|------|-----------------|-----|
| `getTeamsByTournament(uid)` | `team.ts` | ALL teams | Tournament relationship is in a repeatable Group field; Prismic can't filter group-level references server-side |
| `getTournamentByOptaCompetitionId()` | `tournaments.ts` | ALL tournaments | Uses `.find()` to match Opta competition ID |
| `getMatchByOptaId()` | `match.ts` | ALL matches | Needs to normalize both sides of the Opta ID comparison |
| `getNavigationTournaments()` | `tournaments.ts` | ALL tournaments | Filters by `show_in_navigation === true` client-side (could be a Prismic predicate) |
| `getPoliciesForNav()` | `policies.ts` | ALL policies | Filters out `hide_from_nav` client-side (could be a Prismic predicate) |

### 1.6 Duplicate & Redundant Code

1. **`navigation.ts` vs `website.ts`:** Both export `getSiteSettings()`, `getFooterData()`, `FooterColumnData`, and `SiteSettings` with near-identical implementations. `website.ts` additionally has `getNavigationSettings()`. The footer imports from `website.ts`; `navigation.ts` may be partially dead code.

2. **`getSocialBlogsByCategory()`** is a character-for-character duplicate of `getBlogsByCategory()` in `blog.ts`.

3. **`src/cms/client.ts`** is entirely dead code — no query file imports from it.

4. **`social-contents.ts`** fetches `image_with_text` documents — the naming is misleading and the custom type appears unused in page rendering.

### 1.7 Error Handling (3 Inconsistent Patterns)

| Pattern | Where Used | Behavior |
|---------|-----------|----------|
| 404 status check | `getBlogBySlug`, `getPolicyBySlug`, `getTeamByUid`, both `getSiteSettings` | Checks `error.status === 404`, returns `null` |
| Message includes check | Most collection queries | Checks `error.message.includes("No documents were returned")`, returns `[]` or `null` |
| Silent `dev.log` | `team.ts`, `players.ts`, `sponsors.ts`, `broadcast-partners.ts` | Swallows ALL errors (not just 404/empty), returns `[]`/`null` |

### 1.8 Page Data Consumption Summary

Every page is an async React Server Component. No page uses `generateStaticParams` — all are ISR with 60s revalidation. No `loading.tsx` or `error.tsx` files exist in the `(website)` route group.

| Page | CMS Queries | Opta Calls | Complexity |
|------|-------------|------------|------------|
| Homepage (`/`) | `getTournaments`, `getLiveTournament`, `getTeamsByTournament` (×N), `getSocialBlogsByCategory`, `getAllNews` | `getF1Fixtures` (×N) | ~100 lines of data fetching, 10+ API calls |
| Tournament detail | `getTournamentByUid`, `getBlogsByTournament`, `getTeamsByTournament`, `getBroadcastPartnerByUid` (×8) | F1, F3, F30 (×N teams), F9 (×N matches) | Most data-intensive page |
| Match detail | `getTournamentByUid`, `getMatchBySlug`, `getTeamByOptaId` (×2), `getAllBroadcastPartners`, `getTeamsByTournament`, `getBlogsByMatch` | F1, F2, F3, F9, F13, F24, F40 | Second most complex |
| Club detail | `getTeamByUid`, `getTournamentByUid` (×N), `getTeamsByOptaIds`, `getBlogsByTeam` | F1, F3, F30, F40, F9 | Heavy Opta integration |
| News detail | `getBlogBySlug`, `getBlogsByCategory` or `getAllBlogs` | None | Moderate |
| News list | `getAllBlogs` | None | Simple |
| Leadership | `getPlayerAdvisoryCouncil`, `getCoFounders`, `getLeadershipTeam` | None | Simple |
| Resources | `getPolicyBySlug` | None | Simple |
| `[uid]` (catch-all) | `createClient().getByUID("page", uid)` — direct Prismic call, bypasses query layer | None | Simple (SliceZone) |
| Contact, FAQs, Checkout, Confirmation | None | None | Static or client-side only |

**Common duplication:** Tournament sub-pages (tickets, VIP, know-before-you-go, match) all repeat the same games-slider data-fetching pattern (`getF1Fixtures` + `getTeamsByTournament` + `fetchF9FeedsForMatches`) solely to populate the nav's game slider.

**Shared components making CMS calls:**
- `NavMain`: calls `getNavigationTournaments()`, `getMostRecentNews()`, `getNavigationSettings()` independently on every page render
- `FooterMain`: calls `getPoliciesForNav()`, `getFooterData()`, `getVisibleSponsors()` independently on every page render

### 1.9 Utility Layer

| File | Lines | Exports | Role |
|------|-------|---------|------|
| `src/cms/utils.ts` | 32 | `client`, `getImageUrl`, `getImageAlt`, `parseDate` | Image URL extraction, date parsing |
| `src/lib/utils.ts:242-254` | 13 | `mapBlogDocumentToMetadata` | Universal blog-to-UI-props transformer (used in 14 files) |
| `src/components/website-base/prismic-rich-text.tsx` | 57 | `PrismicRichTextComponent` | Rich text renderer mapping to typography components |

---

## 2. New Architecture Design

### 2.1 Data Flow Comparison

**Before (Prismic):**
```
Page Component
  → createClient() (new instance per function call)
  → client.getAllByType() / client.getByUID() (multiple calls)
  → Client-side filtering (JavaScript .filter()/.find())
  → Client-side relationship resolution (sequential API calls)
  → Props assembly
  → Component render
```

**After (Sanity):**
```
Page Component
  → sanityFetch({ query: GROQ, params }) (single call per data need)
  → Content Lake resolves filters + references server-side
  → Pre-shaped data returned via CDN
  → Component render
```

### 2.2 Key Architectural Changes

| Concern | Before (Prismic) | After (Sanity) |
|---------|------------------|----------------|
| Client instantiation | New client per function call via factory | Single `sanityFetch` from `defineLive` |
| Query language | REST predicates + `fetchLinks` | GROQ with inline reference resolution |
| Relationship resolution | 1 level via `fetchLinks`, or N+1 sequential calls | Arbitrary depth via `->` operator in GROQ |
| Filtering | 5 functions filter client-side | All filtering server-side in GROQ |
| Caching | ISR with `revalidate: 60` + `"prismic"` tag | `defineLive` with CDN + on-demand revalidation |
| Preview | `enableAutoPreviews` + `/api/preview` | Draft Mode + `SanityLive` + Visual Editing |
| Rich text | `PrismicRichText` with `@prismicio/react` | `PortableText` with `@portabletext/react` |
| Image URLs | Direct Prismic CDN URLs | `@sanity/image-url` builder with responsive transforms |
| Type safety | Generated `prismicio-types.d.ts` | GROQ result inference via `defineQuery` + `sanity typegen` |

### 2.3 Query File Structure (After)

The query abstraction layer (`src/cms/queries/`) is preserved but simplified. Each function becomes a thin wrapper around `sanityFetch`:

```
src/cms/queries/           # KEEP — same structure, new implementations
  tournaments.ts           # 4 functions (was 5, remove getTournamentByOptaCompetitionId → use GROQ filter)
  blog.ts                  # 7 functions (was 11, remove duplicates)
  team.ts                  # 6 functions (was 8, remove duplicates)
  navigation.ts            # DELETE — consolidated into website.ts
  website.ts               # 2 functions (was 3, simplified)
  policies.ts              # 2 functions (unchanged count)
  sponsors.ts              # 1 function (was 2, remove getAllSponsors if unused)
  broadcast-partners.ts    # 2 functions (unchanged count)
  match.ts                 # 2 functions (unchanged count)
  players.ts               # 2 functions (unchanged count)
  social-contents.ts       # DELETE — image_with_text type removed

src/sanity/lib/queries.ts  # NEW — all GROQ query definitions (defineQuery)
```

**Reduction:** 40 functions → ~28 functions. 944 lines → ~300 lines.

### 2.4 What Stays the Same

- **Opta integration** (`src/app/api/opta/`, `src/lib/opta/`, `src/types/opta-feeds/`) — completely unchanged
- **Component tree** — same components, only data source changes
- **Route structure** — same URL patterns and page files
- **Styling** — Tailwind CSS v4 + styled-components untouched
- **Third-party integrations** — Supabase, Klaviyo, Resend, Dolby unchanged
- **`mapBlogDocumentToMetadata()`** — updated to accept Sanity blog shape instead of Prismic `BlogDocument`

---

## 3. Sanity Client Setup

### 3.1 Environment Variables (`src/sanity/env.ts`)

```typescript
// src/sanity/env.ts

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Missing env: NEXT_PUBLIC_SANITY_PROJECT_ID"
)

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Missing env: NEXT_PUBLIC_SANITY_DATASET"
)

export const apiVersion = "2025-03-04"

export const studioUrl = "/studio"

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }
  return v
}
```

### 3.2 Sanity Client (`src/sanity/client.ts`)

```typescript
// src/sanity/client.ts

import { createClient } from "next-sanity"
import { projectId, dataset, apiVersion, studioUrl } from "./env"

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl },
})
```

**Notes:**
- `useCdn: true` — reads from Sanity's global CDN for production performance
- `stega: { studioUrl }` — enables stega encoding for Visual Editing (click-to-edit overlays in draft mode)
- Single client instance, reused everywhere via `defineLive`

### 3.3 Live Content API (`src/sanity/live.ts`)

```typescript
// src/sanity/live.ts

import { defineLive } from "next-sanity/live"
import { client } from "./client"

const token = process.env.SANITY_API_READ_TOKEN
if (!token) {
  throw new Error("Missing SANITY_API_READ_TOKEN")
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
  fetchOptions: {
    revalidate: 60, // time-based fallback; Live API handles on-demand
  },
})
```

**What `defineLive` provides:**

| Export | Type | Purpose |
|--------|------|---------|
| `sanityFetch` | `(options: { query, params? }) => Promise<{ data }>` | Server-side data fetching with automatic cache management |
| `SanityLive` | React Component | Client-side component that handles live content streaming and revalidation |

**How `sanityFetch` works:**
1. In production: fetches from Sanity CDN (`useCdn: true`), caches via Next.js Data Cache
2. In draft mode: bypasses CDN, fetches live drafts using `serverToken`
3. Automatic revalidation: `SanityLive` component listens for content changes and triggers `revalidateTag` on the relevant cache entries
4. The `serverToken` needs at least Viewer role permissions

### 3.4 Image URL Builder (`src/sanity/image.ts`)

```typescript
// src/sanity/image.ts

import imageUrlBuilder from "@sanity/image-url"
import { client } from "./client"

const builder = imageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}
```

**Usage in components:**
```tsx
import { urlFor } from "@/sanity/image"

// Basic usage
<Image src={urlFor(post.image).width(800).height(450).url()} alt="..." />

// With auto-format (WebP/AVIF when supported)
<Image src={urlFor(post.image).width(1200).auto("format").quality(80).url()} alt="..." />

// Responsive with hotspot-aware cropping
<Image src={urlFor(post.image).width(400).height(400).fit("crop").url()} alt="..." />
```

**Replaces:** `getImageUrl()` from `src/cms/utils.ts` and direct `image.url` access on Prismic image fields.

---

## 4. GROQ Query Definitions

All queries are defined in `src/sanity/lib/queries.ts` using `defineQuery` from `next-sanity`. This enables TypeScript type inference from GROQ result shapes (via `sanity typegen`).

### 4.1 Tournament Queries

#### `TOURNAMENTS_QUERY`

```groq
*[_type == "tournament"] | order(startDate desc) {
  _id, title, slug, status, featured, nickname,
  prizePool, countryCode, stadiumName, startDate, endDate,
  numberOfTeams, ticketsAvailable, heroImage,
  optaCompetitionId, optaSeasonId, optaEnabled,
  showInNavigation, navigationOrder, navImage, navigationDescription
}
```

- **Replaces:** `getTournaments()` in `tournaments.ts`
- **Parameters:** None
- **References resolved:** None (lightweight listing query)
- **Performance:** Explicit projection — returns only needed fields, no `...` spread

#### `TOURNAMENT_BY_SLUG_QUERY`

```groq
*[_type == "tournament" && slug.current == $slug][0]{
  ...,
  matches[]->{
    ...,
    homeTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
    awayTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
    broadcasts[]->
  },
  awards[]->{
    ...,
    playerTeam->{_id, name, slug, logo, colorPrimary}
  },
  recap->{title, slug, image, date, excerpt},
  "teams": *[_type == "team" && references(^._id)] | order(alphabeticalSortString asc) {
    ...,
    "players": *[_type == "player" && references(^._id)]
  }
}
```

- **Replaces:** `getTournamentByUid(uid)` in `tournaments.ts` + `getTeamsByTournament(uid)` in `team.ts` (for tournament detail page)
- **Parameters:** `$slug` (string)
- **References resolved:**
  - `matches[]->` — 1 level deep, with `homeTeam->` and `awayTeam->` (2 levels) and `broadcasts[]->` (2 levels)
  - `awards[]->` — 1 level deep, with `playerTeam->` (2 levels)
  - `recap->` — 1 level deep (projected)
  - `teams` — back-reference query via `references(^._id)`, with nested `players` back-reference (2 levels)
- **Performance:** Uses `...` on root tournament but explicit projections on nested references. The back-reference queries for teams and players are evaluated server-side by Sanity's Content Lake — orders of magnitude faster than the current "fetch ALL teams, filter in JS" approach.

#### `LIVE_TOURNAMENT_QUERY`

```groq
*[_type == "tournament" && status == "Live"][0]{
  ...,
  matches[]->{
    ...,
    homeTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
    awayTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
    broadcasts[]->
  },
  "teams": *[_type == "team" && references(^._id)] | order(alphabeticalSortString asc) {
    _id, name, slug, optaId, key, logo, colorPrimary, colorSecondary
  }
}
```

- **Replaces:** `getLiveTournament()` in `tournaments.ts`
- **Parameters:** None
- **References resolved:** Same as `TOURNAMENT_BY_SLUG_QUERY` but without awards/recap/players (not needed for live tournament display)
- **Performance:** Filter `status == "Live"` runs server-side. At most 1 document matches.

#### `NAV_TOURNAMENTS_QUERY`

```groq
*[_type == "tournament" && showInNavigation == true]
  | order(navigationOrder asc) {
  _id, title, slug, status, nickname, countryCode,
  startDate, endDate, navImage, navigationDescription,
  optaCompetitionId, optaSeasonId, optaEnabled
}
```

- **Replaces:** `getNavigationTournaments()` in `tournaments.ts`
- **Parameters:** None
- **References resolved:** None
- **Performance:** `showInNavigation == true` filter now runs server-side. Previously fetched ALL tournaments then filtered in JS.

#### `TOURNAMENT_BY_OPTA_ID_QUERY`

```groq
*[_type == "tournament" && optaCompetitionId == $competitionId
  && ($seasonId == null || optaSeasonId == $seasonId)][0]
```

- **Replaces:** `getTournamentByOptaCompetitionId(competitionId, seasonId?)` in `tournaments.ts`
- **Parameters:** `$competitionId` (string), `$seasonId` (string | null)
- **References resolved:** None
- **Performance:** Server-side filter replaces "fetch ALL tournaments, `.find()` in JS" pattern.

### 4.2 Blog / News Queries

#### `ALL_NEWS_QUERY`

```groq
*[_type == "blog" && category->slug.current != "press-releases"]
  | order(date desc) {
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}
```

- **Replaces:** `getAllNews()` in `blog.ts`
- **Parameters:** None
- **References resolved:** `category->` (1 level, projected to `_id`, `name`, `slug`)
- **Performance:** Category filter runs as a join in the Content Lake. Explicit projection reduces payload.

#### `ALL_BLOGS_QUERY`

```groq
*[_type == "blog"] | order(date desc) {
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}
```

- **Replaces:** `getAllBlogs()` in `blog.ts`
- **Parameters:** None
- **References resolved:** `category->` (1 level)
- **Performance:** No filter — returns all blog posts with resolved categories.

#### `BLOG_BY_SLUG_QUERY`

```groq
*[_type == "blog" && slug.current == $slug][0]{
  ...,
  category->,
  tournament->{title, slug},
  teams[]->{name, slug, logo, colorPrimary},
  matches[]->{_id, optaId},
  sections[]{
    ...,
    _type == "newsList" => {
      ...,
      category->,
      manualPosts[]->{
        _id, title, slug, image, date, excerpt,
        category->{_id, name, slug}
      }
    }
  }
}
```

- **Replaces:** `getBlogBySlug(uid)` in `blog.ts`
- **Parameters:** `$slug` (string)
- **References resolved:**
  - `category->` — full document (1 level)
  - `tournament->` — projected (1 level)
  - `teams[]->` — projected (1 level)
  - `matches[]->` — projected (1 level)
  - `sections[].newsList.category->` — conditional resolution (2 levels)
  - `sections[].newsList.manualPosts[]->` — with nested `category->` (3 levels)
- **Performance:** Single query replaces separate blog fetch + potential section data fetches.

#### `BLOGS_BY_CATEGORY_QUERY`

```groq
*[_type == "blog" && category->slug.current == $categorySlug]
  | order(date desc) {
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}
```

- **Replaces:** `getBlogsByCategory(category)` AND `getSocialBlogsByCategory(category)` in `blog.ts` (eliminates duplicate)
- **Parameters:** `$categorySlug` (string) — uses slug instead of display name for stability
- **References resolved:** `category->` (1 level)
- **Performance:** Category filtering via slug join is more stable than string matching on display names.

#### `BLOGS_BY_TOURNAMENT_QUERY`

```groq
*[_type == "blog" && tournament._ref == $tournamentId]
  | order(date desc) {
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}
```

- **Replaces:** `getBlogsByTournament(tournamentId)` in `blog.ts`
- **Parameters:** `$tournamentId` (string — Sanity document `_id`)
- **References resolved:** `category->` (1 level)

#### `BLOGS_BY_TEAM_QUERY`

```groq
*[_type == "blog" && $teamId in teams[]._ref]
  | order(date desc) {
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}
```

- **Replaces:** `getBlogsByTeam(teamId)` in `blog.ts`
- **Parameters:** `$teamId` (string)
- **References resolved:** `category->` (1 level)

#### `BLOGS_BY_MATCH_QUERY`

```groq
*[_type == "blog" && $matchId in matches[]._ref]
  | order(date desc) {
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}
```

- **Replaces:** `getBlogsByMatch(matchId)` in `blog.ts`
- **Parameters:** `$matchId` (string)
- **References resolved:** `category->` (1 level)

#### `MOST_RECENT_NEWS_QUERY`

```groq
*[_type == "blog" && category->slug.current != "press-releases"]
  | order(date desc) [0] {
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}
```

- **Replaces:** `getMostRecentNews()` in `blog.ts`
- **Parameters:** None
- **References resolved:** `category->` (1 level)
- **Performance:** `[0]` slice after ordering returns only 1 document. Much more efficient than the current `getAllByType` with `limit: 1`.

### 4.3 Team Queries

#### `TEAMS_BY_TOURNAMENT_QUERY`

```groq
*[_type == "team" && references($tournamentId)]
  | order(alphabeticalSortString asc) {
  ...,
  tournaments[]->{_id, title, slug}
}
```

- **Replaces:** `getTeamsByTournament(tournamentUID)` in `team.ts`
- **Parameters:** `$tournamentId` (string — Sanity document `_id`)
- **References resolved:** `tournaments[]->` (1 level, projected)
- **Performance:** `references($tournamentId)` is a server-side index lookup. Replaces the "fetch ALL teams, filter in JS" pattern — the single biggest performance improvement in the migration.

#### `TEAM_BY_SLUG_QUERY`

```groq
*[_type == "team" && slug.current == $slug][0]{
  ...,
  tournaments[]->{
    _id, title, slug, status, nickname, countryCode,
    startDate, endDate, optaCompetitionId, optaSeasonId, optaEnabled,
    featured, heroImage
  }
}
```

- **Replaces:** `getTeamByUid(uid)` in `team.ts`
- **Parameters:** `$slug` (string)
- **References resolved:** `tournaments[]->` (1 level, projected with fields needed by club page)

#### `TEAM_BY_OPTA_ID_QUERY`

```groq
*[_type == "team" && optaId == $optaId][0]
```

- **Replaces:** `getTeamByOptaId(optaId)` in `team.ts`
- **Parameters:** `$optaId` (string)
- **References resolved:** None

#### `TEAMS_BY_OPTA_IDS_QUERY`

```groq
*[_type == "team" && optaId in $optaIds] {
  ...,
  tournaments[]->{_id, title, slug}
}
```

- **Replaces:** `getTeamsByOptaIds(optaIds)` in `team.ts`
- **Parameters:** `$optaIds` (string[])
- **References resolved:** `tournaments[]->` (1 level)
- **Performance:** `in` operator handles array membership server-side.

### 4.4 Team Member Queries

#### `TEAM_MEMBERS_BY_DEPARTMENT_QUERY`

```groq
*[_type == "teamMember" && department == $department]
  | order(displayOrder asc, name asc) {
  _id, name, slug, role, headshot, bio, displayOrder, department
}
```

- **Replaces:** `getTeamMembersByDepartment(department)` in `team.ts`, and its wrappers `getPlayerAdvisoryCouncil()`, `getCoFounders()`, `getLeadershipTeam()`
- **Parameters:** `$department` (string — "Player Advisor", "Co-Founder", or "Leadership Team")
- **References resolved:** None

### 4.5 Match Queries

#### `MATCH_BY_SLUG_QUERY`

```groq
*[_type == "match" && slug.current == $slug][0]{
  ...,
  tournament->{_id, title, slug, optaCompetitionId, optaSeasonId},
  homeTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
  awayTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
  broadcasts[]->,
  sections[]
}
```

- **Replaces:** `getMatchBySlug(slug)` in `match.ts`
- **Parameters:** `$slug` (string)
- **References resolved:**
  - `tournament->` — projected (1 level)
  - `homeTeam->` / `awayTeam->` — projected (1 level)
  - `broadcasts[]->` — full document (1 level)
- **Performance:** Single query resolves the match AND its related tournament, teams, and broadcasters. Currently requires 4+ separate calls.

#### `MATCH_BY_OPTA_ID_QUERY`

```groq
*[_type == "match" && optaId == $optaId][0]{
  ...,
  tournament->{_id, slug, optaCompetitionId, optaSeasonId},
  homeTeam->,
  awayTeam->
}
```

- **Replaces:** `getMatchByOptaId(optaId)` in `match.ts`
- **Parameters:** `$optaId` (string)
- **Performance:** Server-side filter replaces "fetch ALL matches, `.find()` in JS" pattern. Opta ID normalization should happen before the query call.

### 4.6 Navigation & Settings Queries

#### `SITE_SETTINGS_QUERY`

```groq
*[_type == "siteSettings" && _id == "siteSettings"][0]{
  moreInfoMode,
  whereToWatchPartners[]->{
    _id, name, logo, logoWhite, iconLogo, logoOnPrimary,
    colorPrimary, colorSecondary, streamingLink
  },
  footerMenus
}
```

- **Replaces:** `getSiteSettings()` in `website.ts` AND `navigation.ts`, `getFooterData()`, AND `getNavigationSettings()` — consolidates 3 functions + 9 sequential API calls into 1 GROQ query
- **Parameters:** None
- **References resolved:** `whereToWatchPartners[]->` — full broadcast partner documents (1 level)
- **Performance:** Single query replaces 9 sequential API calls (1 website singleton + 8 hardcoded `getByUID` broadcast partner calls in a `for...of` loop). This is the second biggest performance improvement.

### 4.7 Policy Queries

#### `POLICY_BY_SLUG_QUERY`

```groq
*[_type == "policy" && slug.current == $slug][0]
```

- **Replaces:** `getPolicyBySlug(uid)` in `policies.ts`
- **Parameters:** `$slug` (string)

#### `POLICIES_NAV_QUERY`

```groq
*[_type == "policy" && hideFromNav != true]
  | order(navOrder asc) {
  _id, name, slug, pdf
}
```

- **Replaces:** `getPoliciesForNav()` in `policies.ts`
- **Parameters:** None
- **Performance:** `hideFromNav != true` filter now runs server-side (was client-side).

### 4.8 Sponsor & Partner Queries

#### `SPONSORS_QUERY`

```groq
*[_type == "sponsor" && visibility == true]
  | order(sortOrder asc) {
  _id, name, slug, logo, websiteLink
}
```

- **Replaces:** `getVisibleSponsors()` in `sponsors.ts`
- **Parameters:** None

#### `BROADCAST_PARTNERS_QUERY`

```groq
*[_type == "broadcastPartner"] {
  _id, name, logo, logoWhite, iconLogo, logoOnPrimary,
  colorPrimary, colorSecondary, streamingLink
}
```

- **Replaces:** `getAllBroadcastPartners()` in `broadcast-partners.ts`
- **Parameters:** None

#### `BROADCAST_PARTNER_BY_SLUG_QUERY`

```groq
*[_type == "broadcastPartner" && slug.current == $slug][0]
```

- **Replaces:** `getBroadcastPartnerByUid(uid)` in `broadcast-partners.ts`
- **Parameters:** `$slug` (string)

### 4.9 Player Queries

#### `PLAYER_BY_OPTA_ID_QUERY`

```groq
*[_type == "player" && optaId == $optaId][0]
```

- **Replaces:** `getPlayerByOptaId(optaId)` in `players.ts`
- **Parameters:** `$optaId` (string)
- **Note:** Opta ID normalization should happen before passing to the query.

#### `PLAYERS_BY_OPTA_IDS_QUERY`

```groq
*[_type == "player" && optaId in $optaIds]
```

- **Replaces:** `getPlayersByOptaIds(optaIds)` in `players.ts`
- **Parameters:** `$optaIds` (string[])

### 4.10 Page Query

#### `PAGE_BY_SLUG_QUERY`

```groq
*[_type == "page" && slug.current == $slug][0]{
  title,
  sections[]{
    ...,
    _type == "newsList" => {
      ...,
      category->,
      manualPosts[]->{
        _id, title, slug, image, date, excerpt,
        category->{_id, name, slug}
      }
    },
    _type == "imageWithText" => {
      ...,
      // description is portableText — returned as-is
    }
  },
  seo
}
```

- **Replaces:** `createClient().getByUID("page", uid)` in `[uid]/page.tsx`
- **Parameters:** `$slug` (string)
- **References resolved:** Conditional reference resolution within sections — only `newsList` sections need their `category` and `manualPosts` references resolved.
- **Performance:** Single query with inline reference resolution. No separate calls for section data.

### 4.11 Complete Query File

```typescript
// src/sanity/lib/queries.ts

import { defineQuery } from "next-sanity"

// ─── Shared Projections ────────────────────────────────────────────

const teamCardProjection = `{
  _id, name, slug, optaId, key, logo, colorPrimary, colorSecondary
}`

const blogCardProjection = `{
  _id, title, slug, image, date, author, excerpt,
  category->{_id, name, slug}
}`

const matchProjection = `{
  ...,
  homeTeam->${teamCardProjection},
  awayTeam->${teamCardProjection},
  broadcasts[]->
}`

const sectionProjection = `{
  ...,
  _type == "newsList" => {
    ...,
    category->,
    manualPosts[]->${blogCardProjection}
  }
}`

// ─── Tournaments ───────────────────────────────────────────────────

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
    matches[]->${matchProjection},
    awards[]->{
      ...,
      playerTeam->${teamCardProjection}
    },
    recap->{title, slug, image, date, excerpt},
    "teams": *[_type == "team" && references(^._id)]
      | order(alphabeticalSortString asc) {
      ...,
      "players": *[_type == "player" && references(^._id)]
    },
    sections[]${sectionProjection}
  }
`)

export const LIVE_TOURNAMENT_QUERY = defineQuery(`
  *[_type == "tournament" && status == "Live"][0]{
    ...,
    matches[]->${matchProjection},
    "teams": *[_type == "team" && references(^._id)]
      | order(alphabeticalSortString asc) ${teamCardProjection}
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

export const TOURNAMENT_BY_OPTA_ID_QUERY = defineQuery(`
  *[_type == "tournament"
    && optaCompetitionId == $competitionId
    && ($seasonId == null || optaSeasonId == $seasonId)
  ][0]
`)

// ─── Blog / News ───────────────────────────────────────────────────

export const ALL_NEWS_QUERY = defineQuery(`
  *[_type == "blog" && category->slug.current != "press-releases"]
    | order(date desc) ${blogCardProjection}
`)

export const ALL_BLOGS_QUERY = defineQuery(`
  *[_type == "blog"] | order(date desc) ${blogCardProjection}
`)

export const BLOG_BY_SLUG_QUERY = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    ...,
    category->,
    tournament->{title, slug},
    teams[]->${teamCardProjection},
    matches[]->{_id, optaId},
    sections[]${sectionProjection}
  }
`)

export const BLOGS_BY_CATEGORY_QUERY = defineQuery(`
  *[_type == "blog" && category->slug.current == $categorySlug]
    | order(date desc) ${blogCardProjection}
`)

export const BLOGS_BY_TOURNAMENT_QUERY = defineQuery(`
  *[_type == "blog" && tournament._ref == $tournamentId]
    | order(date desc) ${blogCardProjection}
`)

export const BLOGS_BY_TEAM_QUERY = defineQuery(`
  *[_type == "blog" && $teamId in teams[]._ref]
    | order(date desc) ${blogCardProjection}
`)

export const BLOGS_BY_MATCH_QUERY = defineQuery(`
  *[_type == "blog" && $matchId in matches[]._ref]
    | order(date desc) ${blogCardProjection}
`)

export const MOST_RECENT_NEWS_QUERY = defineQuery(`
  *[_type == "blog" && category->slug.current != "press-releases"]
    | order(date desc) [0] ${blogCardProjection}
`)

// ─── Teams ─────────────────────────────────────────────────────────

export const TEAMS_BY_TOURNAMENT_QUERY = defineQuery(`
  *[_type == "team" && references($tournamentId)]
    | order(alphabeticalSortString asc) {
    ...,
    tournaments[]->{_id, title, slug}
  }
`)

export const TEAM_BY_SLUG_QUERY = defineQuery(`
  *[_type == "team" && slug.current == $slug][0]{
    ...,
    tournaments[]->{
      _id, title, slug, status, nickname, countryCode,
      startDate, endDate, optaCompetitionId, optaSeasonId, optaEnabled,
      featured, heroImage
    }
  }
`)

export const TEAM_BY_OPTA_ID_QUERY = defineQuery(`
  *[_type == "team" && optaId == $optaId][0]
`)

export const TEAMS_BY_OPTA_IDS_QUERY = defineQuery(`
  *[_type == "team" && optaId in $optaIds] {
    ...,
    tournaments[]->{_id, title, slug}
  }
`)

// ─── Team Members ──────────────────────────────────────────────────

export const TEAM_MEMBERS_BY_DEPARTMENT_QUERY = defineQuery(`
  *[_type == "teamMember" && department == $department]
    | order(displayOrder asc, name asc) {
    _id, name, slug, role, headshot, bio, displayOrder, department
  }
`)

// ─── Matches ───────────────────────────────────────────────────────

export const MATCH_BY_SLUG_QUERY = defineQuery(`
  *[_type == "match" && slug.current == $slug][0]{
    ...,
    tournament->{_id, title, slug, optaCompetitionId, optaSeasonId},
    homeTeam->${teamCardProjection},
    awayTeam->${teamCardProjection},
    broadcasts[]->,
    sections[]${sectionProjection}
  }
`)

export const MATCH_BY_OPTA_ID_QUERY = defineQuery(`
  *[_type == "match" && optaId == $optaId][0]{
    ...,
    tournament->{_id, slug, optaCompetitionId, optaSeasonId},
    homeTeam->${teamCardProjection},
    awayTeam->${teamCardProjection}
  }
`)

// ─── Navigation & Settings ─────────────────────────────────────────

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    moreInfoMode,
    whereToWatchPartners[]->{
      _id, name, logo, logoWhite, iconLogo, logoOnPrimary,
      colorPrimary, colorSecondary, streamingLink
    },
    footerMenus
  }
`)

// ─── Policies ──────────────────────────────────────────────────────

export const POLICY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "policy" && slug.current == $slug][0]
`)

export const POLICIES_NAV_QUERY = defineQuery(`
  *[_type == "policy" && hideFromNav != true]
    | order(navOrder asc) {
    _id, name, slug, pdf
  }
`)

// ─── Sponsors & Partners ───────────────────────────────────────────

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

export const BROADCAST_PARTNER_BY_SLUG_QUERY = defineQuery(`
  *[_type == "broadcastPartner" && slug.current == $slug][0]
`)

// ─── Players ───────────────────────────────────────────────────────

export const PLAYER_BY_OPTA_ID_QUERY = defineQuery(`
  *[_type == "player" && optaId == $optaId][0]
`)

export const PLAYERS_BY_OPTA_IDS_QUERY = defineQuery(`
  *[_type == "player" && optaId in $optaIds]
`)

// ─── Pages ─────────────────────────────────────────────────────────

export const PAGE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    title,
    sections[]${sectionProjection},
    seo
  }
`)
```

### 4.12 Query Count Comparison

| Category | Before (Prismic) | After (Sanity) | Notes |
|----------|-----------------|----------------|-------|
| Tournaments | 5 functions | 5 queries | Added `TOURNAMENT_BY_OPTA_ID_QUERY` (server-side filter) |
| Blog/News | 11 functions | 8 queries | Removed 3 duplicates |
| Teams | 4 functions | 4 queries | Unchanged count |
| Team Members | 4 functions | 1 query | Consolidated department wrappers |
| Matches | 2 functions | 2 queries | Unchanged |
| Navigation/Settings | 5 functions (across 2 files) | 1 query | Consolidated into `SITE_SETTINGS_QUERY` |
| Policies | 2 functions | 2 queries | Unchanged |
| Sponsors | 2 functions | 1 query | Removed unused `getAllSponsors` |
| Partners | 2 functions | 2 queries | Unchanged |
| Players | 2 functions | 2 queries | Unchanged |
| Social/Image | 1 function | 0 queries | Removed (dead content type) |
| Pages | 1 direct call | 1 query | Formalized |
| **Total** | **40 functions** | **29 queries** | **28% reduction** |

---

## 5. Query Function Refactoring

### 5.1 Pattern: Before vs After

Every query function transforms from this:

```typescript
// BEFORE (Prismic) — src/cms/queries/example.ts
import * as prismic from "@prismicio/client"
import { createClient } from "../../prismicio"

export async function getThingBySlug(slug: string) {
  const client = createClient()
  try {
    const thing = await client.getByUID("thing", slug)
    return thing
  } catch (error) {
    if (error instanceof Error && "status" in error &&
        (error as { status: number }).status === 404) {
      return null
    }
    throw error
  }
}
```

To this:

```typescript
// AFTER (Sanity) — src/cms/queries/example.ts
import { sanityFetch } from "@/sanity/live"
import { THING_BY_SLUG_QUERY } from "@/sanity/lib/queries"

export async function getThingBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: THING_BY_SLUG_QUERY,
    params: { slug },
  })
  return data // null if not found (GROQ returns null for [0] on empty set)
}
```

**Key simplifications:**
1. No `try/catch` — GROQ returns `null` for missing documents, never throws 404
2. No `createClient()` — `sanityFetch` is a singleton from `defineLive`
3. No `fetchLinks` — references resolved inline in the GROQ query
4. No client-side filtering — all filtering in GROQ

### 5.2 Tournaments (`src/cms/queries/tournaments.ts`)

```typescript
// src/cms/queries/tournaments.ts — AFTER

import { sanityFetch } from "@/sanity/live"
import {
  TOURNAMENTS_QUERY,
  TOURNAMENT_BY_SLUG_QUERY,
  LIVE_TOURNAMENT_QUERY,
  NAV_TOURNAMENTS_QUERY,
  TOURNAMENT_BY_OPTA_ID_QUERY,
} from "@/sanity/lib/queries"

export async function getTournaments() {
  const { data } = await sanityFetch({ query: TOURNAMENTS_QUERY })
  return data ?? []
}

export async function getTournamentBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: TOURNAMENT_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

export async function getLiveTournament() {
  const { data } = await sanityFetch({ query: LIVE_TOURNAMENT_QUERY })
  return data
}

export async function getNavigationTournaments() {
  const { data } = await sanityFetch({ query: NAV_TOURNAMENTS_QUERY })
  return data ?? []
}

export async function getTournamentByOptaId(
  competitionId: string,
  seasonId?: string
) {
  const { data } = await sanityFetch({
    query: TOURNAMENT_BY_OPTA_ID_QUERY,
    params: { competitionId, seasonId: seasonId ?? null },
  })
  return data
}
```

**Changes from current:**
- `getTournamentByUid(uid)` → `getTournamentBySlug(slug)` (Sanity uses slugs, not UIDs)
- `getTournamentByOptaCompetitionId()` → `getTournamentByOptaId()` (server-side filter replaces client-side `.find()`)
- `getNavigationTournaments()` no longer fetches all tournaments — server-side `showInNavigation == true` filter
- `getTournamentBySlug()` now returns teams, matches, awards, and recap inline (no separate `getTeamsByTournament` call needed for tournament detail page)

### 5.3 Blog / News (`src/cms/queries/blog.ts`)

```typescript
// src/cms/queries/blog.ts — AFTER

import { sanityFetch } from "@/sanity/live"
import {
  ALL_NEWS_QUERY,
  ALL_BLOGS_QUERY,
  BLOG_BY_SLUG_QUERY,
  BLOGS_BY_CATEGORY_QUERY,
  BLOGS_BY_TOURNAMENT_QUERY,
  BLOGS_BY_TEAM_QUERY,
  BLOGS_BY_MATCH_QUERY,
  MOST_RECENT_NEWS_QUERY,
} from "@/sanity/lib/queries"

export async function getAllNews() {
  const { data } = await sanityFetch({ query: ALL_NEWS_QUERY })
  return data ?? []
}

export async function getAllBlogs() {
  const { data } = await sanityFetch({ query: ALL_BLOGS_QUERY })
  return data ?? []
}

export async function getBlogBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: BLOG_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

export async function getBlogsByCategory(categorySlug: string) {
  const { data } = await sanityFetch({
    query: BLOGS_BY_CATEGORY_QUERY,
    params: { categorySlug },
  })
  return data ?? []
}

export async function getBlogsByTournament(tournamentId: string) {
  const { data } = await sanityFetch({
    query: BLOGS_BY_TOURNAMENT_QUERY,
    params: { tournamentId },
  })
  return data ?? []
}

export async function getBlogsByTeam(teamId: string) {
  const { data } = await sanityFetch({
    query: BLOGS_BY_TEAM_QUERY,
    params: { teamId },
  })
  return data ?? []
}

export async function getBlogsByMatch(matchId: string) {
  const { data } = await sanityFetch({
    query: BLOGS_BY_MATCH_QUERY,
    params: { matchId },
  })
  return data ?? []
}

export async function getMostRecentNews() {
  const { data } = await sanityFetch({ query: MOST_RECENT_NEWS_QUERY })
  return data
}
```

**Removed functions:**
- `getSocialBlogsByCategory()` — was identical to `getBlogsByCategory()`. Callers update to use `getBlogsByCategory("tournament-recap")` (slug-based)
- `getMostRecentBlog()` — unused
- `getSocialBlogs()` — unused wrapper

**Breaking change:** `getBlogsByCategory()` now takes a **category slug** (e.g., `"tournament-recap"`) instead of a display name (e.g., `"Tournament Recap"`). All callers must update.

### 5.4 Teams (`src/cms/queries/team.ts`)

```typescript
// src/cms/queries/team.ts — AFTER

import { sanityFetch } from "@/sanity/live"
import {
  TEAMS_BY_TOURNAMENT_QUERY,
  TEAM_BY_SLUG_QUERY,
  TEAM_BY_OPTA_ID_QUERY,
  TEAMS_BY_OPTA_IDS_QUERY,
  TEAM_MEMBERS_BY_DEPARTMENT_QUERY,
} from "@/sanity/lib/queries"

export async function getTeamsByTournament(tournamentId: string) {
  const { data } = await sanityFetch({
    query: TEAMS_BY_TOURNAMENT_QUERY,
    params: { tournamentId },
  })
  return data ?? []
}

export async function getTeamBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: TEAM_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

export async function getTeamByOptaId(optaId: string) {
  const { data } = await sanityFetch({
    query: TEAM_BY_OPTA_ID_QUERY,
    params: { optaId },
  })
  return data
}

export async function getTeamsByOptaIds(optaIds: string[]) {
  const { data } = await sanityFetch({
    query: TEAMS_BY_OPTA_IDS_QUERY,
    params: { optaIds },
  })
  return data ?? []
}

export async function getTeamMembersByDepartment(department: string) {
  const { data } = await sanityFetch({
    query: TEAM_MEMBERS_BY_DEPARTMENT_QUERY,
    params: { department },
  })
  return data ?? []
}

export async function getPlayerAdvisoryCouncil() {
  return getTeamMembersByDepartment("Player Advisor")
}

export async function getCoFounders() {
  return getTeamMembersByDepartment("Co-Founder")
}

export async function getLeadershipTeam() {
  return getTeamMembersByDepartment("Leadership Team")
}
```

**Changes from current:**
- `getTeamByUid(uid)` → `getTeamBySlug(slug)`
- `getTeamsByTournament(tournamentUID)` → `getTeamsByTournament(tournamentId)` — takes Sanity `_id` instead of UID; uses `references()` server-side filter instead of client-side filtering
- `getAllTeamMembers()` removed (unused — callers always filter by department)

### 5.5 Matches (`src/cms/queries/match.ts`)

```typescript
// src/cms/queries/match.ts — AFTER

import { sanityFetch } from "@/sanity/live"
import {
  MATCH_BY_SLUG_QUERY,
  MATCH_BY_OPTA_ID_QUERY,
} from "@/sanity/lib/queries"

export async function getMatchBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: MATCH_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

export async function getMatchByOptaId(optaId: string) {
  const { data } = await sanityFetch({
    query: MATCH_BY_OPTA_ID_QUERY,
    params: { optaId },
  })
  return data
}
```

**Changes:** `getMatchByOptaId()` now uses server-side filter. Opta ID normalization must happen in the caller before passing to this function.

### 5.6 Navigation & Settings (`src/cms/queries/website.ts`)

```typescript
// src/cms/queries/website.ts — AFTER

import { sanityFetch } from "@/sanity/live"
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries"

export type SiteSettings = {
  moreInfoMode: string | null
  whereToWatchPartners: Array<{
    _id: string
    name: string
    logo: any
    logoWhite: any
    iconLogo: any
    logoOnPrimary: any
    colorPrimary: string
    colorSecondary: string
    streamingLink: string
  }>
  footerMenus: Array<{
    menuTitle: string
    links: Array<{
      linkText: string
      linkUrl: string
      isExternal: boolean
    }>
  }>
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY })
  return data
}

// Convenience aliases for backwards compatibility
export const getFooterData = getSiteSettings
export const getNavigationSettings = getSiteSettings
```

**`src/cms/queries/navigation.ts` is deleted.** All functionality consolidated into `website.ts`.

**Changes:**
- `getNavigationSettings()` no longer makes 9 sequential API calls — broadcast partners are resolved inline via GROQ `whereToWatchPartners[]->` reference resolution
- The `FooterColumnData` type is simplified — Sanity's `footerMenus` structure already matches the needed shape (no `transformWebsiteData()` needed)

### 5.7 Policies (`src/cms/queries/policies.ts`)

```typescript
// src/cms/queries/policies.ts — AFTER

import { sanityFetch } from "@/sanity/live"
import {
  POLICY_BY_SLUG_QUERY,
  POLICIES_NAV_QUERY,
} from "@/sanity/lib/queries"

export async function getPolicyBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: POLICY_BY_SLUG_QUERY,
    params: { slug },
  })
  return data
}

export async function getPoliciesForNav() {
  const { data } = await sanityFetch({ query: POLICIES_NAV_QUERY })
  return data ?? []
}
```

**Changes:** `getPoliciesForNav()` no longer needs the client-side `filter` + `map` transformation. GROQ handles the `hideFromNav` filter and field projection server-side.

### 5.8 Sponsors, Partners, Players

These follow the same trivial pattern — replace `createClient()` + `getAllByType()` with `sanityFetch()`. See the tournament/blog examples above for the pattern.

### 5.9 Files Deleted

| File | Reason |
|------|--------|
| `src/cms/queries/navigation.ts` | Consolidated into `website.ts` |
| `src/cms/queries/social-contents.ts` | `image_with_text` document type removed |
| `src/prismicio.ts` | Replaced by `src/sanity/live.ts` |
| `src/cms/client.ts` | Dead code (was already unused) |
| `src/cms/utils.ts` | Replaced by `src/sanity/image.ts` + inline usage |

### 5.10 `mapBlogDocumentToMetadata` Update

```typescript
// src/lib/utils.ts — updated for Sanity blog shape

export type BlogMetadata = {
  slug: string
  title: string
  excerpt: string | null
  image: any // Sanity image object (use urlFor() in components)
  category: { _id: string; name: string; slug: { current: string } } | null
  author: string | null
  date: string | null
}

export function mapBlogToMetadata(blog: any): BlogMetadata {
  return {
    slug: blog.slug?.current ?? "",
    title: blog.title ?? "Untitled",
    excerpt: blog.excerpt ?? null,
    image: blog.image ?? null,
    category: blog.category ?? null,
    author: blog.author ?? null,
    date: blog.date ?? null,
  }
}
```

**Changes:**
- Renamed from `mapBlogDocumentToMetadata` to `mapBlogToMetadata` (no longer wrapping a Prismic `Document`)
- `image` is now a Sanity image object (consumed via `urlFor(blog.image)`) instead of a URL string
- `category` is now a resolved reference object `{ _id, name, slug }` instead of a string
- `publicationDate` and `createdDate` removed — Sanity's `_createdAt` and `_updatedAt` are available directly on the document if needed
- All 14 files that import this function must update their import name and handle the new `category` shape

---

## 6. Homepage Data Consolidation

### 6.1 Current State: 10+ API Calls

The homepage (`src/app/(website)/(home)/page.tsx`) currently orchestrates ~100 lines of data fetching:

1. `getTournaments()` — all tournaments
2. `getLiveTournament()` — filtered for status "Live"
3. For each complete tournament:
   - `getF1Fixtures(competitionId, seasonId)` — Opta fixtures
   - `getTeamsByTournament(tournament.uid)` — all teams (fetches ALL teams, filters client-side)
4. `getSocialBlogsByCategory("Tournament Recap")` — recap blogs
5. `getAllNews()` — all non-press-release blogs
6. Additional `fetchClubListData()` calls for team grids

The total is **10-15+ API calls** depending on the number of tournaments, plus Opta feed calls.

### 6.2 New State: 1 GROQ Query + Opta Calls

```groq
// HOMEPAGE_QUERY
{
  "tournaments": *[_type == "tournament"] | order(startDate desc) {
    _id, title, slug, status, featured, nickname,
    prizePool, countryCode, stadiumName, startDate, endDate,
    numberOfTeams, ticketsAvailable, heroImage,
    optaCompetitionId, optaSeasonId, optaEnabled,
    navigationOrder,
    recap->{title, slug, image, date, excerpt},
    awards[]->{
      ...,
      playerTeam->{_id, name, slug, logo, colorPrimary}
    },
    "teams": *[_type == "team" && references(^._id)]
      | order(alphabeticalSortString asc) {
      _id, name, slug, optaId, key, logo, colorPrimary, colorSecondary,
      country, countryCode, alphabeticalSortString
    }
  },
  "liveTournament": *[_type == "tournament" && status == "Live"][0]{
    ...,
    matches[]->{
      ...,
      homeTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
      awayTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
      broadcasts[]->
    },
    "teams": *[_type == "team" && references(^._id)]
      | order(alphabeticalSortString asc) {
      _id, name, slug, optaId, key, logo, colorPrimary, colorSecondary
    }
  },
  "recentNews": *[_type == "blog"
    && category->slug.current != "press-releases"]
    | order(date desc) [0...4] {
    _id, title, slug, image, date, author, excerpt,
    category->{_id, name, slug}
  },
  "recapBlogs": *[_type == "blog"
    && category->slug.current == "tournament-recap"]
    | order(date desc) [0...3] {
    _id, title, slug, image, date, excerpt,
    category->{_id, name, slug}
  }
}
```

### 6.3 Detailed Walkthrough

This single GROQ query uses Sanity's **compound query** syntax (`{ "key1": query1, "key2": query2 }`) to fetch four related datasets in one API call:

**1. `tournaments`:** All tournaments with their teams, recap blog, and awards resolved inline.
- `recap->` resolves the recap blog reference to return title, slug, image (1 join)
- `awards[]->` resolves the awards array, with `playerTeam->` resolving the team reference on each award (2-level join)
- `"teams": *[_type == "team" && references(^._id)]` is a back-reference query — finds all team documents that reference this tournament's `_id` in their `tournaments[]` array. This replaces `getTeamsByTournament()` entirely.

**2. `liveTournament`:** The single live tournament with matches and teams.
- `matches[]->` resolves the matches array, with `homeTeam->` and `awayTeam->` (2-level join)
- Teams resolved via back-reference (same as above)

**3. `recentNews`:** Latest 4 non-press-release blog posts with resolved categories.
- `[0...4]` is GROQ's slice syntax (exclusive end) — returns exactly 4 items
- `category->` resolves the category reference inline

**4. `recapBlogs`:** Latest 3 tournament recap blogs.
- Filtered by category slug join (`category->slug.current == "tournament-recap"`)

### 6.4 Homepage Data Fetching (After)

```typescript
// src/app/(website)/(home)/page.tsx — AFTER (simplified)

import { sanityFetch } from "@/sanity/live"
import { defineQuery } from "next-sanity"

const HOMEPAGE_QUERY = defineQuery(`{
  "tournaments": *[_type == "tournament"] | order(startDate desc) {
    _id, title, slug, status, featured, nickname,
    prizePool, countryCode, stadiumName, startDate, endDate,
    numberOfTeams, ticketsAvailable, heroImage,
    optaCompetitionId, optaSeasonId, optaEnabled,
    navigationOrder,
    recap->{title, slug, image, date, excerpt},
    awards[]->{..., playerTeam->{_id, name, slug, logo, colorPrimary}},
    "teams": *[_type == "team" && references(^._id)]
      | order(alphabeticalSortString asc) {
      _id, name, slug, optaId, key, logo, colorPrimary, colorSecondary,
      country, countryCode, alphabeticalSortString
    }
  },
  "liveTournament": *[_type == "tournament" && status == "Live"][0]{
    ...,
    matches[]->{
      ...,
      homeTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
      awayTeam->{_id, name, slug, optaId, key, logo, colorPrimary, colorSecondary},
      broadcasts[]->
    },
    "teams": *[_type == "team" && references(^._id)] {
      _id, name, slug, optaId, key, logo, colorPrimary, colorSecondary
    }
  },
  "recentNews": *[_type == "blog" && category->slug.current != "press-releases"]
    | order(date desc) [0...4] {
    _id, title, slug, image, date, author, excerpt,
    category->{_id, name, slug}
  },
  "recapBlogs": *[_type == "blog" && category->slug.current == "tournament-recap"]
    | order(date desc) [0...3] {
    _id, title, slug, image, date, excerpt,
    category->{_id, name, slug}
  }
}`)

export default async function HomePage() {
  const { data } = await sanityFetch({ query: HOMEPAGE_QUERY })

  const { tournaments, liveTournament, recentNews, recapBlogs } = data

  // Opta calls remain unchanged — these are external sports data
  const completeTournaments = tournaments.filter(
    (t: any) => t.status === "Complete"
  )

  // Champion resolution still requires Opta F1 fixtures
  const heroTournamentsWithChampions = await Promise.all(
    completeTournaments.slice(0, 3).map(async (tournament: any) => {
      if (!tournament.optaEnabled) return { ...tournament, champion: null }
      const f1Data = await getF1Fixtures(
        tournament.optaCompetitionId,
        tournament.optaSeasonId
      )
      const champion = findChampionFromFixtures(f1Data, tournament.teams)
      return { ...tournament, champion }
    })
  )

  // ... pass data to HomePageContent component
}
```

### 6.5 API Call Reduction

| Data Need | Before | After |
|-----------|--------|-------|
| All tournaments | 1 API call | 1 GROQ query (bundled) |
| Live tournament | 1 API call | Included in same GROQ |
| Teams per tournament | N API calls (1 per tournament, each fetching ALL teams) | Included in same GROQ (back-reference) |
| Recap blogs | 1 API call | Included in same GROQ |
| Recent news | 1 API call | Included in same GROQ |
| Opta fixtures | N API calls | N API calls (unchanged — external) |
| **CMS Total** | **4 + N calls** (~8-12) | **1 call** |

---

## 7. Portable Text Renderer

### 7.1 Current Prismic Rich Text Mapping

From `src/components/website-base/prismic-rich-text.tsx`:

| Prismic Type | Component | Styling |
|-------------|-----------|---------|
| `heading1` | `<H1>` | `text-4xl lg:text-5xl font-semibold uppercase font-headers` |
| `heading2` | `<H2>` | `text-3xl lg:text-4xl font-medium uppercase font-headers` |
| `heading3` | `<H3>` | `text-xl lg:text-2xl font-medium font-headers` |
| `heading4` | `<H4>` | `text-lg lg:text-xl font-medium font-headers` |
| `paragraph` | `<P>` | `leading-[1.5] text-foreground/80` |
| `preformatted` | `<Blockquote>` | `mt-6 border-l-2 pl-6 italic` |
| `strong` | `<strong>` | `font-semibold` |
| `em` | `<em>` | `italic` |
| `listItem` | `<li>` | (inside `<List>`) |
| `oListItem` | `<li>` | (inside `<ol>`) |
| `list` | `<List>` (`<ul>`) | `my-6 ml-6 list-disc [&>li]:mt-2` |
| `oList` | `<ol>` | `list-decimal list-inside space-y-2` |
| `hyperlink` | `<a>` | `underline underline-offset-2 text-primary`, external gets `target="_blank"` |
| `image` | `<Image>` | `my-6 h-auto w-full rounded` |

### 7.2 New Portable Text Renderer

```tsx
// src/components/portable-text.tsx

import { PortableText, type PortableTextComponents } from "@portabletext/react"
import Image from "next/image"
import { urlFor } from "@/sanity/image"
import { H1, H2, H3, H4, P, Blockquote, List } from "./website-base/typography"

const components: PortableTextComponents = {
  block: {
    // Map Portable Text styles to typography components
    h1: ({ children }) => <H1>{children}</H1>,
    h2: ({ children }) => <H2>{children}</H2>,
    h3: ({ children }) => <H3>{children}</H3>,
    h4: ({ children }) => <H4>{children}</H4>,
    normal: ({ children }) => <P>{children}</P>,
    blockquote: ({ children }) => <Blockquote>{children}</Blockquote>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = value?.href || ""
      const isExternal = href.startsWith("http")
      return (
        <a
          href={href}
          className="underline underline-offset-2 text-primary"
          {...(isExternal
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({ children }) => <List>{children}</List>,
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      return (
        <div className="my-6">
          <Image
            src={urlFor(value).width(1200).auto("format").quality(85).url()}
            alt={value.alt || ""}
            width={1200}
            height={800}
            className="h-auto w-full rounded"
          />
        </div>
      )
    },
  },
}

interface PortableTextRendererProps {
  value: any[] | null | undefined
  className?: string
}

export function PortableTextRenderer({
  value,
  className,
}: PortableTextRendererProps) {
  if (!value) return null
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  )
}
```

### 7.3 Style Mapping Comparison

| Prismic Style | Portable Text Style | Component | Notes |
|---------------|---------------------|-----------|-------|
| `heading1` | `h1` | `<H1>` | Exact match |
| `heading2` | `h2` | `<H2>` | Exact match |
| `heading3` | `h3` | `<H3>` | Exact match |
| `heading4` | `h4` | `<H4>` | Exact match |
| `paragraph` | `normal` | `<P>` | Default block style |
| `preformatted` | `blockquote` | `<Blockquote>` | Prismic mapped preformatted to blockquote |
| `strong` | `strong` | `<strong>` | Mark decorator |
| `em` | `em` | `<em>` | Mark decorator |
| `hyperlink` | `link` | `<a>` | Mark annotation |
| `image` | `image` (type) | `<Image>` | Custom block type |
| `list` / `listItem` | `bullet` / `bullet` | `<List>` / `<li>` | List type + item |
| `oList` / `oListItem` | `number` / `number` | `<ol>` / `<li>` | Ordered list |

### 7.4 Usage in Components

**Before (Prismic):**
```tsx
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text"

<PrismicRichTextComponent field={document.data.body} />
```

**After (Sanity):**
```tsx
import { PortableTextRenderer } from "@/components/portable-text"

<PortableTextRenderer value={document.body} />
```

**Key difference:** Prismic wraps data in `document.data.*`, Sanity returns flat document fields. The `field` prop becomes `value` to match `@portabletext/react` conventions.

---

## 8. Error Handling Patterns

### 8.1 Current Problems

The existing Prismic layer uses 3 inconsistent error handling patterns (see Section 1.7). Some swallow all errors silently, others check for specific status codes, and the patterns vary even within the same file.

### 8.2 Sanity Error Behavior

GROQ has fundamentally different error semantics than Prismic's REST API:

| Scenario | GROQ Behavior | Prismic Behavior |
|----------|--------------|-----------------|
| Document not found | Returns `null` (for `[0]` queries) | Throws 404 error |
| Empty result set | Returns `[]` | Throws "No documents were returned" |
| Invalid reference | Returns `null` for the reference | Throws or returns empty |
| Network error | `sanityFetch` throws | `client.getByUID` throws |
| Missing field | Returns `null` for the field | Returns `null` |
| Invalid query syntax | Throws with descriptive error | N/A |

**Key insight:** Most of the current error handling is unnecessary with Sanity. GROQ never throws for "not found" — it returns `null` or `[]`. The only errors that can occur are network failures and GROQ syntax errors (which are caught during development).

### 8.3 New Error Handling Pattern

```typescript
// Standard pattern for all query functions:

// Single document (returns null if not found)
export async function getThingBySlug(slug: string) {
  const { data } = await sanityFetch({
    query: THING_BY_SLUG_QUERY,
    params: { slug },
  })
  return data // null if not found — no try/catch needed
}

// Collection (returns empty array if no matches)
export async function getThings() {
  const { data } = await sanityFetch({ query: THINGS_QUERY })
  return data ?? [] // GROQ returns null for empty compound queries
}
```

### 8.4 Page-Level Error Handling

```tsx
// Page components handle null/missing data the same way as today:
export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentBySlug(slug)

  if (!tournament) notFound() // Same pattern — works with null returns

  return <TournamentPageContent tournament={tournament} />
}
```

### 8.5 Handling Null References

When a reference field points to a deleted document, GROQ returns `null` for that reference. Components should handle this defensively:

```tsx
// In component code — handle potentially null references
{match.homeTeam ? (
  <TeamCard team={match.homeTeam} />
) : (
  <span>TBD</span>
)}
```

### 8.6 Empty Array Handling

GROQ returns `[]` for back-reference queries and array dereferences with no matches. Components should check length:

```tsx
{tournament.teams?.length > 0 ? (
  <TeamGrid teams={tournament.teams} />
) : (
  <p>Teams to be announced</p>
)}
```

### 8.7 Summary of Error Handling Changes

| Before | After |
|--------|-------|
| 3 inconsistent try/catch patterns | No try/catch in query functions |
| 404 status checks | `null` return (natural GROQ behavior) |
| "No documents" message matching | `?? []` for collections |
| Silent `dev.log` error swallowing | Errors bubble up naturally |
| Per-function error handling | Uniform `null`/`[]` semantics |

---

## 9. Caching & Revalidation Strategy

### 9.1 Current ISR Strategy (Prismic)

```
All queries → force-cache with tags: ["prismic"] + revalidate: 60
  → Content cached for 60 seconds
  → After 60s: stale-while-revalidate (serves stale, fetches fresh in background)
  → On-demand: revalidateTag("prismic") invalidates all CMS content at once
```

**Problems with current approach:**
1. **Coarse-grained invalidation:** `revalidateTag("prismic")` invalidates ALL cached CMS data across all pages. Editing one blog post invalidates tournament data, navigation, sponsors, etc.
2. **Fixed 60-second revalidation:** Not configurable per-query. Tournament data that changes hourly gets the same revalidation as sponsor data that changes monthly.
3. **No real-time updates:** Content changes take up to 60 seconds to appear (plus CDN edge cache)

### 9.2 New Strategy (Sanity `defineLive`)

```
sanityFetch(query)
  → Sanity CDN (useCdn: true) for fast reads
  → Next.js Data Cache with automatic cache tags
  → SanityLive component handles on-demand revalidation
```

**How `defineLive` manages caching:**

1. **Initial fetch:** `sanityFetch` reads from Sanity's global CDN (edge-cached, fast)
2. **Next.js Data Cache:** Results are cached by Next.js with automatic cache tags generated from the query + params combination
3. **Real-time revalidation:** The `SanityLive` client component maintains a WebSocket/SSE connection to Sanity's Content Lake. When any document changes, Sanity notifies `SanityLive`, which calls `revalidateTag()` for exactly the affected cache entries
4. **Fallback revalidation:** The `fetchOptions: { revalidate: 60 }` on `defineLive` provides a time-based fallback — if the WebSocket connection drops, data still refreshes every 60 seconds

### 9.3 Key Differences from Current

| Aspect | Before (Prismic) | After (Sanity) |
|--------|------------------|----------------|
| Cache granularity | Single tag `"prismic"` for all content | Automatic per-query tags |
| Invalidation scope | All CMS data at once | Only queries affected by the changed document |
| Revalidation trigger | Manual `revalidateTag("prismic")` or 60s timer | Automatic via `SanityLive` WebSocket |
| Time-to-update | Up to 60s | Near-instant (WebSocket push) |
| CDN | Prismic CDN (via REST API) | Sanity CDN (via Content Lake + GROQ) |
| Draft preview | `enableAutoPreviews` + `/api/preview` | Draft Mode + `SanityLive` + Visual Editing |

### 9.4 Draft Mode & Visual Editing

**Normal mode (production):**
```
Browser → Next.js → sanityFetch → Sanity CDN (cached, fast)
                                    ↕
                              SanityLive (WebSocket for revalidation)
```

**Draft mode (editor preview):**
```
Browser → Next.js → sanityFetch → Sanity API direct (bypasses CDN)
                                    ↕
                              SanityLive (live draft updates)
                                    ↕
                              Stega encoding (click-to-edit overlays)
```

When draft mode is enabled (via `/api/draft-mode/enable`):
- `sanityFetch` automatically uses the `serverToken` to fetch draft documents
- `SanityLive` streams live updates for all queries on the page
- Stega encoding adds invisible metadata to text fields for Visual Editing click targets
- Changes appear in real-time without page refresh

### 9.5 Setup Requirements

**Root layout (`src/app/layout.tsx`):**
```tsx
import { SanityLive } from "@/sanity/live"
import { draftMode } from "next/headers"
import { VisualEditing } from "next-sanity/visual-editing"

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SanityLive />
        {(await draftMode()).isEnabled && <VisualEditing />}
      </body>
    </html>
  )
}
```

**Draft mode API route (`src/app/api/draft-mode/enable/route.ts`):**
```typescript
import { client } from "@/sanity/client"
import { defineEnableDraftMode } from "next-sanity/draft-mode"

const token = process.env.SANITY_API_READ_TOKEN
if (!token) throw new Error("Missing SANITY_API_READ_TOKEN")

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
})
```

**`next.config.ts` (optional performance optimization):**
```typescript
// Extend cache life since Sanity Live handles on-demand revalidation
experimental: {
  cacheLife: {
    default: {
      revalidate: 60 * 60 * 24 * 90, // 90 days — Live API invalidates as needed
    },
  },
},
```

### 9.6 Cache Behavior Summary

| Event | What Happens |
|-------|-------------|
| Page request (cache hit) | Served from Next.js Data Cache instantly |
| Page request (cache miss) | `sanityFetch` → Sanity CDN → Next.js caches result |
| Document published in Studio | Sanity notifies `SanityLive` → `revalidateTag()` for affected queries → next request gets fresh data |
| Draft mode enabled | `sanityFetch` bypasses CDN, fetches live drafts → real-time updates via `SanityLive` WebSocket |
| WebSocket disconnects | Falls back to `revalidate: 60` time-based revalidation |
| Editor clicks "Publish" | Content Lake update → CDN cache purged → `SanityLive` triggers revalidation → published content appears on next request |

---

## Appendix A: Migration Checklist

- [ ] Create `src/sanity/env.ts`
- [ ] Create `src/sanity/client.ts`
- [ ] Create `src/sanity/live.ts`
- [ ] Create `src/sanity/image.ts`
- [ ] Create `src/sanity/lib/queries.ts` (all GROQ queries)
- [ ] Install `@portabletext/react`
- [ ] Create `src/components/portable-text.tsx`
- [ ] Refactor `src/cms/queries/tournaments.ts`
- [ ] Refactor `src/cms/queries/blog.ts`
- [ ] Refactor `src/cms/queries/team.ts`
- [ ] Refactor `src/cms/queries/match.ts`
- [ ] Refactor `src/cms/queries/website.ts`
- [ ] Delete `src/cms/queries/navigation.ts`
- [ ] Refactor `src/cms/queries/policies.ts`
- [ ] Refactor `src/cms/queries/sponsors.ts`
- [ ] Refactor `src/cms/queries/broadcast-partners.ts`
- [ ] Refactor `src/cms/queries/players.ts`
- [ ] Delete `src/cms/queries/social-contents.ts`
- [ ] Update `mapBlogDocumentToMetadata` → `mapBlogToMetadata` in `src/lib/utils.ts`
- [ ] Update all 14 files importing `mapBlogDocumentToMetadata`
- [ ] Delete `src/prismicio.ts`
- [ ] Delete `src/cms/client.ts`
- [ ] Delete `src/cms/utils.ts`
- [ ] Delete `src/components/website-base/prismic-rich-text.tsx`
- [ ] Set up `/api/draft-mode/enable` route
- [ ] Add `SanityLive` to root layout
- [ ] Add `VisualEditing` to root layout (draft mode conditional)
- [ ] Update `next.config.ts` image domains (`cdn.sanity.io`)
- [ ] Add environment variables to `.env.local`

## Appendix B: Performance Impact Summary

| Improvement | Before | After | Impact |
|-------------|--------|-------|--------|
| Homepage CMS calls | 10-15 calls | 1 GROQ query | ~90% reduction in CMS round-trips |
| Teams for tournament | Fetch ALL teams + JS filter | `references()` server-side | O(n) → O(1) lookup |
| Navigation settings | 9 sequential calls | 1 GROQ with inline refs | ~90% reduction |
| Nav tournaments filter | Fetch ALL, filter JS | Server-side GROQ filter | Eliminates over-fetching |
| Policy nav filter | Fetch ALL, filter JS | Server-side GROQ filter | Eliminates over-fetching |
| Match by Opta ID | Fetch ALL matches, `.find()` | Server-side GROQ filter | O(n) → O(1) lookup |
| Tournament by Opta ID | Fetch ALL tournaments, `.find()` | Server-side GROQ filter | O(n) → O(1) lookup |
| Cache invalidation | All CMS content at once | Per-query granularity | Fewer unnecessary refetches |
| Time-to-update | Up to 60s | Near-instant (WebSocket) | Better editor experience |

---

*Document authored: 2026-02-17*
*Phase: 2 of 6 — Data Flow & GROQ Query Architecture*
*Depends on: Phase 1 (Foundation — Sanity schemas and Studio setup)*
