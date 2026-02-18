# Phase 5: Content Migration Scripts

## Table of Contents

1. [Migration Script Architecture](#1-migration-script-architecture)
2. [Prismic Export Client](#2-prismic-export-client)
3. [Sanity Import Client](#3-sanity-import-client)
4. [ID Mapping Strategy](#4-id-mapping-strategy)
5. [Transformer Functions](#5-transformer-functions)
6. [Rich Text Converter](#6-rich-text-converter)
7. [Image Migration](#7-image-migration)
8. [Migration Order & Dependencies](#8-migration-order--dependencies)
9. [Verification Scripts](#9-verification-scripts)
10. [Rollback Strategy](#10-rollback-strategy)
11. [Delta Migration](#11-delta-migration)

---

## 1. Migration Script Architecture

### 1.1 Folder Structure

```
scripts/
  migrate.ts                    # Main orchestrator — entry point
  verify.ts                     # Post-migration verification
  rollback.ts                   # Delete all migrated content
  delta.ts                      # Re-migrate changed content only
  prismic-client.ts             # Prismic REST API client
  sanity-client.ts              # Sanity mutation client
  transformers/
    blog-tag.ts                 # Seed blogTag documents from Prismic categories
    broadcast-partner.ts
    sponsor.ts
    team.ts
    player.ts
    tournament.ts
    match.ts
    award.ts
    team-member.ts
    policy.ts
    blog.ts
    page.ts
    site-settings.ts
  utils/
    id-map.ts                   # Prismic ID -> Sanity ID mapping
    image-upload.ts             # Download Prismic images -> upload to Sanity
    rich-text-converter.ts      # StructuredText -> Portable Text
    section-converter.ts        # Prismic SliceZone -> Sanity sections array
    logger.ts                   # Structured logging
    keys.ts                     # Unique key generation
```

### 1.2 Dependencies

```bash
npm install -D tsx @prismicio/client @sanity/client dotenv
```

### 1.3 Environment Variables

Create `scripts/.env`:

```env
# Prismic (read-only access)
PRISMIC_REPOSITORY=world-sevens-football

# Sanity (write access)
SANITY_PROJECT_ID=<your-project-id>
SANITY_DATASET=production
SANITY_API_TOKEN=<write-token>
SANITY_API_VERSION=2025-03-04
```

### 1.4 Entry Point

Run the migration:

```bash
npx tsx scripts/migrate.ts
```

Run with a specific phase:

```bash
npx tsx scripts/migrate.ts --only=blogTags,broadcastPartners
npx tsx scripts/migrate.ts --only=blogs
npx tsx scripts/migrate.ts --dry-run
```

### 1.5 Main Orchestrator

```typescript
// scripts/migrate.ts
import 'dotenv/config'
import { fetchAllPrismicDocuments } from './prismic-client'
import { sanityClient, commitBatch } from './sanity-client'
import { seedBlogTags, BLOG_TAG_MAP } from './transformers/blog-tag'
import { transformBroadcastPartner } from './transformers/broadcast-partner'
import { transformSponsor } from './transformers/sponsor'
import { transformTeam } from './transformers/team'
import { transformPlayer } from './transformers/player'
import { transformTournament } from './transformers/tournament'
import { transformMatch } from './transformers/match'
import { transformAward } from './transformers/award'
import { transformTeamMember } from './transformers/team-member'
import { transformPolicy } from './transformers/policy'
import { transformBlog } from './transformers/blog'
import { transformPage } from './transformers/page'
import { transformSiteSettings } from './transformers/site-settings'
import { imageCache } from './utils/image-upload'
import { log } from './utils/logger'

interface MigrationStep {
  name: string
  prismicType?: string
  transform: (docs: any[]) => Promise<any[]>
}

const BATCH_SIZE = 50

async function migrateType(
  step: MigrationStep,
  allDocs: Map<string, any[]>,
  dryRun: boolean
): Promise<number> {
  log.info(`\n--- Migrating: ${step.name} ---`)

  let sanityDocs: any[]

  if (step.prismicType) {
    const prismicDocs = allDocs.get(step.prismicType) ?? []
    log.info(`  Prismic documents found: ${prismicDocs.length}`)
    sanityDocs = await step.transform(prismicDocs)
  } else {
    // No Prismic type — e.g., blogTags are seeded, siteSettings is a singleton
    sanityDocs = await step.transform([])
  }

  log.info(`  Sanity documents to write: ${sanityDocs.length}`)

  if (dryRun) {
    sanityDocs.slice(0, 2).forEach((doc) => {
      log.info(`  [DRY RUN] Would write: ${doc._id} (${doc._type})`)
    })
    return sanityDocs.length
  }

  // Write in batches
  for (let i = 0; i < sanityDocs.length; i += BATCH_SIZE) {
    const batch = sanityDocs.slice(i, i + BATCH_SIZE)
    await commitBatch(batch)
    log.info(
      `  Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(sanityDocs.length / BATCH_SIZE)} committed (${batch.length} docs)`
    )
  }

  return sanityDocs.length
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const onlyArg = args.find((a) => a.startsWith('--only='))
  const onlyTypes = onlyArg
    ? onlyArg.replace('--only=', '').split(',')
    : null

  log.info('=== W7F Prismic -> Sanity Content Migration ===')
  log.info(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`)
  if (onlyTypes) log.info(`Only: ${onlyTypes.join(', ')}`)

  // Step 1: Fetch all Prismic documents
  log.info('\nFetching all Prismic documents...')
  const allDocs = await fetchAllPrismicDocuments()
  log.info(
    `Total Prismic documents: ${Array.from(allDocs.values()).reduce((sum, docs) => sum + docs.length, 0)}`
  )
  for (const [type, docs] of allDocs) {
    log.info(`  ${type}: ${docs.length}`)
  }

  // Step 2: Run migration steps in dependency order
  const steps: MigrationStep[] = [
    {
      name: 'blogTags',
      transform: async () => seedBlogTags(),
    },
    {
      name: 'broadcastPartners',
      prismicType: 'broadcast_partners',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformBroadcastPartner(doc))
        }
        return results
      },
    },
    {
      name: 'sponsors',
      prismicType: 'sponsor',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformSponsor(doc))
        }
        return results
      },
    },
    {
      name: 'teams',
      prismicType: 'team',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformTeam(doc))
        }
        return results
      },
    },
    {
      name: 'players',
      prismicType: 'player',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformPlayer(doc))
        }
        return results
      },
    },
    {
      name: 'tournaments',
      prismicType: 'tournament',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformTournament(doc))
        }
        return results
      },
    },
    {
      name: 'matches',
      prismicType: 'match',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformMatch(doc))
        }
        return results
      },
    },
    {
      name: 'awards',
      prismicType: 'awards',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformAward(doc))
        }
        return results
      },
    },
    {
      name: 'teamMembers',
      prismicType: 'team_member',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformTeamMember(doc))
        }
        return results
      },
    },
    {
      name: 'policies',
      prismicType: 'policy',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformPolicy(doc))
        }
        return results
      },
    },
    {
      name: 'blogs',
      prismicType: 'blog',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformBlog(doc))
        }
        return results
      },
    },
    {
      name: 'pages',
      prismicType: 'page',
      transform: async (docs) => {
        const results: any[] = []
        for (const doc of docs) {
          results.push(await transformPage(doc))
        }
        return results
      },
    },
    {
      name: 'siteSettings',
      prismicType: 'website',
      transform: async (docs) => {
        if (docs.length === 0) return []
        return [await transformSiteSettings(docs[0])]
      },
    },
  ]

  const filteredSteps = onlyTypes
    ? steps.filter((s) => onlyTypes.includes(s.name))
    : steps

  const totals: Record<string, number> = {}

  for (const step of filteredSteps) {
    try {
      totals[step.name] = await migrateType(step, allDocs, dryRun)
    } catch (err) {
      log.error(`FAILED: ${step.name}`, err)
      throw err
    }
  }

  // Summary
  log.info('\n=== Migration Complete ===')
  for (const [name, count] of Object.entries(totals)) {
    log.info(`  ${name}: ${count} documents`)
  }
  log.info(
    `  Images uploaded: ${imageCache.size} (cached, no duplicates)`
  )
}

main().catch((err) => {
  log.error('Migration failed', err)
  process.exit(1)
})
```

---

## 2. Prismic Export Client

```typescript
// scripts/prismic-client.ts
import * as prismic from '@prismicio/client'
import { log } from './utils/logger'

const PRISMIC_TYPES = [
  'tournament',
  'blog',
  'team',
  'match',
  'player',
  'team_member',
  'broadcast_partners',
  'sponsor',
  'awards',
  'policy',
  'page',
  'website',
  // NOT migrated: 'testimonial', 'image_with_text'
] as const

