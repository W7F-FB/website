# Phase 4: Page-by-Page Component Migration

> **Prerequisite:** Phase 2 (Data Fetching Layer) and Phase 3 (Sanity schemas + queries) must be complete. All GROQ queries in `src/sanity/lib/queries.ts` are written, `sanityFetch` is working, and Portable Text renderer exists.

---

## Table of Contents

1. [Migration Order](#1-migration-order)
2. [SectionRenderer Component](#2-sectionrenderer-component)
3. [Section Components — Slice-to-Section Mapping](#3-section-components--slice-to-section-mapping)
4. [Layout Changes](#4-layout-changes)
5. [Navigation Refactoring](#5-navigation-refactoring)
6. [Footer Refactoring](#6-footer-refactoring)
7. [Utility Function Updates](#7-utility-function-updates)
8. [Type Updates](#8-type-updates)
9. [Page-by-Page Migration](#9-page-by-page-migration)
   - 9.1 [resources/[slug] — Policy Pages](#91-resourcesslug--policy-pages)
   - 9.2 [leadership — Leadership Page](#92-leadership--leadership-page)
   - 9.3 [[uid] — Dynamic SliceZone Pages](#93-uid--dynamic-slicezone-pages)
   - 9.4 [news/[slug] — Blog Post Pages](#94-newsslug--blog-post-pages)
   - 9.5 [news — News Listing Page](#95-news--news-listing-page)
   - 9.6 [contact — Contact Page](#96-contact--contact-page)
   - 9.7 [faqs — FAQs Page](#97-faqs--faqs-page)
   - 9.8 [checkout & confirmation — Static Pages](#98-checkout--confirmation--static-pages)
   - 9.9 [tournament/page.tsx — Tournament Index Redirect](#99-tournamentpagetsx--tournament-index-redirect)
   - 9.10 [tournament/[slug] — Tournament Hub](#910-tournamentslug--tournament-hub)
   - 9.11 [tournament/[slug]/schedule — Schedule Redirect](#911-tournamentslugschedule--schedule-redirect)
   - 9.12 [tournament/[slug]/tickets — Tickets Page](#912-tournamentslugtickets--tickets-page)
   - 9.13 [tournament/[slug]/vip-cabanas — VIP Cabanas Page](#913-tournamentslugvip-cabanas--vip-cabanas-page)
   - 9.14 [tournament/[slug]/know-before-you-go — KBYG Page](#914-tournamentslugknow-before-you-go--kbyg-page)
   - 9.15 [tournament/[slug]/match/[matchSlug] — Match Page](#915-tournamentslugmatchmatchslug--match-page)
   - 9.16 [club/[slug] — Club/Team Page](#916-clubslug--clubteam-page)
   - 9.17 [(home)/page.tsx — Homepage](#917-homepagetsx--homepage)

---

## 1. Migration Order

Pages should be migrated from simplest (fewest Prismic dependencies) to most complex. This ensures foundational components (SectionRenderer, PortableText, utility functions) are validated on simple pages before tackling complex ones.

| Priority | Route | Complexity | Why This Order |
|----------|-------|-----------|----------------|
| 1 | Layout (`src/app/layout.tsx`) | Low | Must happen first — removes PrismicPreview, adds SanityLive |
| 2 | Navigation + Footer | Medium | Used by every page — migrate once, all pages benefit |
| 3 | `resources/[slug]` | Low | Simple single-doc page, validates PortableText renderer |
| 4 | `leadership/` | Low | Simple list page, validates teamMember queries |
| 5 | `[uid]` | Medium | Validates SectionRenderer (replaces SliceZone) |
| 6 | `news/[slug]` | Medium | Validates blog queries + PortableText for content |
| 7 | `news/` | Medium | Validates blog listing queries + category filtering |
| 8 | `contact/` | None | No CMS data — just uses Nav/Footer (already migrated) |
| 9 | `faqs/` | None | No CMS data — hardcoded FAQ content from `src/lib/data/faqs` |
| 10 | `checkout/` + `confirmation/` | None | No CMS data — static pages |
| 11 | `tournament/` (index redirect) | Low | Simple redirect using tournament query |
| 12 | `tournament/[slug]/tickets` | Medium | Tournament query + Opta fixture data for games slider |
| 13 | `tournament/[slug]/vip-cabanas` | Medium | Tournament query + games slider |
| 14 | `tournament/[slug]/know-before-you-go` | Medium | Tournament query + PrismicRichText -> PortableText |
| 15 | `tournament/[slug]/schedule` | Low | Simple redirect |
| 16 | `club/[slug]` | High | Team data + Opta integration + multiple queries |
| 17 | `tournament/[slug]` | Very High | Most complex — 3 status variants, Opta, awards, broadcasts |
| 18 | `tournament/[slug]/match/[matchSlug]` | Very High | Heavy Opta integration, multiple CMS queries |
| 19 | `(home)/page.tsx` | Very High | Consolidates data from many queries, most complex page |

---

## 2. SectionRenderer Component

Replaces Prismic's `<SliceZone>` component. The `SliceZone` uses a `components` map from `src/cms/slices/index.ts` and passes `slice` props. The SectionRenderer uses Sanity's `_type` field and passes section data directly as props.

### Current: SliceZone Usage

```tsx
// src/app/(website)/(subpages)/[uid]/page.tsx
import { SliceZone } from "@prismicio/react";
import { components } from "@/cms/slices";

<SliceZone slices={page.data.slices} components={components} />
```

The `components` map (auto-generated at `src/cms/slices/index.ts`):
```ts
export const components = {
  community_champions: dynamic(() => import("./CommunityChampions")),
  divider: dynamic(() => import("./Divider")),
  image_with_text: dynamic(() => import("./ImageWithText")),
  news_list: dynamic(() => import("./NewsList")),
  subpage_hero: dynamic(() => import("./SubpageHero")),
  text_block: dynamic(() => import("./TextBlock")),
};
```

### New: SectionRenderer Implementation

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
        if (!Component) {
          console.warn(`Unknown section type: ${section._type}`)
          return null
        }
        return <Component key={section._key || index} {...section} />
      })}
    </>
  )
}
```

---

## 3. Section Components — Slice-to-Section Mapping

Each Prismic slice component maps to a Sanity section component. The rendering logic stays nearly identical — the main changes are:

1. **Props source:** `slice.primary.field_name` → direct prop `fieldName`
2. **Rich text:** `<PrismicRichText field={...}>` → `<PortableTextRenderer value={...}>`
3. **Images:** `<PrismicNextImage field={...}>` → `<Image>` with Sanity image URL builder
4. **Type guards:** `isFilled.richText(...)` → null checks on Portable Text arrays
5. **Content relationships:** `isFilled.contentRelationship(...)` → direct object access (GROQ resolves refs)

### 3.1 SubpageHero → HeroSection

**Current** (`src/cms/slices/SubpageHero/index.tsx`):
- Props: `SliceComponentProps<Content.SubpageHeroSlice>`
- Accesses: `slice.primary.subtitle` (plain text), `slice.primary.heading` (RichText → H1), `slice.primary.description` (RichText → P), `slice.primary.image` (PrismicNextImage), `slice.primary.space_above/below`
- Uses `PrismicRichText` with custom components for heading1 and paragraph

**New** (`src/components/sections/hero-section.tsx`):
```tsx
type HeroSectionProps = {
  subtitle?: string
  heading: string
  description?: string  // plain text, not Portable Text
  image?: SanityImageSource
  spaceAbove?: boolean
  spaceBelow?: boolean
  _key?: string
}

export function HeroSection({ subtitle, heading, description, image, spaceAbove = true, spaceBelow = true }: HeroSectionProps) {
  // Same layout as current SubpageHero slice
  // Replace PrismicRichText heading with direct <H1>{heading}</H1>
  // Replace PrismicRichText description with <P>{description}</P>
  // Replace PrismicNextImage with <Image src={urlFor(image).url()} ... />
}
```

**Key change:** Heading was RichText in Prismic (rendered via `PrismicRichText` with `heading1` component). In Sanity it's a plain `string` field, so render directly as `<H1>`.

### 3.2 TextBlock → TextBlockSection

**Current** (`src/cms/slices/TextBlock/index.tsx`):
- Props: `SliceComponentProps<Content.TextBlockSlice>`
- Complex PrismicRichText with components for h2, h3, h4, h5, h6, paragraph, preformatted, hyperlinks, lists
- Accesses: `slice.primary.heading` (RichText), `slice.primary.body` (RichText), `slice.primary.text_align`, `text_size`, `content_width`, `space_above/below`, `padding_top/bottom`

**New** (`src/components/sections/text-block-section.tsx`):
```tsx
type TextBlockSectionProps = {
  heading?: string
  body?: PortableTextBlock[]  // Sanity Portable Text
  textAlign?: 'left' | 'center' | 'right'
  textSize?: 'small' | 'medium' | 'large'
  contentWidth?: 'full' | 'large' | 'medium' | 'small'
  spaceAbove?: boolean
  spaceBelow?: boolean
}

export function TextBlockSection({ heading, body, textAlign = 'left', textSize = 'medium', contentWidth = 'full', spaceAbove = true, spaceBelow = true }: TextBlockSectionProps) {
  // Replace PrismicRichText for body with <PortableTextRenderer value={body} />
  // heading is now a plain string, render with <H2 className="uppercase">{heading}</H2>
  // Layout/spacing logic stays identical
}
```

**Key changes:**
- `slice.primary.heading` (RichText) → `heading` (string) — was only ever used as H2
- `slice.primary.body` (Prismic RichText) → `body` (Portable Text) — use PortableTextRenderer
- `padding_top/padding_bottom` fields may not exist in Sanity schema (only `spaceAbove/spaceBelow`) — verify schema and add if needed

### 3.3 ImageWithText → ImageWithTextSection

**Current** (`src/cms/slices/ImageWithText/index.tsx`):
- Uses `prismic.asText()` to extract plain text from title field
- Delegates to `ImageWithText` block component (`src/components/blocks/image-with-text.tsx`)
- Block component uses `PrismicRichText` for description

**New** (`src/components/sections/image-with-text-section.tsx`):
```tsx
type ImageWithTextSectionProps = {
  eyebrow?: string
  title?: string
  description?: PortableTextBlock[]
  image?: SanityImageSource
  imagePosition?: 'left' | 'right'
  spaceAbove?: boolean
  spaceBelow?: boolean
}
```

**Key change:** The block component `src/components/blocks/image-with-text.tsx` currently receives an `ImageWithTextContent` object and uses `PrismicRichText` for description. This block component should be updated to accept either Portable Text or be replaced by the section component directly.

### 3.4 NewsList → NewsListSection

**Current** (`src/cms/slices/NewsList/index.tsx`):
- **Async server component** — fetches data inside the slice
- If manual posts: fetches by IDs using `client.getByIDs<Content.BlogDocument>(ids)`
- If category filter: calls `getBlogsByCategory(category)` or `getAllBlogs()`
- Uses `mapBlogDocumentToMetadata()` to transform blog documents
- Renders `PostCompact` components

**New** (`src/components/sections/news-list-section.tsx`):
```tsx
// This is the trickiest section — it needs server-side data fetching
// Two approaches:

// Approach A: Pre-resolve in GROQ (recommended)
// The GROQ query for pages already resolves manualPosts via references:
//   manualPosts[]->{_id, title, slug, image, date, excerpt, category->}
// And category is already resolved. The section component just renders.

// Approach B: Fetch inside the section component (matches current pattern)
// The section component makes its own sanityFetch call

type NewsListSectionProps = {
  heading?: string
  category?: { _id: string; name: string; slug: { current: string } }
  manualPosts?: BlogMetadata[]  // Pre-resolved by GROQ
  limit?: number
  spaceAbove?: boolean
  spaceBelow?: boolean
}

// If manualPosts are provided (and non-empty), use them.
// Otherwise, fetch by category or get recent posts.
```

**Key changes:**
- Category is now a reference to `blogCategory` document (not a hardcoded Select string)
- Manual posts can be pre-resolved by GROQ, eliminating the need for separate API calls
- `mapBlogDocumentToMetadata()` no longer needed — GROQ returns the shape directly

### 3.5 Divider → DividerSection

**Current** (`src/cms/slices/Divider/index.tsx`):
- Simplest slice — just renders `<Separator />` with spacing

**New** (`src/components/sections/divider-section.tsx`):
```tsx
type DividerSectionProps = {
  spaceAbove?: boolean
  spaceBelow?: boolean
}
// Identical rendering. Trivial migration.
```

### 3.6 CommunityChampions → CommunityChampionsSection

**Current** (`src/cms/slices/CommunityChampions/index.tsx`):
- Has `logos` repeatable group, each with `tournament` (ContentRelationship) and `logo` (Image)
- Custom `groupLogos()` function extracts tournament title via `tournament.data.title`
- Uses `PrismicRichText` for heading and description
- Uses `PrismicNextImage` for logos

**New** (`src/components/sections/community-champions-section.tsx`):
```tsx
type LogoItem = {
  tournament?: { _id: string; title: string }  // Resolved by GROQ
  logo?: SanityImageSource
}

type CommunityChampionsSectionProps = {
  heading?: string
  description?: PortableTextBlock[]
  logos?: LogoItem[]
  spaceAbove?: boolean
  spaceBelow?: boolean
}

// groupLogos() function stays, but tournament title access changes:
// Before: isFilled.contentRelationship(tournament) && tournament.data?.title
// After: tournament?.title (GROQ resolves the reference)
```

**Key changes:**
- `heading` and `description` change from RichText to string/PortableText
- Tournament references are pre-resolved by GROQ
- `PrismicNextImage` → `Image` with Sanity image URL

---

## 4. Layout Changes

### Current (`src/app/layout.tsx`)

```tsx
import { PrismicPreview } from "@prismicio/next";
import Script from "next/script";

// In body:
<Script async defer src="https://static.cdn.prismic.io/prismic.js?new=true&repo=world-sevens-football" />
{children}
<PrismicPreview repositoryName="world-sevens-football" />
```

### New (`src/app/layout.tsx`)

```tsx
import { SanityLive } from '@/sanity/live'

// Remove:
// - PrismicPreview import and component
// - Prismic toolbar Script tag

// Add:
{children}
<SanityLive />
```

### Changes:
1. **Remove** `import { PrismicPreview } from "@prismicio/next"`
2. **Remove** `<Script ... src="https://static.cdn.prismic.io/prismic.js..." />`
3. **Remove** `<PrismicPreview repositoryName="world-sevens-football" />`
4. **Add** `import { SanityLive } from '@/sanity/live'`
5. **Add** `<SanityLive />` after `{children}`
6. Everything else (GTM, GA, ClipPaths, MetallicGradients, ErrorHandler) stays unchanged

### Subpages Layout (`src/app/(website)/(subpages)/layout.tsx`)

No changes needed — it's just a `<div className="space-y-6">` wrapper.

---

## 5. Navigation Refactoring

### Current Implementation (`src/components/website-base/nav/nav-main.tsx`)

**Data fetching** (async server component):
- `getNavigationTournaments()` → tournaments for Events menu
- `getMostRecentNews()` → recent blog posts for "More Info" section
- `getNavigationSettings()` → site settings including `moreInfoMode` and broadcast partners
- `getTeamsByTournament(featuredTournament.uid)` → teams for featured tournament card

**Prismic-specific code:**
- Imports: `TournamentDocument`, `TeamDocument` from `prismicio-types`
- Uses `PrismicNextImage` for tournament nav images and team logos
- Uses `isFilled.image()` for image checks
- Accesses `tournament.data.field_name` pattern throughout
- `PrismicLink` used in nav-tournament-item.tsx

**Related files:**
- `nav-tournament-item.tsx` — uses `PrismicLink`, `PrismicNextImage`, `TournamentDocument`, `TeamDocument`

### Required Changes

1. **Import swaps:**
   - `TournamentDocument` → Sanity tournament type (from GROQ inference or manual type)
   - `TeamDocument` → Sanity team type
   - `PrismicNextImage` → `Image` from `next/image` + Sanity image URL builder
   - `PrismicLink` → standard `Link` from `next/link`
   - `isFilled` → null checks

2. **Data access pattern:**
   - `tournament.data.title` → `tournament.title`
   - `tournament.data.hero_image` → `tournament.heroImage`
   - `tournament.data.nav_image` → `tournament.navImage`
   - `tournament.data.show_in_navigation` → `tournament.showInNavigation`
   - `tournament.data.featured` → `tournament.featured`
   - `tournament.data.status` → `tournament.status`
   - `tournament.data.start_date` → `tournament.startDate`
   - `tournament.data.end_date` → `tournament.endDate`
   - `tournament.data.country_code` → `tournament.countryCode`
   - `tournament.data.tickets_available` → `tournament.ticketsAvailable`
   - `tournament.data.opta_competition_id` → `tournament.optaCompetitionId`
   - `tournament.data.opta_season_id` → `tournament.optaSeasonId`
   - `tournament.uid` → `tournament.slug.current`
   - `team.data.logo` → `team.logo`
   - `team.data.opta_id` → `team.optaId`

3. **Query function swaps:**
   - `getNavigationTournaments()` → uses `NAV_TOURNAMENTS_QUERY` via sanityFetch
   - `getMostRecentNews()` → equivalent GROQ query
   - `getNavigationSettings()` → `SITE_SETTINGS_QUERY` via sanityFetch
   - `getTeamsByTournament(uid)` → `TEAMS_BY_TOURNAMENT_QUERY` with tournament ID

4. **Image handling:**
   - `PrismicNextImage field={tournament.data.nav_image}` → `<Image src={urlFor(tournament.navImage).url()} alt={...} />`
   - Image URL builder from `src/sanity/image.ts`

5. **Navigation settings:**
   - `website.data.more_info_mode` → `siteSettings.moreInfoMode`
   - Broadcast partners from settings → `siteSettings.whereToWatchPartners[]->` (pre-resolved by GROQ)

### nav-tournament-item.tsx Changes

- Remove `PrismicLink` → use `<Link href={/tournament/${tournament.slug.current}}>`
- Remove `PrismicNextImage` → use `<Image>` with Sanity image URLs
- `tournament.data.*` → `tournament.*` (flat access, no `.data.` wrapper)
- `isFilled.image(tournament.data.hero_image)` → `tournament.heroImage != null`

---

## 6. Footer Refactoring

### Current Implementation (`src/components/website-base/footer/footer-main.tsx`)

**Data fetching:**
- `getFooterData()` → footer menu columns from website singleton
- `getVisibleSponsors()` → sponsor logos
- `getPoliciesForNav()` → policy links for footer

**Prismic-specific code:**
- Footer columns come from `transformWebsiteData()` in `src/cms/queries/navigation.ts`
- Sponsor logos use Prismic image fields
- Policy links use `slug` from Prismic policy documents

### Required Changes

1. **Query swaps:**
   - `getFooterData()` → `SITE_SETTINGS_QUERY` (already fetches `footerMenus`)
   - `getVisibleSponsors()` → `SPONSORS_QUERY`
   - `getPoliciesForNav()` → `POLICIES_NAV_QUERY`

2. **Data shape changes:**
   - Footer menus: Currently transformed by `transformWebsiteData()` into `FooterColumnData[]`. In Sanity, `footerMenus` is already an array of `footerMenu` objects with `menuTitle` and `links[]`. The transform function may be simplified or removed.
   - Sponsors: `sponsor.data.logo.url` → `urlFor(sponsor.logo).url()`
   - Policies: `policy.slug` stays similar (Sanity uses `slug.current`)

3. **footer-columns.tsx:** Already takes plain `FooterColumnData[]` — may not need changes if the Sanity data shape matches.

4. **Privacy button, social links, newsletter form:** No CMS dependency — unchanged.

---

## 7. Utility Function Updates

### `mapBlogDocumentToMetadata()` (`src/lib/utils.ts`)

**Current:**
```typescript
export function mapBlogDocumentToMetadata(doc: BlogDocument): BlogMetadata {
  return {
    slug: doc.uid || "",
    title: doc.data.title || "",
    excerpt: doc.data.excerpt || "",
    image: doc.data.image?.url || null,
    category: doc.data.category || null,
    author: doc.data.author || null,
    date: doc.data.date || null,
    createdDate: doc.first_publication_date || null,
  }
}
```

**New:**
```typescript
export function mapSanityBlogToMetadata(blog: SanityBlog): BlogMetadata {
  return {
    slug: blog.slug?.current || "",
    title: blog.title || "",
    excerpt: blog.excerpt || "",
    image: blog.image ? urlFor(blog.image).url() : null,
    category: blog.category?.name || null,
    author: blog.author || null,
    date: blog.date || null,
    createdDate: blog._createdAt || null,
  }
}
```

**Key changes:**
- `doc.uid` → `blog.slug?.current`
- `doc.data.title` → `blog.title` (no `.data.` wrapper)
- `doc.data.image?.url` → `urlFor(blog.image).url()` (Sanity image URL builder)
- `doc.data.category` (string) → `blog.category?.name` (reference, name resolved by GROQ)
- `doc.first_publication_date` → `blog._createdAt`

**Alternative:** Since GROQ can project these fields directly, consider eliminating this utility entirely and having GROQ return the exact `BlogMetadata` shape.

### `getImageUrl()` / `getImageAlt()` (`src/cms/utils.ts`)

**Current:**
```typescript
export function getImageUrl(image: prismic.ImageField | null | undefined): string | null {
  if (!image?.url) return null;
  return image.url;
}
export function getImageAlt(image: prismic.ImageField | null | undefined): string {
  return image?.alt || "";
}
```

**New:**
```typescript
// src/sanity/image.ts
import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

const builder = imageUrlBuilder(client)
export function urlFor(source: any) {
  return builder.image(source)
}

// Usage: urlFor(image).width(800).url()
// Alt text: Stored in image.alt or asset metadata
```

### `parseDate()` — No change needed. Sanity dates are also ISO strings.

### Prismic-specific utilities to remove:
- `client` export from `src/cms/utils.ts` (pre-created Prismic client)
- `createClient()` from `src/prismicio.ts` and `src/cms/client.ts`

---

## 8. Type Updates

### Current Type Sources

Components currently import from:
- `prismicio-types.d.ts` — auto-generated Prismic document types (`TournamentDocument`, `BlogDocument`, `TeamDocument`, etc.)
- `@prismicio/client` — `Content`, `isFilled`, `ImageField`, `RichTextField`, etc.
- `@prismicio/react` — `SliceComponentProps`, `PrismicRichText`
- `@prismicio/next` — `PrismicNextImage`

### New Type Strategy

**Option A: Manual types (simplest for migration)**
Create a types file based on Sanity schema definitions:

```typescript
// src/sanity/types.ts
export type Tournament = {
  _id: string
  _type: 'tournament'
  title: string
  slug: { current: string }
  nickname?: string
  status?: 'Upcoming' | 'Live' | 'Complete'
  featured?: boolean
  prizePool?: number
  countryCode?: string
  stadiumName?: string
  startDate?: string
  endDate?: string
  numberOfTeams?: number
  ticketsAvailable?: boolean
  heroImage?: SanityImage
  highlightReelLink?: string
  optaCompetitionId?: string
  optaSeasonId?: string
  optaEnabled?: boolean
  showInNavigation?: boolean
  navigationOrder?: number
  navImage?: SanityImage
  navigationDescription?: string
  // Resolved references (from GROQ projections):
  matches?: Match[]
  awards?: Award[]
  recap?: { title: string; slug: { current: string }; image?: SanityImage }
  teams?: Team[]
  // ...etc
}
```

**Option B: Infer from GROQ queries**
Use `next-sanity`'s type inference:
```typescript
import { defineQuery } from 'next-sanity'
const QUERY = defineQuery(`...`)
// The return type is inferred from the query
```

**Recommendation:** Start with Option A for clarity during migration, then optionally move to Option B later.

### Import Replacement Map

| Current Import | New Import |
|---------------|------------|
| `TournamentDocument` from `prismicio-types` | `Tournament` from `@/sanity/types` |
| `BlogDocument` from `prismicio-types` | `Blog` from `@/sanity/types` |
| `TeamDocument` from `prismicio-types` | `Team` from `@/sanity/types` |
| `Content.NewsListSlice` etc. | Section prop types |
| `SliceComponentProps<T>` | Direct props on section components |
| `isFilled` from `@prismicio/client` | Null checks (`value != null`) |
| `PrismicRichText` from `@prismicio/react` | `PortableTextRenderer` from `@/components/portable-text` |
| `PrismicNextImage` from `@prismicio/next` | `Image` from `next/image` + `urlFor()` |
| `PrismicLink` from `@prismicio/react` | `Link` from `next/link` |
| `createClient` from `@/prismicio` | `sanityFetch` from `@/sanity/live` |

---

## 9. Page-by-Page Migration

### 9.1 `resources/[slug]` — Policy Pages

**File:** `src/app/(website)/(subpages)/resources/[slug]/page.tsx`

**Current implementation:**
- Fetches: `getPolicyBySlug(slug)` → single policy document
- Prismic types: `PolicyDocument` (implicit via query return)
- Renders: `<H1>`, date via `formatDate(policy.last_publication_date)`, rich text via `<PrismicRichTextComponent field={policy.data.body} />`
- Uses `PrismicRichTextComponent` from `src/components/website-base/prismic-rich-text.tsx`

**Required changes:**
```diff
- import { getPolicyBySlug } from "@/cms/queries/policies"
+ import { sanityFetch } from "@/sanity/live"
+ import { POLICY_BY_SLUG_QUERY } from "@/sanity/lib/queries"

- import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text"
+ import { PortableTextRenderer } from "@/components/portable-text"

// In generateMetadata and page function:
- const policy = await getPolicyBySlug(slug)
+ const { data: policy } = await sanityFetch({ query: POLICY_BY_SLUG_QUERY, params: { slug } })

// Data access:
- policy.data.name → policy.name
- policy.data.body → policy.body
- policy.last_publication_date → policy._updatedAt

// Rendering:
- <PrismicRichTextComponent field={policy.data.body} />
+ <PortableTextRenderer value={policy.body} />
```

---

### 9.2 `leadership` — Leadership Page

**File:** `src/app/(website)/(subpages)/leadership/page.tsx`

**Current implementation:**
- Fetches: `getPlayerAdvisoryCouncil()`, `getCoFounders()`, `getLeadershipTeam()`
- Prismic types: `prismic.isFilled.image(member.data.headshot)` for image checks
- Renders: `LeadershipCard` components with `{ name, role, headshot, department }` objects
- Transforms Prismic doc → plain object for each team member

**Required changes:**
```diff
- import * as prismic from "@prismicio/client"
- import { getPlayerAdvisoryCouncil, getCoFounders, getLeadershipTeam } from "@/cms/queries/team"
+ import { sanityFetch } from "@/sanity/live"
+ import { TEAM_MEMBERS_BY_DEPARTMENT_QUERY } from "@/sanity/lib/queries"
+ import { urlFor } from "@/sanity/image"

// Fetch by department:
- const playerAdvisoryCouncil = await getPlayerAdvisoryCouncil()
+ const { data: playerAdvisoryCouncil } = await sanityFetch({
+   query: TEAM_MEMBERS_BY_DEPARTMENT_QUERY,
+   params: { department: "Player Advisor" }
+ })

// Transform for LeadershipCard:
- name: member.data.name || "Unknown",
- role: member.data.role || "Unknown",
- headshot: prismic.isFilled.image(member.data.headshot) ? member.data.headshot.url || "" : "",
+ name: member.name || "Unknown",
+ role: member.role || "Unknown",
+ headshot: member.headshot ? urlFor(member.headshot).url() : "",
```

---

### 9.3 `[uid]` — Dynamic SliceZone Pages

**File:** `src/app/(website)/(subpages)/[uid]/page.tsx`

**Current implementation:**
- Fetches: `client.getByUID("page", uid)` directly via Prismic client
- Core render: `<SliceZone slices={page.data.slices} components={components} />`
- Metadata: `page.data.meta_title`, `page.data.meta_description`, `page.data.meta_image`

**Required changes:**

This is the canonical SectionRenderer migration.

```diff
- import { SliceZone } from "@prismicio/react"
- import { createClient } from "@/prismicio"
- import { components } from "@/cms/slices"
+ import { sanityFetch } from "@/sanity/live"
+ import { defineQuery } from "next-sanity"
+ import { SectionRenderer } from "@/components/sections/section-renderer"

+ const PAGE_QUERY = defineQuery(`
+   *[_type == "page" && slug.current == $slug][0]{
+     title,
+     sections[]{
+       ...,
+       _type == "newsList" => {
+         ...,
+         category->,
+         manualPosts[]->{_id, title, slug, image, date, excerpt, category->}
+       },
+       _type == "communityChampions" => {
+         ...,
+         logos[]{..., tournament->{_id, title}}
+       }
+     },
+     seo
+   }
+ `)

// generateMetadata:
- const client = createClient()
- const page = await client.getByUID("page", uid)
+ const { data: page } = await sanityFetch({ query: PAGE_QUERY, params: { slug: uid } })

- page.data.meta_title → page.seo?.metaTitle
- page.data.meta_description → page.seo?.metaDescription
- page.data.meta_image?.url → page.seo?.metaImage ? urlFor(page.seo.metaImage).url() : null

// Page render:
- <SliceZone slices={page.data.slices} components={components} />
+ <SectionRenderer sections={page.sections} />
```

---

### 9.4 `news/[slug]` — Blog Post Pages

**File:** `src/app/(website)/(subpages)/news/[slug]/page.tsx`

**Current implementation:**
- Fetches: `getBlogBySlug(slug)`, then `getBlogsByCategory("Press Releases")` or `getAllBlogs()` for related posts
- Uses `mapBlogDocumentToMetadata()` for all blog data transformation
- Renders blog content with inline `PrismicRichText` (not the shared component) with full custom components (h1-h4, p, blockquote, lists, hyperlinks, images)
- Related posts rendered as `PostCardVert` or `PressReleaseCard`

**Required changes:**
```diff
- import { PrismicRichText } from "@prismicio/react"
- import * as prismic from "@prismicio/client"
- import { getBlogBySlug, getAllBlogs, getBlogsByCategory } from "@/cms/queries/blog"
+ import { sanityFetch } from "@/sanity/live"
+ import { BLOG_BY_SLUG_QUERY, ALL_NEWS_QUERY, BLOGS_BY_CATEGORY_QUERY } from "@/sanity/lib/queries"
+ import { PortableTextRenderer } from "@/components/portable-text"
+ import { urlFor } from "@/sanity/image"

// Fetch:
- const blogDoc = await getBlogBySlug(slug)
+ const { data: blogDoc } = await sanityFetch({ query: BLOG_BY_SLUG_QUERY, params: { slug } })

// Data access:
- const blog = mapBlogDocumentToMetadata(blogDoc)
+ const blog = {
+   slug: blogDoc.slug.current,
+   title: blogDoc.title,
+   excerpt: blogDoc.excerpt,
+   image: blogDoc.image ? urlFor(blogDoc.image).url() : null,
+   category: blogDoc.category?.name,
+   author: blogDoc.author,
+   date: blogDoc.date,
+ }

// Content rendering (biggest change):
- <PrismicRichText field={blogDoc.data.content} components={{...}} />
+ <PortableTextRenderer value={blogDoc.content} />
// The PortableTextRenderer should have the same custom components
// (H1-H4, P, Blockquote, Lists, hyperlinks, images) baked in

// Related posts:
- const relatedSource = isPressRelease ? await getBlogsByCategory("Press Releases") : await getAllBlogs()
+ const { data: relatedSource } = await sanityFetch({
+   query: isPressRelease ? BLOGS_BY_CATEGORY_QUERY : ALL_NEWS_QUERY,
+   params: isPressRelease ? { categorySlug: "press-releases" } : {}
+ })
```

**Note:** The inline PrismicRichText with custom components for blog content is the most common pattern in the codebase. The Portable Text renderer (`src/components/portable-text.tsx`) must support all these node types:
- Headings (h1-h4)
- Paragraphs
- Strong, em
- Blockquotes (mapped from `preformatted` in Prismic)
- Ordered and unordered lists
- Hyperlinks (with external link detection)
- Images (full-width, using `next/image`)

---

### 9.5 `news` — News Listing Page

**File:** `src/app/(website)/(subpages)/news/page.tsx`

**Current implementation:**
- Fetches: `getAllBlogs()` → all blog documents
- Maps all blogs via `mapBlogDocumentToMetadata()`
- Passes to `<NewsFilteredContent>` client component for tab-based filtering
- Categories defined in `./categories.ts` as hardcoded constants

**Required changes:**
```diff
- import { getAllBlogs } from "@/cms/queries/blog"
- import { mapBlogDocumentToMetadata } from "@/lib/utils"
+ import { sanityFetch } from "@/sanity/live"
+ import { ALL_BLOGS_QUERY } from "@/sanity/lib/queries"

- const allBlogDocs = await getAllBlogs()
- const allBlogs = allBlogDocs.map(mapBlogDocumentToMetadata)
+ const { data: allBlogDocs } = await sanityFetch({ query: ALL_BLOGS_QUERY })
+ const allBlogs = allBlogDocs.map(mapSanityBlogToMetadata)  // or shape directly from GROQ
```

**Note:** The `categories.ts` file has hardcoded category constants. In Sanity, categories are documents. The `NewsFilteredContent` component filters client-side by `blog.category` string — this still works as long as the category name strings match.

---

### 9.6 `contact` — Contact Page

**File:** `src/app/(website)/(subpages)/contact/page.tsx`

**Current implementation:**
- **No CMS data.** Static metadata, delegates to `ContactPageContent` client component.
- `ContactPageContent` (in `page-content.tsx`) is a client form component with no Prismic imports.

**Required changes:** Only Nav/Footer migration (handled globally). No page-specific changes beyond that.

---

### 9.7 `faqs` — FAQs Page

**File:** `src/app/(website)/(subpages)/faqs/page.tsx`

**Current implementation:**
- **No CMS data.** FAQ content comes from `src/lib/data/faqs.ts` (hardcoded).
- Static metadata.

**Required changes:** Only Nav/Footer migration. No page-specific changes.

---

### 9.8 `checkout` & `confirmation` — Static Pages

**Files:**
- `src/app/(website)/(subpages)/checkout/page.tsx`
- `src/app/(website)/(subpages)/confirmation/page.tsx`

**Current implementation:**
- **No CMS data.** Both are static pages.
- `checkout` delegates to `CheckoutPageContent` client component (CTS ticketing integration).
- `confirmation` is a thank-you page with static content.

**Required changes:** Only Nav/Footer migration. No page-specific changes.

---

### 9.9 `tournament/page.tsx` — Tournament Index Redirect

**File:** `src/app/(website)/(subpages)/tournament/page.tsx`

**Current implementation:**
- Fetches: `getNavigationTournaments()` → first tournament's UID
- Redirects to `/tournament/{uid}` or `/` if none found

**Required changes:**
```diff
- import { getNavigationTournaments } from "@/cms/queries/tournaments"
+ import { sanityFetch } from "@/sanity/live"
+ import { NAV_TOURNAMENTS_QUERY } from "@/sanity/lib/queries"

- const tournaments = await getNavigationTournaments()
- if (tournaments.length > 0 && tournaments[0].uid) {
-   redirect(`/tournament/${tournaments[0].uid}`)
+ const { data: tournaments } = await sanityFetch({ query: NAV_TOURNAMENTS_QUERY })
+ if (tournaments.length > 0 && tournaments[0].slug?.current) {
+   redirect(`/tournament/${tournaments[0].slug.current}`)
  }
```

---

### 9.10 `tournament/[slug]` — Tournament Hub

**File:** `src/app/(website)/(subpages)/tournament/[slug]/page.tsx`

**Current implementation:**
This is one of the most complex pages. It:

1. Fetches tournament by UID: `getTournamentByUid(slug)`
2. Fetches blogs for tournament: `getBlogsByTournament(tournament.id)`
3. Fetches teams: `getTeamsByTournament(tournament.uid)`
4. Fetches Opta data: F1 fixtures, F3 standings, F30 season stats
5. Fetches F9 feeds for all matches + recap videos
6. Calculates team stat sheets and records from F9 data
7. Extracts awards from tournament document via `isFilled.contentRelationship(award)` and `.data` access on fetchLinks results
8. Fetches 8 broadcast partners by UID individually
9. Renders one of three page variants: `TournamentPageUpcoming`, `TournamentPageLive`, `TournamentPagePast`

**Prismic-specific patterns:**
- `TournamentDocument`, `TeamDocument`, `TournamentDocumentDataAwardsItem` type imports
- `isFilled.contentRelationship(award)` for award filtering
- Complex type gymnastics: `AwardAwardsField`, `AwardData` helper types
- `tournament.data.*` access throughout
- `tournament.uid` for URL building
- `tournament.id` for relationship queries
- `prismicTeams` variable name

**Required changes:**

```diff
- import { getTournamentByUid } from "@/cms/queries/tournaments"
- import { getBlogsByTournament } from "@/cms/queries/blog"
- import { getTeamsByTournament } from "@/cms/queries/team"
- import { getBroadcastPartnerByUid } from "@/cms/queries/broadcast-partners"
- import { isFilled } from "@prismicio/client"
- import type { TeamDocument, TournamentDocumentDataAwardsItem } from "prismicio-types"
- import type * as prismic from "@prismicio/client"
+ import { sanityFetch } from "@/sanity/live"
+ import { TOURNAMENT_BY_SLUG_QUERY, BLOGS_BY_TOURNAMENT_QUERY, BROADCAST_PARTNERS_QUERY } from "@/sanity/lib/queries"

// The GROQ query resolves everything in one call:
+ const { data: tournament } = await sanityFetch({
+   query: TOURNAMENT_BY_SLUG_QUERY,
+   params: { slug }
+ })
// This returns: tournament with matches[]-> (resolved with homeTeam->, awayTeam->, broadcasts[]->),
// awards[]-> (resolved with playerTeam->), teams (via reverse reference), recap->
```

**Awards extraction simplification:**
```diff
// Before: complex fetchLinks + isFilled + type casting
- const awards = tournament.data.awards
-   ?.map(item => item.awards)
-   .filter(award => isFilled.contentRelationship(award))
-   .map(award => award.data)
-   .filter((award): award is NonNullable<AwardData> => !!award) || []

// After: GROQ resolves references directly
+ const awards = tournament.awards || []
// awards is already [{awardTitle, awardSubtitle, playerName, playerTeam: {name, logo, ...}, ...}]
```

**Broadcast partners simplification:**
```diff
// Before: 8 individual fetches by UID
- const [dazn, tnt, truTV, hboMax, vix, tudn, espn, disneyPlus] = await Promise.all([
-   getBroadcastPartnerByUid("dazn"),
-   getBroadcastPartnerByUid("tnt"),
-   // ... 6 more
- ])

// After: Single GROQ query or fetched via match.broadcasts[]-> already resolved
+ const { data: allBroadcastPartners } = await sanityFetch({ query: BROADCAST_PARTNERS_QUERY })
// Or access broadcast partners from already-resolved match data
```

**Variable naming:**
- `prismicTeams` → `teams` (since they're from Sanity now)
- `tournament.uid` → `tournament.slug.current`
- `tournament.id` → `tournament._id`
- All `tournament.data.*` → `tournament.*`

**Page content components** (`page-content-upcoming.tsx`, `page-content-live.tsx`, `page-content-complete.tsx`):
These receive tournament data and Opta data as props. Their internal rendering uses `tournament.data.*` access patterns and Prismic types. Each must be updated:
- `tournament.data.title` → `tournament.title`
- `tournament.data.status` → `tournament.status`
- `TeamDocument` type → Sanity team type
- Any `PrismicRichText` / `PrismicNextImage` usage → Portable Text / Sanity Image

---

### 9.11 `tournament/[slug]/schedule` — Schedule Redirect

**File:** `src/app/(website)/(subpages)/tournament/[slug]/schedule/page.tsx`

**Current:** Fetches tournament, redirects to `/tournament/{slug}` if complete, otherwise to `/tournament/{slug}/tickets#schedule`.

**Changes:** Same query swap as other tournament sub-pages:
- `getTournamentByUid(slug)` → `sanityFetch` with tournament query
- `tournament.data.status` → `tournament.status`

---

### 9.12 `tournament/[slug]/tickets` — Tickets Page

**File:** `src/app/(website)/(subpages)/tournament/[slug]/tickets/page.tsx`

**Current implementation:**
- Fetches tournament, teams, Opta fixtures for games slider
- Passes `TournamentDocument` to `TicketsPageContent`
- `page-content.tsx` uses: `tournament.data.title`, `tournament.data.start_date`, `tournament.data.end_date`, `tournament.data.stadium_name`, `tournament.data.prize_pool`, `tournament.data.tickets_available`, `tournament.data.hero_image`
- Uses `isFilled.number()` for prize pool check
- Uses `getImageUrl()` and `getImageAlt()` from `@/cms/utils`

**Required changes:**
- Same tournament query migration as other sub-pages
- `TicketsPageContent` prop type: `TournamentDocument` → Sanity tournament type
- `tournament.data.*` → `tournament.*`
- `isFilled.number(tournament.data.prize_pool)` → `tournament.prizePool != null`
- `getImageUrl(tournament.data.hero_image)` → `tournament.heroImage ? urlFor(tournament.heroImage).url() : null`
- `tournament.uid` → `tournament.slug.current`

---

### 9.13 `tournament/[slug]/vip-cabanas` — VIP Cabanas Page

**File:** `src/app/(website)/(subpages)/tournament/[slug]/vip-cabanas/page.tsx`

**Current implementation:** Tournament fetch + games slider. Renders VIP form with tournament title. No rich text.

**Changes:** Same tournament query migration pattern. Inline content is static.

---

### 9.14 `tournament/[slug]/know-before-you-go` — KBYG Page

**File:** `src/app/(website)/(subpages)/tournament/[slug]/know-before-you-go/page.tsx`

**Current implementation:**
- `page-content.tsx` renders tournament's `know_before_you_go` rich text field via full inline `PrismicRichText` with comprehensive custom components
- Checks `isFilled.richText(tournament.data.know_before_you_go)`
- Checks `isFilled.link(tournament.data.know_before_you_go_pdf)` for PDF download button

**Required changes:**
```diff
// page-content.tsx:
- import { PrismicRichText } from "@prismicio/react"
- import { isFilled } from "@prismicio/client"
+ import { PortableTextRenderer } from "@/components/portable-text"

// Rich text:
- {isFilled.richText(tournament.data.know_before_you_go) && (
-   <PrismicRichText field={tournament.data.know_before_you_go} components={{...}} />
- )}
+ {tournament.knowBeforeYouGo && (
+   <PortableTextRenderer value={tournament.knowBeforeYouGo} />
+ )}

// PDF link:
- isFilled.link(tournament.data.know_before_you_go_pdf) && tournament.data.know_before_you_go_pdf.link_type === "Media"
+ tournament.knowBeforeYouGoPdf?.asset?.url
```

---

### 9.15 `tournament/[slug]/match/[matchSlug]` — Match Page

**File:** `src/app/(website)/(subpages)/tournament/[slug]/match/[matchSlug]/page.tsx`

**Current implementation:**
The most Opta-heavy page:
1. Fetches tournament + match document from Prismic
2. Fetches 8 Opta feeds in parallel (F1, F2, F3, F9, F13, F24, F40 + highlights)
3. Processes F9 data to find home/away team data
4. Fetches home/away Prismic teams by Opta ID
5. Fetches all broadcast partners + tournament teams + match blogs
6. Heavy data processing for team names, squad data, standings

**Prismic queries used:**
- `getTournamentByUid(tournamentSlug)`
- `getMatchBySlug(matchSlug)`
- `getTeamByOptaId(normalizeOptaId(homeTeamId))`
- `getTeamByOptaId(normalizeOptaId(awayTeamId))`
- `getAllBroadcastPartners()`
- `getTeamsByTournament(tournament.uid)`
- `getBlogsByMatch(match.id)`

**Required changes:**
```diff
// Query swaps:
- getTournamentByUid(tournamentSlug) → sanityFetch with TOURNAMENT_BY_SLUG_QUERY
- getMatchBySlug(matchSlug) → sanityFetch with match by slug query
- getTeamByOptaId(id) → sanityFetch with TEAM_BY_OPTA_ID_QUERY
- getAllBroadcastPartners() → sanityFetch with BROADCAST_PARTNERS_QUERY
- getTeamsByTournament(uid) → sanityFetch with TEAMS_BY_TOURNAMENT_QUERY
- getBlogsByMatch(match.id) → sanityFetch with blogs by match query (using match._id reference)

// Data access:
- match.data.opta_id → match.optaId
- tournament.data.opta_competition_id → tournament.optaCompetitionId
- homeTeamPrismic?.data?.name → homeTeamSanity?.name
- tournament.uid → tournament.slug.current
- tournament.data.nickname → tournament.nickname
- tournament.data.title → tournament.title
```

**Note:** The `MatchPageContent` component receives many props including both Opta and Prismic data. It must be updated to accept Sanity types instead of Prismic `TeamDocument` etc.

---

### 9.16 `club/[slug]` — Club/Team Page

**File:** `src/app/(website)/(subpages)/club/[slug]/page.tsx`

**Current implementation:**
1. Fetches team by UID: `getTeamByUid(slug)`
2. Extracts tournament UIDs from `team.data.tournaments` via `isFilled.contentRelationship(item.tournament)`
3. Fetches first tournament, then Opta data (squads, standings, fixtures, season stats)
4. Fetches all teams by Opta IDs from fixtures
5. Processes F9 feeds for team records/stats
6. Fetches team blogs and remaining tournament documents

**Required changes:**
```diff
- import { getTeamByUid, getTeamsByOptaIds } from "@/cms/queries/team"
- import { isFilled } from "@prismicio/client"
+ import { sanityFetch } from "@/sanity/live"

// Team fetch:
- const team = await getTeamByUid(slug)
+ const { data: team } = await sanityFetch({ query: TEAM_BY_SLUG_QUERY, params: { slug } })

// Tournament UIDs extraction:
// Before: Complex isFilled.contentRelationship + uid extraction from relationship
- const tournamentUids = team.data.tournaments
-   ?.filter((item) => isFilled.contentRelationship(item.tournament))
-   .map((item) => { ... return item.tournament.uid })

// After: GROQ resolves tournaments directly
+ const tournamentUids = team.tournaments?.map(t => t.slug?.current).filter(Boolean) || []
// Or better: GROQ query already includes tournaments[]->{ slug, ... }

// Data access:
- team.data.name → team.name
- team.data.opta_id → team.optaId
- team.data.tournaments → team.tournaments (pre-resolved references)
- team.uid → team.slug.current
- team.id → team._id
```

---

### 9.17 `(home)/page.tsx` — Homepage

**Files:**
- `src/app/(website)/(home)/page.tsx` — server component with data fetching
- `src/app/(website)/(home)/page-content.tsx` — client component with rendering

**Current implementation (page.tsx):**

This is the most data-intensive page (~300 lines of data fetching):

1. `getTournaments()` — all tournaments
2. `getLiveTournament()` — live tournament for games slider
3. For each complete tournament: `getF1Fixtures()` + `getTeamsByTournament()` to find champion
4. `getSocialBlogsByCategory("Tournament Recap")` — featured recap blog
5. For live tournament: fixtures + teams + F9 feeds for games slider
6. `fetchClubListData()` for first 2 tournaments — teams + Opta fixtures for placement
7. `getAllNews()` — recent news posts, custom sorted

**Prismic types used:**
- `TournamentDocument`, `TeamDocument`, `BlogDocument` from `prismicio-types`
- `mapBlogDocumentToMetadata()` for blog transformation

**Required changes (page.tsx):**

The Sanity GROQ query can consolidate much of this:

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
    matches[]->{..., homeTeam->, awayTeam->, broadcasts[]->},
    "teams": *[_type == "team" && references(^._id)]
  },
  "recentNews": *[_type == "blog" && category->slug.current != "press-releases"]
    | order(date desc) [0...4] {
    _id, title, slug, image, date, excerpt, category->, author, _createdAt
  },
  "recapBlog": *[_type == "blog" && category->slug.current == "tournament-recap"]
    | order(date desc) [0] {
    _id, title, slug, image, date, excerpt
  }
}`)

const { data } = await sanityFetch({ query: HOMEPAGE_QUERY })
```

This replaces `getTournaments()`, `getLiveTournament()`, `getSocialBlogsByCategory("Tournament Recap")`, and `getAllNews()` with a single GROQ call.

**Remaining Opta calls** (cannot be replaced by Sanity):
- `getF1Fixtures()` for champion identification (each complete tournament)
- `getF1Fixtures()` for live games slider
- `fetchF9FeedsForMatches()` for live match data
- `fetchClubListData()` for placement maps

**page-content.tsx changes:**
```diff
// Imports:
- import { PrismicLink } from "@prismicio/react"
- import type { TournamentDocument, BlogDocument, TeamDocument } from "prismicio-types"
- import { getImageUrl } from "@/cms/utils"
+ import Link from "next/link"
+ import { urlFor } from "@/sanity/image"
+ // Sanity types for Tournament, Blog, Team

// Data access throughout:
- t.data.hero_image → t.heroImage
- t.data.nickname → t.nickname
- t.data.start_date → t.startDate
- t.data.end_date → t.endDate
- t.data.stadium_name → t.stadiumName
- t.data.prize_pool → t.prizePool
- t.uid → t.slug.current
- getImageUrl(t.data.hero_image) → t.heroImage ? urlFor(t.heroImage).url() : null

// Links:
- <PrismicLink href="/news"><span>All News</span></PrismicLink>
+ <Link href="/news"><span>All News</span></Link>

// TournamentCard component also needs updating to accept Sanity data
```

**`fetchClubListData()` helper function changes:**
```diff
- async function fetchClubListData(tournament: TournamentDocument): Promise<ClubListData> {
-   const teams = await getTeamsByTournament(tournament.uid)
+ async function fetchClubListData(tournament: SanityTournament): Promise<ClubListData> {
+   // Teams are already resolved in the GROQ response
+   const teams = tournament.teams || []

// Data access:
-   a.data.alphabetical_sort_string → a.alphabeticalSortString
-   tournament.data.number_of_teams → tournament.numberOfTeams
-   tournament.data.status → tournament.status
-   tournament.data.opta_competition_id → tournament.optaCompetitionId
-   tournament.data.opta_season_id → tournament.optaSeasonId
-   tournament.uid → tournament.slug.current

// Opta ID matching:
-   team.data.opta_id → team.optaId
```

---

## Appendix A: Common Prismic → Sanity Data Access Patterns

This table covers the most frequently used field access patterns across all pages:

| Prismic Pattern | Sanity Equivalent | Notes |
|----------------|------------------|-------|
| `doc.uid` | `doc.slug.current` | Sanity uses `slug` object |
| `doc.id` | `doc._id` | Document ID |
| `doc.data.field_name` | `doc.fieldName` | No `.data.` wrapper; camelCase |
| `doc.first_publication_date` | `doc._createdAt` | ISO datetime |
| `doc.last_publication_date` | `doc._updatedAt` | ISO datetime |
| `isFilled.image(field)` | `field != null` | Simple null check |
| `isFilled.richText(field)` | `field?.length > 0` | Array check for Portable Text |
| `isFilled.contentRelationship(field)` | `field != null` | GROQ pre-resolves references |
| `isFilled.number(field)` | `field != null` | Simple null check |
| `isFilled.link(field)` | `field?.url != null` or `field?.asset != null` | Depends on link type |
| `field.link_type === "Media"` | `field?.asset?.url` | Sanity file assets |
| `field.link_type === "Web"` | Direct URL string | Sanity uses plain `url` type |
| `PrismicRichText field={...}` | `<PortableTextRenderer value={...} />` | Different renderer |
| `PrismicNextImage field={...}` | `<Image src={urlFor(field).url()} ... />` | Sanity image URL builder |
| `PrismicLink href={...}` | `<Link href={...}>` | Standard Next.js Link |
| `prismic.asText(field)` | Direct string access | Sanity uses plain string fields |

## Appendix B: Files That Need No Changes

These files have zero CMS dependency and remain untouched:

- `src/app/(website)/(subpages)/contact/page-content.tsx` — form component, no CMS
- `src/app/(website)/(subpages)/faqs/section-nav.tsx` — UI component, no CMS
- `src/app/(website)/(subpages)/faqs/categories.ts` — hardcoded data
- `src/app/(website)/(subpages)/checkout/page-content.tsx` — ticketing embed, no CMS
- `src/app/(website)/(subpages)/confirmation/page.tsx` — static content (only Nav/Footer)
- `src/app/(website)/(subpages)/sandbox/**` — dev sandbox pages
- `src/lib/data/faqs.ts` — hardcoded FAQ data
- `src/app/api/opta/**` — Opta API routes
- `src/types/opta-feeds/**` — Opta types
- `src/lib/opta/**` — Opta utilities
- All components in `src/components/ui/` — UI primitives
- `src/components/blocks/hero-slider.tsx` — presentational, no CMS
- `src/components/blocks/testimonial-carousel.tsx` — hardcoded testimonials
- `src/components/blocks/faq-banner-layout.tsx` — layout component
- `src/components/website-base/footer/footer-fast.tsx` — decorative
- `src/components/website-base/footer/privacy-choices-button.tsx` — Ketch integration

## Appendix C: Files To Delete After Migration

| File | Replacement |
|------|------------|
| `src/prismicio.ts` | `src/sanity/client.ts` + `src/sanity/live.ts` |
| `src/cms/client.ts` | `src/sanity/client.ts` |
| `src/cms/slices/` (entire directory) | `src/components/sections/` |
| `src/cms/utils.ts` | `src/sanity/image.ts` |
| `src/components/website-base/prismic-rich-text.tsx` | `src/components/portable-text.tsx` |
| `slicemachine.config.json` | Removed (Sanity doesn't need it) |
| `customtypes/` (entire directory) | `src/sanity/schemas/` |
| `prismicio-types.d.ts` | `src/sanity/types.ts` |

---

*Phase document authored: 2026-02-17*
*Reference: Master plan at `llms/sanity-migration/plan.md` (Sections 12, 14)*