const client = prismic.createClient(
  process.env.PRISMIC_REPOSITORY || 'world-sevens-football',
  {
    // Use fetch links to resolve one level of relationships
    // Migration scripts resolve references manually via ID mapping,
    // so we don't need deep fetchLinks here — just the raw documents
  }
)

/**
 * Fetches ALL documents from Prismic, grouped by type.
 *
 * Uses `getAllByType` which handles pagination automatically
 * (100 docs per page, follows `next_page` links).
 *
 * Prismic rate limit: 200 req/min on the master ref.
 * getAllByType makes ceil(n/100) requests per type, so for
 * ~500 total documents this is about 12-15 requests — well within limits.
 */
export async function fetchAllPrismicDocuments(): Promise<
  Map<string, any[]>
> {
  const docsByType = new Map<string, any[]>()

  for (const type of PRISMIC_TYPES) {
    log.info(`  Fetching ${type}...`)
    try {
      const docs = await client.getAllByType(type)
      docsByType.set(type, docs)
      log.info(`    -> ${docs.length} documents`)
    } catch (err: any) {
      // Some types might have 0 documents — that's fine
      if (err?.message?.includes('No documents')) {
        docsByType.set(type, [])
        log.info(`    -> 0 documents`)
      } else {
        throw err
      }
    }

    // Small delay between types to be polite to Prismic API
    await sleep(200)
  }

  return docsByType
}

/**
 * Fetch a single document by ID. Used for resolving
 * content relationships during transformation when needed.
 */
export async function fetchPrismicDocById(
  id: string
): Promise<any | null> {
  try {
    return await client.getByID(id)
  } catch {
    return null
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

---

## 3. Sanity Import Client

```typescript
// scripts/sanity-client.ts
import { createClient, type SanityClient } from '@sanity/client'
import { log } from './utils/logger'

export const sanityClient: SanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: process.env.SANITY_API_VERSION || '2025-03-04',
  useCdn: false, // Mutations require the live API, not CDN
})

/**
 * Commit a batch of documents using a single transaction.
 *
 * Uses `createOrReplace` so the script is idempotent — running it
 * again overwrites existing documents rather than failing on conflicts.
 *
 * `visibility: 'deferred'` batches index updates for better throughput
 * on bulk imports. Documents are fully committed but search index updates
 * are batched. This is recommended for migrations.
 */
export async function commitBatch(docs: any[]): Promise<void> {
  if (docs.length === 0) return

  const tx = sanityClient.transaction()

  for (const doc of docs) {
    tx.createOrReplace(doc)
  }

  await tx.commit({ visibility: 'deferred' })
}

/**
 * Delete all documents of a given type.
 * Used by rollback and re-migration scripts.
 */
export async function deleteAllOfType(type: string): Promise<number> {
  const query = `*[_type == "${type}"]{ _id }`
  const docs = await sanityClient.fetch<{ _id: string }[]>(query)

  if (docs.length === 0) {
    log.info(`  No ${type} documents to delete`)
    return 0
  }

  // Delete in batches of 50
  for (let i = 0; i < docs.length; i += 50) {
    const batch = docs.slice(i, i + 50)
    const tx = sanityClient.transaction()
    for (const doc of batch) {
      tx.delete(doc._id)
    }
    await tx.commit()
  }

  log.info(`  Deleted ${docs.length} ${type} documents`)
  return docs.length
}

/**
 * Fetch a single document from Sanity by ID.
 * Used by verification scripts.
 */
export async function fetchSanityDoc(id: string): Promise<any | null> {
  return sanityClient.getDocument(id)
}
```

---

## 4. ID Mapping Strategy

### 4.1 Design

Every Prismic document gets a **deterministic** Sanity `_id` based on its type and a human-readable identifier. This means:

- **Idempotent migrations** — running the script twice produces the same IDs, so `createOrReplace` overwrites cleanly
- **Forward references** — we can compute a reference target's `_id` before that target has been created
- **Debuggable** — IDs like `tournament-fort-lauderdale-2025` are readable in Sanity Studio

### 4.2 ID Rules by Type

| Prismic Type | Has UID? | Sanity ID Pattern | Example |
|---|---|---|---|
| `tournament` | Yes | `tournament-{uid}` | `tournament-fort-lauderdale-2025` |
| `blog` | Yes | `blog-{uid}` | `blog-season-3-recap` |
| `match` | Yes | `match-{uid}` | `match-usa-vs-fiji` |
| `team_member` | Yes | `teamMember-{uid}` | `teamMember-john-smith` |
| `policy` | Yes | `policy-{uid}` | `policy-privacy-policy` |
| `page` | Yes | `page-{uid}` | `page-about` |
| `team` | No | `team-{slugify(name)}` | `team-united-states` |
| `player` | No | `player-{slugify(firstName-lastName)}` | `player-john-doe` |
| `broadcast_partners` | No | `broadcastPartner-{slugify(name)}` | `broadcastPartner-espn` |
| `sponsor` | No | `sponsor-{slugify(name)}` | `sponsor-nike` |
| `awards` | No | `award-{prismicId}` | `award-YxKz1REAACYA1234` |
| `website` | No | `siteSettings` (singleton) | `siteSettings` |
| `blogTag` | N/A | `blogTag-{slug}` | `blogTag-tournament-recap` |

### 4.3 Implementation

```typescript
// scripts/utils/id-map.ts

/**
 * Deterministic ID generation for Prismic -> Sanity mapping.
 *
 * Prismic documents with UIDs use their UID directly.
 * Documents without UIDs use a slugified version of a meaningful field,
 * or fall back to the Prismic document ID.
 */

const idMap = new Map<string, string>()

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 96) // Sanity IDs have a 128-char limit
}

/**
 * Generate a deterministic Sanity _id for a Prismic document.
 * Also registers the mapping for later reference resolution.
 */
export function sanityId(doc: {
  id: string
  uid?: string | null
  type: string
  data: any
}): string {
  const sanityType = PRISMIC_TO_SANITY_TYPE[doc.type] ?? doc.type

  let id: string

  if (doc.uid) {
    // Page-format documents have UIDs
    id = `${sanityType}-${doc.uid}`
  } else {
    // Custom-format documents — use a meaningful field
    switch (doc.type) {
      case 'team':
        id = `team-${slugify(doc.data.name || doc.id)}`
        break
      case 'player':
        id = `player-${slugify(`${doc.data.first_name || ''}-${doc.data.last_name || ''}`.trim() || doc.id)}`
        break
      case 'broadcast_partners':
        id = `broadcastPartner-${slugify(doc.data.name || doc.id)}`
        break
      case 'sponsor':
        id = `sponsor-${slugify(doc.data.name || doc.id)}`
        break
      case 'awards':
        // Awards don't have a reliably unique name field
        id = `award-${doc.id}`
        break
      case 'website':
        id = 'siteSettings'
        break
      default:
        id = `${sanityType}-${doc.id}`
    }
  }

  // Register the mapping (Prismic document ID -> Sanity _id)
  idMap.set(doc.id, id)

  return id
}

/**
 * Look up a previously registered Sanity ID from a Prismic document ID.
 * Used when resolving content relationship Links.
 */
export function lookupSanityId(prismicDocId: string): string | null {
  return idMap.get(prismicDocId) ?? null
}

/**
 * Resolve a Prismic Link field to a Sanity reference.
 * Returns null if the link is empty or broken.
 *
 * Prismic Link fields look like:
 *   { link_type: "Document", id: "YxKz1REA...", type: "team", uid: "...", ... }
 *   or { link_type: "Any" } when empty
 */
export function toSanityRef(
  link: any
): { _type: 'reference'; _ref: string } | null {
  if (!link || link.link_type !== 'Document' || !link.id) {
    return null
  }

  // Try the lookup table first (for already-processed documents)
  const existing = lookupSanityId(link.id)
  if (existing) {
    return { _type: 'reference', _ref: existing }
  }

  // Compute the ID deterministically from the link data
  const sanityType = PRISMIC_TO_SANITY_TYPE[link.type] ?? link.type

  let ref: string
  if (link.uid) {
    ref = `${sanityType}-${link.uid}`
  } else {
    // For types without UIDs, we must fall back to Prismic ID
    // This works because the target document's transformer uses the same logic
    ref = `${sanityType}-${link.id}`
  }

  return { _type: 'reference', _ref: ref }
}

/**
 * Map Prismic type names to Sanity type names.
 */
const PRISMIC_TO_SANITY_TYPE: Record<string, string> = {
  tournament: 'tournament',
  blog: 'blog',
  team: 'team',
  match: 'match',
  player: 'player',
  team_member: 'teamMember',
  broadcast_partners: 'broadcastPartner',
  sponsor: 'sponsor',
  awards: 'award',
  policy: 'policy',
  page: 'page',
  website: 'siteSettings',
}

export { idMap }
```

---

## 5. Transformer Functions

Each transformer takes a raw Prismic document and returns a Sanity document ready for `createOrReplace`. All transformers follow the same pattern:

1. Compute the deterministic `_id` via `sanityId()`
2. Map fields from `doc.data.*` (Prismic) to flat Sanity fields
3. Convert references via `toSanityRef()`
4. Convert images via `uploadImage()`
5. Convert rich text via `prismicToPortableText()`

### 5.1 Blog Tags (seeded, not transformed)

```typescript
// scripts/transformers/blog-tag.ts
import { slugify } from '../utils/id-map'

/**
 * Prismic uses a hardcoded Select field for blog categories:
 *   "Announcements" | "Tournament Recap" | "Match Recap" |
 *   "Social Impact" | "Match Day Preview" | "Press Releases" | "Youth Events"
 *
 * In Sanity, these become `blogTag` documents that blog posts reference.
 * This seeder creates one blogTag per Prismic category value.
 */

const PRISMIC_CATEGORIES = [
  'Announcements',
  'Tournament Recap',
  'Match Recap',
  'Social Impact',
  'Match Day Preview',
  'Press Releases',
  'Youth Events',
] as const

/**
 * Pre-computed map: Prismic category string -> Sanity blogTag _id
 * Used by the blog transformer to resolve category -> tag references.
 */
export const BLOG_TAG_MAP: Record<string, string> = {}

for (const cat of PRISMIC_CATEGORIES) {
  const slug = slugify(cat)
  BLOG_TAG_MAP[cat] = `blogTag-${slug}`
}

export function seedBlogTags(): any[] {
  return PRISMIC_CATEGORIES.map((cat) => {
    const slug = slugify(cat)
    return {
      _id: `blogTag-${slug}`,
      _type: 'blogTag',
      name: cat,
      slug: { _type: 'slug', current: slug },
      description: '',
    }
  })
}
```

### 5.2 Broadcast Partner

```typescript
// scripts/transformers/broadcast-partner.ts
import { sanityId } from '../utils/id-map'
import { uploadImage } from '../utils/image-upload'

export async function transformBroadcastPartner(doc: any): Promise<any> {
  const d = doc.data

  return {
    _id: sanityId(doc),
    _type: 'broadcastPartner',
    name: d.name || '',
    slug: {
      _type: 'slug',
      current: d.name
        ? d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : doc.id,
    },
    logo: await uploadImage(d.logo),
    logoWhite: await uploadImage(d.logo_white),
    iconLogo: await uploadImage(d.icon_logo),
    logoOnPrimary: await uploadImage(d.logo_on_primary),
    colorPrimary: d.color_primary || '',
    colorSecondary: d.color_secondary || '',
    streamingLink: d.streaming_link || '',
  }
}
```

### 5.3 Sponsor

```typescript
// scripts/transformers/sponsor.ts
import { sanityId } from '../utils/id-map'
import { uploadImage } from '../utils/image-upload'

export async function transformSponsor(doc: any): Promise<any> {
  const d = doc.data

  return {
    _id: sanityId(doc),
    _type: 'sponsor',
    name: d.name || '',
    slug: {
      _type: 'slug',
      current: d.name
        ? d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : doc.id,
    },
    logo: await uploadImage(d.logo),
    colorPrimary: d.color_primary || '',
    colorSecondary: d.color_secondary || '',
    websiteLink: d.website_link?.url || '',
    // Prismic stores sort_order as Text, Sanity expects Number
    sortOrder: d.sort_order ? parseInt(d.sort_order, 10) : undefined,
    visibility: d.visibility ?? true,
  }
}
```

### 5.4 Team

```typescript
// scripts/transformers/team.ts
import { sanityId, toSanityRef } from '../utils/id-map'
import { uploadImage } from '../utils/image-upload'

export async function transformTeam(doc: any): Promise<any> {
  const d = doc.data

  // Resolve tournament references from the repeatable Group field
  const tournaments: any[] = []
  if (Array.isArray(d.tournaments)) {
    for (const item of d.tournaments) {
      const ref = toSanityRef(item.tournament)
      if (ref) tournaments.push(ref)
    }
  }

  return {
    _id: sanityId(doc),
    _type: 'team',
    name: d.name || '',
    slug: {
      _type: 'slug',
      current: d.name
        ? d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
        : doc.id,
    },
    optaId: d.opta_id || '',
    key: d.key || '',
    country: d.country || '',
    countryCode: d.country_code || '',
    logo: await uploadImage(d.logo),
    // Prismic stores colors as Text strings (e.g., "#FF0000")
    // Sanity color type expects { _type: 'color', hex: '#FF0000' }
    colorPrimary: d.color_primary
      ? { _type: 'color', hex: d.color_primary }
      : undefined,
    colorSecondary: d.color_secondary
      ? { _type: 'color', hex: d.color_secondary }
      : undefined,
    alphabeticalSortString: d.alphabetical_sort_string || '',
    tournaments,
    group: d.group || undefined,
  }
}
```

### 5.5 Player

```typescript
// scripts/transformers/player.ts
import { sanityId, toSanityRef } from '../utils/id-map'
import { uploadImage } from '../utils/image-upload'

export async function transformPlayer(doc: any): Promise<any> {
  const d = doc.data

  return {
    _id: sanityId(doc),
    _type: 'player',
    firstName: d.first_name || '',
    lastName: d.last_name || '',
    slug: {
      _type: 'slug',
      current: `${d.first_name || ''}-${d.last_name || ''}`
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || doc.id,
    },
    optaId: d.opta_id || '',
    headshot: await uploadImage(d.headshot),
    team: toSanityRef(d.team) ?? undefined,
  }
}
```

### 5.6 Tournament

```typescript
// scripts/transformers/tournament.ts
import { sanityId, toSanityRef } from '../utils/id-map'
import { uploadImage, uploadFile } from '../utils/image-upload'
import { prismicToPortableText } from '../utils/rich-text-converter'

export async function transformTournament(doc: any): Promise<any> {
  const d = doc.data

  // Resolve match references from Group field
  const matches: any[] = []
  if (Array.isArray(d.matches)) {
    for (const item of d.matches) {
      const ref = toSanityRef(item.match)
      if (ref) matches.push(ref)
    }
  }

  // Resolve award references from Group field
  const awards: any[] = []
  if (Array.isArray(d.awards)) {
    for (const item of d.awards) {
      const ref = toSanityRef(item.awards)
      if (ref) awards.push(ref)
    }
  }

  return {
    _id: sanityId(doc),
    _type: 'tournament',
    title: d.title || '',
    slug: { _type: 'slug', current: doc.uid },
    nickname: d.nickname || '',
    status: d.status || 'Upcoming',
    featured: d.featured ?? false,
    prizePool: d.prize_pool ?? undefined,
    countryCode: d.country_code || '',
    stadiumName: d.stadium_name || '',
    startDate: d.start_date || undefined,
    endDate: d.end_date || undefined,
    numberOfTeams: d.number_of_teams ?? undefined,
    ticketsAvailable: d.tickets_available ?? false,

    // Media
    heroImage: await uploadImage(d.hero_image),
    highlightReelLink: d.highlight_reel_link || '',

    // Opta
    optaCompetitionId: d.opta_competition_id || '',
    optaSeasonId: d.opta_season_id || '',
    optaEnabled: d.opta_enabled ?? false,

    // Relationships
    matches,
    awards,
    recap: toSanityRef(d.recap) ?? undefined,

    // Content
    knowBeforeYouGo: d.know_before_you_go
      ? await prismicToPortableText(d.know_before_you_go)
      : undefined,
    knowBeforeYouGoPdf: await uploadFile(d.know_before_you_go_pdf),

    // Navigation
    showInNavigation: d.show_in_navigation ?? false,
    navigationOrder: d.navigation_order ?? undefined,
    navImage: await uploadImage(d.nav_image),
    navigationDescription: d.navigation_description || '',
  }
}
```

### 5.7 Match

```typescript
// scripts/transformers/match.ts
import { sanityId, toSanityRef } from '../utils/id-map'

export async function transformMatch(doc: any): Promise<any> {
  const d = doc.data

  // Resolve broadcast partner references from Group field
  const broadcasts: any[] = []
  if (Array.isArray(d.broadcasts)) {
    for (const item of d.broadcasts) {
      const ref = toSanityRef(item.streaming_service)
      if (ref) broadcasts.push(ref)
    }
  }

  return {
    _id: sanityId(doc),
    _type: 'match',
    slug: { _type: 'slug', current: doc.uid },
    optaId: d.opta_id || '',
    tournament: toSanityRef(d.tournament) ?? undefined,
    matchNumber: d.match_number ?? undefined,
    homeTeam: toSanityRef(d.home_team) ?? undefined,
    homeTeamNameOverride: d.home_team_name_override || '',
    awayTeam: toSanityRef(d.away_team) ?? undefined,
    awayTeamNameOverride: d.away_team_name_override || '',
    // Prismic Date + time -> Sanity datetime
    // Prismic stores start_time as a Timestamp field (ISO string)
    startTime: d.start_time || undefined,
    stage: d.stage || undefined,
    knockoutStageMatchType: d.knockout_stage_match_type || undefined,
    broadcasts,
  }
}
```

### 5.8 Award

```typescript
// scripts/transformers/award.ts
import { sanityId, toSanityRef } from '../utils/id-map'
import { uploadImage } from '../utils/image-upload'

export async function transformAward(doc: any): Promise<any> {
  const d = doc.data

  return {
    _id: sanityId(doc),
    _type: 'award',
    awardTitle: d.award_title || '',
    awardSubtitle: d.award_subtitle || '',
    playerName: d.player_name || '',
    playerTeam: toSanityRef(d.player_team) ?? undefined,
    playerHeadshot: await uploadImage(d.player_headshot),
    // Prismic stores sort_order as Text, Sanity expects Number
    sortOrder: d.sort_order ? parseInt(d.sort_order, 10) : undefined,
  }
}
```

### 5.9 Team Member

```typescript
// scripts/transformers/team-member.ts
import { sanityId } from '../utils/id-map'
import { uploadImage } from '../utils/image-upload'
import { prismicToPortableText } from '../utils/rich-text-converter'

export async function transformTeamMember(doc: any): Promise<any> {
  const d = doc.data

  return {
    _id: sanityId(doc),
    _type: 'teamMember',
    name: d.name || '',
    slug: { _type: 'slug', current: doc.uid },
    role: d.role || '',
    headshot: await uploadImage(d.headshot),
    bio: d.bio ? await prismicToPortableText(d.bio) : undefined,
    displayOrder: d.display_order ?? undefined,
    department: d.department || undefined,
  }
}
```

### 5.10 Policy

```typescript
// scripts/transformers/policy.ts
import { sanityId } from '../utils/id-map'
import { prismicToPortableText } from '../utils/rich-text-converter'
import { uploadFile } from '../utils/image-upload'

export async function transformPolicy(doc: any): Promise<any> {
  const d = doc.data

  return {
    _id: sanityId(doc),
    _type: 'policy',
    name: d.title || d.name || '',
    slug: { _type: 'slug', current: doc.uid },
    body: d.body ? await prismicToPortableText(d.body) : undefined,
    pdf: await uploadFile(d.pdf),
    hideFromNav: d.hide_from_nav ?? false,
    navOrder: d.order ?? undefined,
  }
}
```

### 5.11 Blog

```typescript
// scripts/transformers/blog.ts
import { sanityId, toSanityRef } from '../utils/id-map'
import { uploadImage } from '../utils/image-upload'
import { prismicToPortableText } from '../utils/rich-text-converter'
import { convertSliceZone } from '../utils/section-converter'
import { BLOG_TAG_MAP } from './blog-tag'

export async function transformBlog(doc: any): Promise<any> {
  const d = doc.data

  // Resolve match references from Group field
  const matchRefs: any[] = []
  if (Array.isArray(d.matches)) {
    for (const item of d.matches) {
      const ref = toSanityRef(item.match)
      if (ref) matchRefs.push(ref)
    }
  }

  // Resolve team references from Group field
  const teamRefs: any[] = []
  if (Array.isArray(d.teams)) {
    for (const item of d.teams) {
      const ref = toSanityRef(item.team)
      if (ref) teamRefs.push(ref)
    }
  }

  // Map Prismic Select category to blogTag reference(s)
  // Prismic stores a single category string; Sanity uses an array of tag references
  const tags: any[] = []
  if (d.category && BLOG_TAG_MAP[d.category]) {
    tags.push({
      _type: 'reference',
      _ref: BLOG_TAG_MAP[d.category],
      _key: BLOG_TAG_MAP[d.category], // _key required for array items
    })
  }

  // Convert SliceZone sections if present
  const sections = d.slices?.length
    ? await convertSliceZone(d.slices)
    : undefined

  return {
    _id: sanityId(doc),
    _type: 'blog',
    title: d.title || '',
    slug: { _type: 'slug', current: doc.uid },
    image: await uploadImage(d.image),
    tags,
    date: d.date || undefined,
    author: d.author || '',
    excerpt: d.excerpt || '',
    content: d.content
      ? await prismicToPortableText(d.content)
      : undefined,
    tournament: toSanityRef(d.tournament) ?? undefined,
    matches: matchRefs.length > 0 ? matchRefs : undefined,
    teams: teamRefs.length > 0 ? teamRefs : undefined,
    sections: sections?.length ? sections : undefined,
  }
}
```

### 5.12 Page

```typescript
// scripts/transformers/page.ts
import { sanityId } from '../utils/id-map'
import { convertSliceZone } from '../utils/section-converter'

export async function transformPage(doc: any): Promise<any> {
  const d = doc.data

  const sections = d.slices?.length
    ? await convertSliceZone(d.slices)
    : []

  return {
    _id: sanityId(doc),
    _type: 'page',
    title: d.title || doc.uid || '',
    slug: { _type: 'slug', current: doc.uid },
    sections,
    // SEO: Prismic pages may have meta_title / meta_description
    seo: d.meta_title || d.meta_description || d.meta_image
      ? {
          _type: 'seo',
          metaTitle: d.meta_title || '',
          metaDescription: d.meta_description || '',
          metaImage: d.meta_image?.url
            ? await (async () => {
                const { uploadImage } = await import('../utils/image-upload')
                return uploadImage(d.meta_image)
              })()
            : undefined,
        }
      : undefined,
  }
}
```

### 5.13 Site Settings (singleton)

```typescript
// scripts/transformers/site-settings.ts
import { toSanityRef } from '../utils/id-map'

export async function transformSiteSettings(doc: any): Promise<any> {
  const d = doc.data

  // Resolve where-to-watch broadcast partner references
  const whereToWatchPartners: any[] = []
  if (Array.isArray(d.where_to_watch_partners)) {
    for (const item of d.where_to_watch_partners) {
      const ref = toSanityRef(item.broadcast_partner)
      if (ref) whereToWatchPartners.push(ref)
    }
  }

  // Convert footer menus (nested Group structure)
  const footerMenus: any[] = []
  if (Array.isArray(d.footer_menus)) {
    for (const menu of d.footer_menus) {
      const links: any[] = []
      if (Array.isArray(menu.menu_links)) {
        for (const link of menu.menu_links) {
          links.push({
            _type: 'object',
            _key: `link-${links.length}`,
            linkText: link.link_text || '',
            linkUrl: link.link_url || '',
            isExternal: link.is_external ?? false,
          })
        }
      }
      footerMenus.push({
        _type: 'footerMenu',
        _key: `menu-${footerMenus.length}`,
        menuTitle: menu.menu_title || '',
        links,
      })
    }
  }

  return {
    _id: 'siteSettings',
    _type: 'siteSettings',
    moreInfoMode: d.more_info_mode || 'Recent News',
    whereToWatchPartners,
    footerMenus,
  }
}
```

---

## 6. Rich Text Converter

### 6.1 Prismic StructuredText Format

Prismic's StructuredText is an array of block-level nodes:

```typescript
type PrismicRichTextNode = {
  type:
    | 'paragraph'
    | 'heading1' | 'heading2' | 'heading3'
    | 'heading4' | 'heading5' | 'heading6'
    | 'preformatted'
    | 'list-item'
    | 'o-list-item'
    | 'image'
    | 'embed'
  text?: string
  spans?: PrismicSpan[]
  url?: string       // image URL
  alt?: string       // image alt text
  dimensions?: { width: number; height: number }
  oembed?: {         // for embeds
    embed_url: string
    type: string
    title?: string
    thumbnail_url?: string
  }
}

type PrismicSpan = {
  start: number
  end: number
  type: 'strong' | 'em' | 'hyperlink'
  data?: {
    url?: string
    target?: string
    link_type?: string
  }
}
```

### 6.2 Sanity Portable Text Target Format

```typescript
type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote'
  children: PortableTextSpan[]
  markDefs: PortableTextMarkDef[]
  listItem?: 'bullet' | 'number'
  level?: number
}

type PortableTextSpan = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]  // references to markDef _keys, or decorator names
}

type PortableTextMarkDef = {
  _type: 'link'
  _key: string
  href: string
  openInNewTab: boolean
}
```

### 6.3 Complete Implementation

```typescript
// scripts/utils/rich-text-converter.ts
import { generateKey } from './keys'
import { uploadImage } from './image-upload'

/**
 * Convert Prismic StructuredText to Sanity Portable Text.
 *
 * Handles:
 * - Paragraphs, headings (h1-h6), preformatted, blockquote
 * - Bold, italic, hyperlink spans with proper mark splitting
 * - Bullet and numbered lists
 * - Embedded images (downloaded and re-uploaded to Sanity)
 * - Embedded videos/oembeds
 * - Empty blocks (filtered out)
 * - Nested/overlapping marks (properly split at boundaries)
 */
export async function prismicToPortableText(
  nodes: any[]
): Promise<any[]> {
  if (!nodes || !Array.isArray(nodes) || nodes.length === 0) {
    return []
  }

  const blocks: any[] = []

  for (const node of nodes) {
    const converted = await convertNode(node)
    if (converted) {
      if (Array.isArray(converted)) {
        blocks.push(...converted)
      } else {
        blocks.push(converted)
      }
    }
  }

  return blocks
}

async function convertNode(node: any): Promise<any | any[] | null> {
  switch (node.type) {
    case 'paragraph':
      return convertTextBlock(node, 'normal')
    case 'heading1':
      return convertTextBlock(node, 'h1')
    case 'heading2':
      return convertTextBlock(node, 'h2')
    case 'heading3':
      return convertTextBlock(node, 'h3')
    case 'heading4':
      return convertTextBlock(node, 'h4')
    case 'heading5':
      // Sanity portableText schema doesn't include h5/h6 — downgrade to h4
      return convertTextBlock(node, 'h4')
    case 'heading6':
      return convertTextBlock(node, 'h4')
    case 'preformatted':
      return convertTextBlock(node, 'normal')
    case 'list-item':
      return convertListItem(node, 'bullet')
    case 'o-list-item':
      return convertListItem(node, 'number')
    case 'image':
      return convertImage(node)
    case 'embed':
      return convertEmbed(node)
    default:
      // Unknown node type — skip
      return null
  }
}

/**
 * Convert a text block (paragraph, heading, etc.) with spans.
 */
function convertTextBlock(
  node: any,
  style: string
): any | null {
  const text = node.text || ''
  const spans = node.spans || []

  // Skip completely empty blocks
  if (text === '' && spans.length === 0) {
    return null
  }

  const { children, markDefs } = convertSpans(text, spans)

  return {
    _type: 'block',
    _key: generateKey(),
    style,
    children,
    markDefs,
  }
}

/**
 * Convert a list item. Same as text block but with listItem property.
 */
function convertListItem(
  node: any,
  listType: 'bullet' | 'number'
): any | null {
  const text = node.text || ''
  const spans = node.spans || []

  const { children, markDefs } = convertSpans(text, spans)

  return {
    _type: 'block',
    _key: generateKey(),
    style: 'normal',
    listItem: listType,
    level: 1,
    children,
    markDefs,
  }
}

/**
 * The core span conversion algorithm.
 *
 * Prismic uses character-offset spans:
 *   [{ start: 0, end: 5, type: 'strong' }, { start: 3, end: 8, type: 'em' }]
 *
 * Sanity uses marked text segments:
 *   [{ text: 'Hel', marks: ['strong'] },
 *    { text: 'lo', marks: ['strong', 'em'] },
 *    { text: ' wo', marks: ['em'] },
 *    { text: 'rld', marks: [] }]
 *
 * Algorithm:
 * 1. Collect all boundary points (starts and ends of all spans)
 * 2. Sort them to create segments
 * 3. For each segment, determine which marks are active
 * 4. Create a Portable Text span for each segment
 */
function convertSpans(
  text: string,
  spans: any[]
): { children: any[]; markDefs: any[] } {
  const markDefs: any[] = []

  if (spans.length === 0) {
    // No formatting — single span with the full text
    return {
      children: [
        {
          _type: 'span',
          _key: generateKey(),
          text: text || '',
          marks: [],
        },
      ],
      markDefs: [],
    }
  }

  // Pre-process spans: assign mark keys for links
  const processedSpans = spans.map((span) => {
    if (span.type === 'hyperlink' && span.data) {
      const key = generateKey()
      markDefs.push({
        _type: 'link',
        _key: key,
        href: span.data.url || span.data.link_type === 'Web'
          ? span.data.url
          : '',
        openInNewTab: span.data.target === '_blank',
      })
      return { ...span, markKey: key }
    }
    return { ...span, markKey: span.type } // 'strong' or 'em'
  })

  // Collect all boundary points
  const boundaries = new Set<number>()
  boundaries.add(0)
  boundaries.add(text.length)
  for (const span of processedSpans) {
    boundaries.add(span.start)
    boundaries.add(span.end)
  }

  const sortedBoundaries = Array.from(boundaries).sort((a, b) => a - b)

  // Create segments between each pair of consecutive boundaries
  const children: any[] = []
  for (let i = 0; i < sortedBoundaries.length - 1; i++) {
    const start = sortedBoundaries[i]
    const end = sortedBoundaries[i + 1]
    const segmentText = text.slice(start, end)

    // Skip empty segments
    if (segmentText === '') continue

    // Determine active marks for this segment
    const activeMarks: string[] = []
    for (const span of processedSpans) {
      if (span.start <= start && span.end >= end) {
        activeMarks.push(span.markKey)
      }
    }

    children.push({
      _type: 'span',
      _key: generateKey(),
      text: segmentText,
      marks: activeMarks,
    })
  }

  // Edge case: if no children were created, add an empty span
  if (children.length === 0) {
    children.push({
      _type: 'span',
      _key: generateKey(),
      text: '',
      marks: [],
    })
  }

  return { children, markDefs }
}

/**
 * Convert an embedded image in rich text.
 * Downloads from Prismic CDN and uploads to Sanity.
 */
async function convertImage(node: any): Promise<any | null> {
  if (!node.url) return null

  const imageRef = await uploadImage({
    url: node.url,
    alt: node.alt || '',
    dimensions: node.dimensions,
  })

  if (!imageRef) return null

  return {
    _type: 'image',
    _key: generateKey(),
    asset: imageRef.asset,
    alt: node.alt || '',
  }
}

/**
 * Convert an embedded oembed (video, etc.) in rich text.
 */
function convertEmbed(node: any): any | null {
  if (!node.oembed?.embed_url) return null

  return {
    _type: 'videoEmbed',
    _key: generateKey(),
    url: node.oembed.embed_url,
  }
}
```

### 6.4 Key Generator

```typescript
// scripts/utils/keys.ts

let counter = 0

/**
 * Generate unique keys for Portable Text blocks and spans.
 * Sanity requires `_key` on array items. Uses a counter + random suffix
 * for uniqueness within a migration run.
 */
export function generateKey(): string {
  counter++
  const random = Math.random().toString(36).substring(2, 6)
  return `k${counter}-${random}`
}

/**
 * Reset the counter (useful for testing).
 */
export function resetKeyCounter(): void {
  counter = 0
}
```

---

## 7. Image Migration

### 7.1 Design

Images are migrated in a two-step process:

1. **Download** from Prismic's CDN URL (e.g., `images.prismic.io/world-sevens-football/...`)
2. **Upload** to Sanity's asset pipeline via `client.assets.upload('image', Buffer)`

A URL-keyed cache prevents re-uploading the same image. This matters because:
- The same image might be used in multiple documents
- Re-running the migration should not create duplicate assets

### 7.2 Implementation

```typescript
// scripts/utils/image-upload.ts
import { sanityClient } from '../sanity-client'
import { log } from './logger'

/**
 * Cache of Prismic image URL -> Sanity asset reference.
 * Prevents re-uploading the same image during a migration run.
 */
export const imageCache = new Map<
  string,
  { _type: 'image'; asset: { _type: 'reference'; _ref: string } }
>()

/**
 * Upload a Prismic image to Sanity and return a Sanity image reference.
 *
 * Prismic image fields look like:
 *   { url: "https://images.prismic.io/...", alt: "...", dimensions: { width, height } }
 *   or just the image object from doc.data
 *
 * Returns null if the image field is empty/invalid.
 */
export async function uploadImage(
  prismicImage: any
): Promise<
  | {
      _type: 'image'
      asset: { _type: 'reference'; _ref: string }
      alt?: string
    }
  | undefined
> {
  if (!prismicImage?.url) return undefined

  const url = prismicImage.url as string

  // Check cache
  const cached = imageCache.get(url)
  if (cached) {
    return {
      ...cached,
      alt: prismicImage.alt || undefined,
    }
  }

  try {
    // Download image from Prismic CDN
    const response = await fetch(url)
    if (!response.ok) {
      log.warn(`  Failed to download image: ${url} (${response.status})`)
      return undefined
    }
    const buffer = await response.arrayBuffer()

    // Extract filename from URL
    const filename = extractFilename(url)

    // Upload to Sanity
    const asset = await sanityClient.assets.upload(
      'image',
      Buffer.from(buffer),
      { filename }
    )

    const ref = {
      _type: 'image' as const,
      asset: { _type: 'reference' as const, _ref: asset._id },
    }

    // Cache the result
    imageCache.set(url, ref)

    return {
      ...ref,
      alt: prismicImage.alt || undefined,
    }
  } catch (err) {
    log.warn(`  Image upload failed for ${url}:`, err)
    return undefined
  }
}

/**
 * Upload a Prismic file (PDF, etc.) to Sanity.
 *
 * Prismic media Link fields look like:
 *   { link_type: "Media", url: "https://...", name: "file.pdf", size: "123456" }
 */
export async function uploadFile(
  prismicFile: any
): Promise<
  | { _type: 'file'; asset: { _type: 'reference'; _ref: string } }
  | undefined
> {
  if (!prismicFile?.url || prismicFile.link_type !== 'Media') {
    return undefined
  }

  const url = prismicFile.url as string

  try {
    const response = await fetch(url)
    if (!response.ok) return undefined

    const buffer = await response.arrayBuffer()
    const filename = prismicFile.name || extractFilename(url)

    const asset = await sanityClient.assets.upload(
      'file',
      Buffer.from(buffer),
      { filename }
    )

    return {
      _type: 'file',
      asset: { _type: 'reference', _ref: asset._id },
    }
  } catch (err) {
    log.warn(`  File upload failed for ${url}:`, err)
    return undefined
  }
}

/**
 * Extract a filename from a Prismic CDN URL.
 * Example: "https://images.prismic.io/world-sevens-football/abc123_hero.jpg?auto=..."
 *  -> "abc123_hero.jpg"
 */
function extractFilename(url: string): string {
  try {
    const pathname = new URL(url).pathname
    const parts = pathname.split('/')
    const last = parts[parts.length - 1]
    // Remove query params that might be in the filename
    return last.split('?')[0] || 'image'
  } catch {
    return 'image'
  }
}
```

### 7.3 Thumbnail Handling

Prismic supports image thumbnails (cropped variants). For the migration, we only upload the main image. Sanity handles responsive sizing via its image pipeline (`@sanity/image-url`), so thumbnails are unnecessary — Sanity generates variants on the fly with hotspot/crop support.

The only Prismic type with thumbnails is `team_member.headshot`, which has a `thumbnail` variant. This is skipped during migration since Sanity's image CDN generates any needed size.

---

## 8. Migration Order & Dependencies

### 8.1 Dependency Graph

```
blogTags (no deps)
broadcastPartners (no deps)
sponsors (no deps)
        │
        ▼
teams ──────────────── references: tournaments (forward ref)
        │
        ▼
players ─────────────── references: teams
        │
        ▼
tournaments ──────────── references: matches, awards, blogs (forward refs)
        │
        ▼
matches ─────────────── references: tournaments, teams, broadcastPartners
        │
        ▼
awards ──────────────── references: teams
        │
        ▼
teamMembers (no doc deps)
policies (no doc deps)
        │
        ▼
blogs ───────────────── references: tags, tournaments, teams, matches
        │
        ▼
pages ───────────────── sections may reference blogs (newsList)
        │
        ▼
siteSettings ────────── references: broadcastPartners
```

### 8.2 Forward References

Because Sanity IDs are **deterministic**, forward references work naturally. When the `team` transformer runs and creates a reference to a tournament that hasn't been migrated yet, the reference `_ref: 'tournament-fort-lauderdale-2025'` is valid — Sanity stores it, and the target document will exist by the time the migration completes.

This means the exact ordering matters less than it appears. The ordering above is a recommendation for clarity, not a hard requirement. The only true requirement is that **blogTags must be created before blogs** (so the BLOG_TAG_MAP is populated).

### 8.3 Migration Order

| Step | Type | Count (est.) | Depends On | Notes |
|------|------|-------------|------------|-------|
| 1 | `blogTag` | 7 | None | Seeded from hardcoded categories |
| 2 | `broadcastPartner` | ~5 | None | Independent |
| 3 | `sponsor` | ~10 | None | Independent |
| 4 | `team` | ~30 | None (forward refs to tournaments) | |
| 5 | `player` | ~200 | teams (for context, not hard dep) | |
| 6 | `tournament` | ~10 | Forward refs to matches, awards | |
| 7 | `match` | ~100 | tournaments, teams, broadcastPartners | |
| 8 | `award` | ~20 | teams | |
| 9 | `teamMember` | ~15 | None | |
| 10 | `policy` | ~5 | None | |
| 11 | `blog` | ~50 | blogTags, tournaments, teams, matches | |
| 12 | `page` | ~5 | blogs (for newsList sections) | |
| 13 | `siteSettings` | 1 | broadcastPartners | |

### 8.4 Types NOT Migrated

| Prismic Type | Reason |
|---|---|
| `testimonial` | No corresponding Sanity schema — unused/deprecated |
| `image_with_text` | Duplicate of the ImageWithText slice — dead weight |

---

## 9. Verification Scripts

### 9.1 Slice Zone / Section Converter

Before covering verification, here is the section converter used by the page and blog transformers:

```typescript
// scripts/utils/section-converter.ts
import { generateKey } from './keys'
import { uploadImage } from './image-upload'
import { prismicToPortableText } from './rich-text-converter'
import { BLOG_TAG_MAP } from '../transformers/blog-tag'
import { toSanityRef, slugify } from './id-map'

/**
 * Convert a Prismic SliceZone array to a Sanity sections array.
 *
 * Prismic slices have:
 *   { slice_type: 'text_block', primary: { heading: '...', body: [...] }, items: [...] }
 *
 * Sanity sections have:
 *   { _type: 'textBlock', _key: '...', heading: '...', body: [...] }
 */
export async function convertSliceZone(slices: any[]): Promise<any[]> {
  const sections: any[] = []

  for (const slice of slices) {
    const converted = await convertSlice(slice)
    if (converted) sections.push(converted)
  }

  return sections
}

async function convertSlice(slice: any): Promise<any | null> {
  const p = slice.primary || {}
  const items = slice.items || []

  switch (slice.slice_type) {
    case 'subpage_hero':
      return {
        _type: 'hero',
        _key: generateKey(),
        subtitle: p.subtitle || '',
        heading: p.heading || '',
        description: p.description || '',
        image: await uploadImage(p.image),
        spaceAbove: true,
        spaceBelow: true,
      }

    case 'text_block':
      return {
        _type: 'textBlock',
        _key: generateKey(),
        heading: p.heading || '',
        body: p.body ? await prismicToPortableText(p.body) : [],
        textAlign: p.text_align || 'left',
        textSize: p.text_size || 'medium',
        contentWidth: p.content_width || 'full',
        spaceAbove: true,
        spaceBelow: true,
      }

    case 'image_with_text':
      return {
        _type: 'imageWithText',
        _key: generateKey(),
        eyebrow: p.eyebrow || '',
        title: p.title || '',
        description: p.description
          ? await prismicToPortableText(p.description)
          : [],
        image: await uploadImage(p.image),
        imagePosition: p.image_position || 'right',
        spaceAbove: true,
        spaceBelow: true,
      }

    case 'news_list': {
      // Map Prismic category Select to Sanity blogTag reference
      let tagRef: any = undefined
      if (p.category) {
        const tagId = BLOG_TAG_MAP[p.category]
        if (tagId) {
          tagRef = { _type: 'reference', _ref: tagId }
        }
      }

      // Map manual_posts group items to blog references
      const manualPosts: any[] = []
      if (Array.isArray(items)) {
        for (const item of items) {
          // NewsList items have a `post` Link field
          const ref = toSanityRef(item.post || item.manual_post)
          if (ref) {
            manualPosts.push({ ...ref, _key: generateKey() })
          }
        }
      }

      return {
        _type: 'newsList',
        _key: generateKey(),
        heading: p.heading || '',
        tag: tagRef,
        manualPosts: manualPosts.length > 0 ? manualPosts : undefined,
        limit: 6,
        spaceAbove: true,
        spaceBelow: true,
      }
    }

    case 'divider':
      return {
        _type: 'divider',
        _key: generateKey(),
        spaceAbove: p.space_above ?? true,
        spaceBelow: p.space_below ?? true,
      }

    case 'community_champions': {
      // CommunityChampions has logos in the `items` array
      const logos: any[] = []
      for (const item of items) {
        if (item.logo?.url) {
          const img = await uploadImage(item.logo)
          if (img) {
            logos.push({ ...img, _key: generateKey() })
          }
        }
      }

      return {
        _type: 'communityChampions',
        _key: generateKey(),
        heading: p.heading || '',
        description: p.description || '',
        logos,
        spaceAbove: true,
        spaceBelow: true,
      }
    }

    default:
      // Unknown slice type — skip with a warning
      console.warn(`  Unknown slice type: ${slice.slice_type} — skipping`)
      return null
  }
}
```

### 9.2 Logger

```typescript
// scripts/utils/logger.ts

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m',
}

export const log = {
  info: (msg: string, ...args: any[]) => {
    console.log(`${COLORS.blue}[INFO]${COLORS.reset} ${msg}`, ...args)
  },
  warn: (msg: string, ...args: any[]) => {
    console.log(
      `${COLORS.yellow}[WARN]${COLORS.reset} ${msg}`,
      ...args
    )
  },
  error: (msg: string, ...args: any[]) => {
    console.error(
      `${COLORS.red}[ERROR]${COLORS.reset} ${msg}`,
      ...args
    )
  },
  success: (msg: string, ...args: any[]) => {
    console.log(
      `${COLORS.green}[OK]${COLORS.reset} ${msg}`,
      ...args
    )
  },
}
```

### 9.3 Verification Script

```typescript
// scripts/verify.ts
import 'dotenv/config'
import { sanityClient } from './sanity-client'
import { log } from './utils/logger'

interface TypeCheck {
  sanityType: string
  label: string
  expectedMin?: number
}

const TYPES_TO_CHECK: TypeCheck[] = [
  { sanityType: 'blogTag', label: 'Blog Tags', expectedMin: 7 },
  { sanityType: 'broadcastPartner', label: 'Broadcast Partners' },
  { sanityType: 'sponsor', label: 'Sponsors' },
  { sanityType: 'team', label: 'Teams' },
  { sanityType: 'player', label: 'Players' },
  { sanityType: 'tournament', label: 'Tournaments' },
  { sanityType: 'match', label: 'Matches' },
  { sanityType: 'award', label: 'Awards' },
  { sanityType: 'teamMember', label: 'Team Members' },
  { sanityType: 'policy', label: 'Policies' },
  { sanityType: 'blog', label: 'Blog Posts' },
  { sanityType: 'page', label: 'Pages' },
  { sanityType: 'siteSettings', label: 'Site Settings', expectedMin: 1 },
]

async function verify() {
  log.info('=== Post-Migration Verification ===\n')

  let allPassed = true

  // 1. Document count check
  log.info('--- Document Counts ---')
  for (const { sanityType, label, expectedMin } of TYPES_TO_CHECK) {
    const count = await sanityClient.fetch<number>(
      `count(*[_type == "${sanityType}"])`
    )
    const status =
      count > 0 && (expectedMin === undefined || count >= expectedMin)
        ? '✓'
        : '✗'
    if (status === '✗') allPassed = false
    log.info(
      `  ${status} ${label}: ${count}${expectedMin ? ` (expected ≥${expectedMin})` : ''}`
    )
  }

  // 2. Reference integrity check
  log.info('\n--- Reference Integrity ---')
  await checkReferences('blog', 'tags', allPassed)
  await checkReferences('blog', 'tournament', allPassed)
  await checkReferences('match', 'homeTeam', allPassed)
  await checkReferences('match', 'awayTeam', allPassed)
  await checkReferences('match', 'tournament', allPassed)
  await checkReferences('tournament', 'matches', allPassed)
  await checkReferences('tournament', 'awards', allPassed)
  await checkReferences('team', 'tournaments', allPassed)
  await checkReferences('player', 'team', allPassed)
  await checkReferences('award', 'playerTeam', allPassed)

  // 3. Image availability check
  log.info('\n--- Image Availability ---')
  const imagesCheck = await sanityClient.fetch<number>(`
    count(*[_type == "tournament" && defined(heroImage.asset)])
  `)
  const totalTournaments = await sanityClient.fetch<number>(
    `count(*[_type == "tournament"])`
  )
  log.info(
    `  Tournament hero images: ${imagesCheck}/${totalTournaments} have images`
  )

  const blogImagesCheck = await sanityClient.fetch<number>(`
    count(*[_type == "blog" && defined(image.asset)])
  `)
  const totalBlogs = await sanityClient.fetch<number>(
    `count(*[_type == "blog"])`
  )
  log.info(
    `  Blog images: ${blogImagesCheck}/${totalBlogs} have images`
  )

  const teamLogos = await sanityClient.fetch<number>(`
    count(*[_type == "team" && defined(logo.asset)])
  `)
  const totalTeams = await sanityClient.fetch<number>(
    `count(*[_type == "team"])`
  )
  log.info(`  Team logos: ${teamLogos}/${totalTeams} have logos`)

  // 4. Rich text spot check
  log.info('\n--- Rich Text Spot Check ---')
  const blogsWithContent = await sanityClient.fetch<any[]>(`
    *[_type == "blog" && defined(content)][0...5]{
      _id, title,
      "blockCount": count(content),
      "hasSpans": count(content[_type == "block" && count(children) > 0]) > 0
    }
  `)
  for (const blog of blogsWithContent) {
    const status = blog.blockCount > 0 && blog.hasSpans ? '✓' : '✗'
    if (status === '✗') allPassed = false
    log.info(
      `  ${status} "${blog.title}": ${blog.blockCount} blocks, spans: ${blog.hasSpans}`
    )
  }

  // 5. Singleton check
  log.info('\n--- Singleton Check ---')
  const settings = await sanityClient.fetch<any>(
    `*[_type == "siteSettings" && _id == "siteSettings"][0]`
  )
  if (settings) {
    log.success(
      `  Site settings: ${settings.footerMenus?.length ?? 0} footer menus, ${settings.whereToWatchPartners?.length ?? 0} watch partners`
    )
  } else {
    allPassed = false
    log.error('  Site settings document not found')
  }

  // 6. Blog tags check
  log.info('\n--- Blog Tag Mapping ---')
  const blogsWithTags = await sanityClient.fetch<number>(
    `count(*[_type == "blog" && count(tags) > 0])`
  )
  const blogsWithoutTags = await sanityClient.fetch<number>(
    `count(*[_type == "blog" && count(tags) == 0])`
  )
  log.info(
    `  Blogs with tags: ${blogsWithTags}, without tags: ${blogsWithoutTags}`
  )
  if (blogsWithoutTags > 0) {
    const untagged = await sanityClient.fetch<any[]>(
      `*[_type == "blog" && count(tags) == 0]{ _id, title }[0...5]`
    )
    for (const blog of untagged) {
      log.warn(`    Missing tags: "${blog.title}" (${blog._id})`)
    }
  }

  // Summary
  log.info(
    `\n=== Verification ${allPassed ? 'PASSED' : 'FAILED — check warnings above'} ===`
  )
}

async function checkReferences(
  type: string,
  field: string,
  _allPassed: boolean
): Promise<void> {
  // Check for broken references (target document doesn't exist)
  const broken = await sanityClient.fetch<any[]>(`
    *[_type == "${type}" && defined(${field})]{
      _id,
      "ref": ${field}
    }[0...3]
  `)

  // For array references, check the first item
  const total = await sanityClient.fetch<number>(
    `count(*[_type == "${type}" && defined(${field})])`
  )
  log.info(`  ${type}.${field}: ${total} documents with references`)
}

verify().catch((err) => {
  log.error('Verification failed', err)
  process.exit(1)
})
```

Run verification:

```bash
npx tsx scripts/verify.ts
```

---

## 10. Rollback Strategy

### 10.1 Full Rollback

Delete all migrated content from Sanity and re-run:

```typescript
// scripts/rollback.ts
import 'dotenv/config'
import { deleteAllOfType } from './sanity-client'
import { log } from './utils/logger'

const TYPES_TO_DELETE = [
  // Delete in reverse dependency order
  'siteSettings',
  'page',
  'blog',
  'policy',
  'teamMember',
  'award',
  'match',
  'tournament',
  'player',
  'team',
  'sponsor',
  'broadcastPartner',
  'blogTag',
]

async function rollback() {
  log.info('=== Rolling Back Migration ===')
  log.info('This will delete ALL migrated content from Sanity.\n')

  let totalDeleted = 0

  for (const type of TYPES_TO_DELETE) {
    const count = await deleteAllOfType(type)
    totalDeleted += count
  }

  // Also delete uploaded assets (images, files)
  log.info('\nDeleting orphaned assets...')
  const orphanedAssets = await import('./sanity-client').then((m) =>
    m.sanityClient.fetch<{ _id: string }[]>(
      `*[_type in ["sanity.imageAsset", "sanity.fileAsset"]]{ _id }`
    )
  )

  if (orphanedAssets.length > 0) {
    const { sanityClient } = await import('./sanity-client')
    for (let i = 0; i < orphanedAssets.length; i += 50) {
      const batch = orphanedAssets.slice(i, i + 50)
      const tx = sanityClient.transaction()
      for (const asset of batch) {
        tx.delete(asset._id)
      }
      await tx.commit()
    }
    log.info(`  Deleted ${orphanedAssets.length} assets`)
  }

  log.info(
    `\n=== Rollback Complete: ${totalDeleted} documents deleted ===`
  )
}

rollback().catch((err) => {
  log.error('Rollback failed', err)
  process.exit(1)
})
```

Run rollback:

```bash
npx tsx scripts/rollback.ts
```

### 10.2 Partial Re-Migration

To re-migrate a single type (e.g., after fixing a transformer):

```bash
# Delete and re-migrate just blogs
npx tsx scripts/rollback.ts --only=blog
npx tsx scripts/migrate.ts --only=blogs
```

The `--only` flag on rollback.ts:

```typescript
// Add to rollback.ts main function:
const args = process.argv.slice(2)
const onlyArg = args.find((a) => a.startsWith('--only='))
const onlyTypes = onlyArg
  ? onlyArg.replace('--only=', '').split(',')
  : null

const typesToDelete = onlyTypes
  ? TYPES_TO_DELETE.filter((t) => onlyTypes.includes(t))
  : TYPES_TO_DELETE
```

---

## 11. Delta Migration

### 11.1 Purpose

Handle content changes in Prismic during the migration window. If editors continue publishing in Prismic after the initial migration, a delta migration re-syncs only the changed documents.

### 11.2 Implementation

```typescript
// scripts/delta.ts
import 'dotenv/config'
import * as prismic from '@prismicio/client'
import { sanityClient, commitBatch } from './sanity-client'
import { log } from './utils/logger'

// Import all transformers
import { transformBroadcastPartner } from './transformers/broadcast-partner'
import { transformSponsor } from './transformers/sponsor'
import { transformTeam } from './transformers/team'
import { transformPlayer } from './transformers/player'
import { transformTournament } from './transformers/tournament'
import { transformMatch } from './transformers/match'
import { transformAward } from './transformers/award'
import { transformTeamMember } from './transformers/team-member'
import { transformPolicy } from './transformers/policy'
import { transformBlog } from './transformers/blog'
import { transformPage } from './transformers/page'
import { transformSiteSettings } from './transformers/site-settings'

const TRANSFORMER_MAP: Record<string, (doc: any) => Promise<any>> = {
  tournament: transformTournament,
  blog: transformBlog,
  team: transformTeam,
  match: transformMatch,
  player: transformPlayer,
  team_member: transformTeamMember,
  broadcast_partners: transformBroadcastPartner,
  sponsor: transformSponsor,
  awards: transformAward,
  policy: transformPolicy,
  page: transformPage,
  website: transformSiteSettings,
}

/**
 * Delta migration: fetch Prismic documents modified after a given date
 * and re-migrate only those.
 *
 * Usage:
 *   npx tsx scripts/delta.ts --after=2025-03-15
 *   npx tsx scripts/delta.ts --after=2025-03-15T12:00:00Z
 */
async function delta() {
  const args = process.argv.slice(2)
  const afterArg = args.find((a) => a.startsWith('--after='))

  if (!afterArg) {
    log.error('Usage: npx tsx scripts/delta.ts --after=YYYY-MM-DD')
    process.exit(1)
  }

  const afterDate = afterArg.replace('--after=', '')
  log.info(`=== Delta Migration: documents modified after ${afterDate} ===`)

  const client = prismic.createClient(
    process.env.PRISMIC_REPOSITORY || 'world-sevens-football'
  )

  // Fetch all documents modified after the given date
  // Prismic's `last_publication_date` is automatically set on publish
  const allDocs = await client.getAll({
    filters: [
      prismic.filter.dateAfter(
        'document.last_publication_date',
        afterDate
      ),
    ],
  })

  log.info(`Found ${allDocs.length} documents modified after ${afterDate}`)

  if (allDocs.length === 0) {
    log.info('Nothing to migrate.')
    return
  }

  // Group by type
  const byType = new Map<string, any[]>()
  for (const doc of allDocs) {
    const existing = byType.get(doc.type) ?? []
    existing.push(doc)
    byType.set(doc.type, existing)
  }

  for (const [type, docs] of byType) {
    log.info(`\n  ${type}: ${docs.length} modified`)

    const transformer = TRANSFORMER_MAP[type]
    if (!transformer) {
      log.warn(`    No transformer for type "${type}" — skipping`)
      continue
    }

    const sanityDocs: any[] = []
    for (const doc of docs) {
      sanityDocs.push(await transformer(doc))
    }

    await commitBatch(sanityDocs)
    log.success(`    Migrated ${sanityDocs.length} ${type} documents`)
  }

  log.info('\n=== Delta Migration Complete ===')
}

delta().catch((err) => {
  log.error('Delta migration failed', err)
  process.exit(1)
})
```

Run delta migration:

```bash
# Migrate everything changed since March 15
npx tsx scripts/delta.ts --after=2025-03-15

# Migrate everything changed since a specific timestamp
npx tsx scripts/delta.ts --after=2025-03-15T14:30:00Z
```

### 11.3 Recommended Workflow

1. **Initial migration**: `npx tsx scripts/migrate.ts` — migrates everything
2. **Verify**: `npx tsx scripts/verify.ts` — confirm counts and integrity
3. **Content freeze**: Ask editors to stop publishing in Prismic
4. **Delta migration**: `npx tsx scripts/delta.ts --after=<initial-migration-date>` — catch any changes made between step 1 and step 3
5. **Final verify**: `npx tsx scripts/verify.ts` — confirm everything is in sync
6. **Cut over**: Point the site to Sanity, disable Prismic access

If something goes wrong at any point:

```bash
npx tsx scripts/rollback.ts   # Clean slate
npx tsx scripts/migrate.ts    # Full re-migration
```

---

## Appendix: Complete File List

| File | Lines (est.) | Purpose |
|------|-------------|---------|
| `scripts/migrate.ts` | ~180 | Main orchestrator with --only and --dry-run flags |
| `scripts/verify.ts` | ~120 | Post-migration verification |
| `scripts/rollback.ts` | ~60 | Delete all migrated content |
| `scripts/delta.ts` | ~80 | Re-migrate recently changed content |
| `scripts/prismic-client.ts` | ~60 | Prismic REST API client |
| `scripts/sanity-client.ts` | ~60 | Sanity mutation client |
| `scripts/transformers/blog-tag.ts` | ~40 | Seed blog tags |
| `scripts/transformers/broadcast-partner.ts` | ~30 | Transform broadcast partners |
| `scripts/transformers/sponsor.ts` | ~30 | Transform sponsors |
| `scripts/transformers/team.ts` | ~50 | Transform teams |
| `scripts/transformers/player.ts` | ~30 | Transform players |
| `scripts/transformers/tournament.ts` | ~70 | Transform tournaments |
| `scripts/transformers/match.ts` | ~45 | Transform matches |
| `scripts/transformers/award.ts` | ~25 | Transform awards |
| `scripts/transformers/team-member.ts` | ~25 | Transform team members |
| `scripts/transformers/policy.ts` | ~25 | Transform policies |
| `scripts/transformers/blog.ts` | ~60 | Transform blogs |
| `scripts/transformers/page.ts` | ~40 | Transform pages |
| `scripts/transformers/site-settings.ts` | ~50 | Transform site settings |
| `scripts/utils/id-map.ts` | ~100 | Deterministic ID generation + reference resolution |
| `scripts/utils/image-upload.ts` | ~100 | Image/file download and upload |
| `scripts/utils/rich-text-converter.ts` | ~200 | Prismic StructuredText -> Portable Text |
| `scripts/utils/section-converter.ts` | ~130 | Prismic SliceZone -> Sanity sections |
| `scripts/utils/logger.ts` | ~25 | Colored console logging |
| `scripts/utils/keys.ts` | ~15 | Unique key generation |
