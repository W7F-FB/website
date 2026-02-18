# Sanity Migration - Phase Agent Prompts

Each prompt below is designed for an independent agent session. They can run in parallel. Each agent reads the master plan at `llms/sanity-migration/plan.md` and the current codebase for context, then produces a detailed phase document.

---

## Agent 1: Phase 0 — Repo Setup & Foundation

```
## Instructions

If you have the `brainstorming` skill available, use it for the research/exploration phase. If you have the `writing-plans` skill available, use it when writing the phase document. Do NOT make any git commits.

You may ask clarifying questions if something is ambiguous, but you are not required to.

## Task

Read the master migration plan at `llms/sanity-migration/plan.md` (Sections 4 and 12 Phase 1). Then explore the current codebase to understand the existing project structure, `package.json`, `next.config.ts`, `.env.local`, `tsconfig.json`, and `.gitignore`.

Write a detailed phase document to `llms/sanity-migration/phases/phase-0-repo-setup.md` covering:

1. **Repo Cloning Strategy** — exact steps to create the new repo from the current one, branch naming, what to preserve
2. **Prismic Removal Checklist** — every Prismic-related package, file, directory, config entry, and env var that must be removed. Be exhaustive — read `package.json`, check for Prismic imports across the codebase, find every reference
3. **Sanity Installation** — exact packages to install with versions, `npx sanity init` workflow, project creation steps
4. **Environment Variables** — complete `.env.local` template for Sanity (what to add, what to remove, what stays)
5. **Next.js Config Updates** — changes to `next.config.ts` (image domains, compiler settings, any Prismic-specific config to remove)
6. **TypeScript Config** — any path alias changes needed for `@/sanity`
7. **Gitignore Updates** — Sanity-specific entries
8. **Verification Checklist** — how to confirm this phase is complete (Studio loads at /studio, no Prismic references remain, build passes)

Be precise — include exact file paths, exact package names, exact config values. This document should be copy-paste executable.
```

---

## Agent 2: Phase 1 — Sanity Schema Design

```
## Instructions

If you have the `brainstorming` skill available, use it for the research/exploration phase. If you have the `writing-plans` skill available, use it when writing the phase document. Do NOT make any git commits.

You may ask clarifying questions if something is ambiguous, but you are not required to.

## Task

Read the master migration plan at `llms/sanity-migration/plan.md` (Sections 5 and 6). Then explore the current Prismic content model by reading every `model.json` in `src/cms/slices/` and every `index.json` in `customtypes/`. Also read `prismicio-types.d.ts` for the generated TypeScript types.

Write a detailed phase document to `llms/sanity-migration/phases/phase-1-schema-design.md` covering:

1. **Schema Architecture Overview** — file/folder structure under `src/sanity/schemas/`, how schemas are registered, the index file pattern
2. **Document Schemas** — complete, production-ready `defineType` code for ALL 13 document types + the new `blogCategory`. For each:
   - Full field list with types, validations, descriptions, initial values
   - Field groups where appropriate (like tournament's details/media/opta/navigation/content)
   - Preview configuration
   - Orderings
   - Document-level validation rules
   - Notes on what changed vs Prismic and why
3. **Object Schemas** — complete code for `portableText`, `seo`, `footerMenu`, `link`, and any other reusable objects
4. **Section Schemas** — complete code for all 8 page-builder section types (hero, textBlock, imageWithText, newsList, divider, communityChampions, ctaBanner, videoEmbed), each with preview configs
5. **Schema Registry** — the `index.ts` that exports all schemas
6. **Prismic-to-Sanity Field Mapping Table** — for every Prismic custom type, a table showing old field name -> new field name -> type change -> notes
7. **Design Decisions Log** — document every choice where Sanity differs from Prismic (references vs groups, slugs vs UIDs, color type vs string, etc.) and the reasoning

Focus on completeness and correctness. Every schema should be valid Sanity v3 TypeScript. Use `defineType`, `defineField`, `defineArrayMember` properly. Reference the Context7 Sanity docs if the `query-docs` tool is available.
```

---

## Agent 3: Phase 2 — Data Flow & GROQ Query Architecture

```
## Instructions

If you have the `brainstorming` skill available, use it for the research/exploration phase. If you have the `writing-plans` skill available, use it when writing the phase document. Do NOT make any git commits.

You may ask clarifying questions if something is ambiguous, but you are not required to.

## Task

Read the master migration plan at `llms/sanity-migration/plan.md` (Sections 3 and 9). Then deeply explore the current data fetching layer: read every file in `src/cms/queries/`, read `src/cms/client.ts`, `src/prismicio.ts`, and examine how pages consume query data (read the page files in `src/app/(website)/`).

Write a detailed phase document to `llms/sanity-migration/phases/phase-2-data-flow.md` covering:

1. **Current Architecture Assessment** — document exactly how data flows today: client setup, caching strategy, query patterns, relationship resolution, error handling. Include line counts and complexity metrics where relevant
2. **New Architecture Design** — the Sanity data flow: `defineLive`, `sanityFetch`, GROQ, CDN caching, revalidation strategy
3. **Sanity Client Setup** — complete code for `src/sanity/client.ts`, `src/sanity/live.ts`, `src/sanity/image.ts`, `src/sanity/env.ts`
4. **GROQ Query Definitions** — complete, tested GROQ for every query the site needs. For each query:
   - The GROQ string
   - What Prismic query it replaces
   - Parameters it accepts
   - What references it resolves inline (and how deep)
   - Performance notes (projection vs full document, limits)
5. **Query Function Refactoring** — show the before/after for every function in `src/cms/queries/`. Complete new implementations using `sanityFetch`
6. **Homepage Data Consolidation** — the single GROQ query (or 2-3) that replaces the homepage's 10+ Prismic calls, with detailed walkthrough
7. **Portable Text Renderer** — complete component code for `src/components/portable-text.tsx` that replaces `prismic-rich-text.tsx`, mapping to the same typography components (H1-H4, P, Blockquote, List)
8. **Error Handling Patterns** — how to handle missing documents, null references, empty arrays in the Sanity world
9. **Caching & Revalidation Strategy** — how `defineLive` + CDN + stale-while-revalidate works vs the current ISR tag approach

This is the architectural heart of the migration. Be thorough.
```

---

## Agent 4: Phase 3 — Sanity Studio & Visual Editing

```
## Instructions

If you have the `brainstorming` skill available, use it for the research/exploration phase. If you have the `writing-plans` skill available, use it when writing the phase document. Do NOT make any git commits.

You may ask clarifying questions if something is ambiguous, but you are not required to.

## Task

Read the master migration plan at `llms/sanity-migration/plan.md` (Sections 7 and 8). Research Sanity Studio v3 best practices using Context7 if available (`/websites/sanity_io` and `/sanity-io/next-sanity`).

Also explore the current Prismic preview setup by reading `src/app/api/preview/route.ts`, `src/app/api/exit-preview/route.ts`, and how `PrismicPreview` is used in `src/app/layout.tsx`.

Write a detailed phase document to `llms/sanity-migration/phases/phase-3-studio-visual-editing.md` covering:

1. **Embedded Studio Setup** — complete code for `src/app/studio/[[...tool]]/page.tsx`, `src/sanity/sanity.config.ts`. Include the `layout.tsx` for the studio route if needed (to exclude nav/footer)
2. **Custom Desk Structure** — complete code for `src/sanity/structure/index.ts`. Design the sidebar navigation for the client:
   - Organize by workflow (Tournaments, Teams & Players, News & Content, Partners & Sponsors, Organization)
   - Singleton handling for Site Settings (no duplicate creation)
   - Custom icons per section
   - Document count badges if feasible
3. **Studio Plugins** — which plugins to include (structureTool, presentationTool, visionTool), configuration for each
4. **Visual Editing Implementation** — complete setup:
   - `defineLive` configuration with stega encoding
   - Draft mode API routes (enable/disable)
   - `SanityLive` component integration in root layout
   - How `encodeDataAttribute` works on components
   - Which components need Visual Editing annotations and how to add them
5. **Presentation Tool Configuration** — preview URL setup, how the Studio's side-by-side preview works
6. **Access Control** — CORS origins, API token scopes (viewer vs editor), role-based access setup in the Sanity dashboard
7. **Client Onboarding UX** — custom Studio theme (W7F branding colors), welcome screen, helpful field descriptions, placeholder text that guides the editor
8. **Migration from Prismic Preview** — what gets removed from the current preview system, what replaces each piece

Make this document comprehensive enough that someone unfamiliar with Sanity Studio could set it up correctly.
```

---

## Agent 5: Phase 4 — Page-by-Page Component Migration

```
## Instructions

If you have the `brainstorming` skill available, use it for the research/exploration phase. If you have the `writing-plans` skill available, use it when writing the phase document. Do NOT make any git commits.

You may ask clarifying questions if something is ambiguous, but you are not required to.

## Task

Read the master migration plan at `llms/sanity-migration/plan.md` (Sections 12 Phase 3 and 14). Then do a thorough exploration of every page component and layout in the app:

- Read every `page.tsx` under `src/app/(website)/`
- Read the nav (`src/components/website-base/nav/nav-main.tsx`) and footer (`src/components/website-base/footer/footer-main.tsx`)
- Read the slice components in `src/cms/slices/`
- Read key block components in `src/components/blocks/` that consume CMS data
- Read `src/lib/utils.ts` for helper functions that reference Prismic types

Write a detailed phase document to `llms/sanity-migration/phases/phase-4-page-migration.md` covering:

For EACH page route, provide:
1. **Current implementation** — what data it fetches, what Prismic types it uses, what components it renders
2. **Required changes** — exact import swaps, data shape changes, component prop updates
3. **New implementation** — the refactored page component code (or clear pseudocode showing the changes)
4. **Migration order** — which pages to migrate first and why (dependency graph)

Specific pages to cover:
- `(home)/page.tsx` and `page-content.tsx` — the most complex, do this one in detail
- `[uid]/page.tsx` — SliceZone -> SectionRenderer conversion
- `news/[slug]/page.tsx` — blog post rendering
- `tournament/[slug]/page.tsx` — tournament hub
- `tournament/[slug]/schedule/page.tsx`
- `tournament/[slug]/match/[matchSlug]/page.tsx`
- `club/[slug]/page.tsx`
- `leadership/page.tsx`
- `resources/[slug]/page.tsx`
- `contact/page.tsx` and `faqs/page.tsx`
- `checkout/` and `confirmation/` pages

Also cover:
- **SectionRenderer component** — complete implementation replacing SliceZone
- **Section components** — how each slice component maps to its new section component (what changes in props/rendering)
- **Navigation refactoring** — nav-main.tsx changes for Sanity data
- **Footer refactoring** — footer-main.tsx changes for Sanity data
- **Layout changes** — root layout.tsx updates (remove PrismicPreview, add SanityLive)
- **Utility function updates** — changes to `mapBlogDocumentToMetadata`, image helpers, etc.
- **Type updates** — how components that currently import from `prismicio-types.d.ts` get their new types
```

---

## Agent 6: Phase 5 — Content Migration Scripts

```
## Instructions

If you have the `brainstorming` skill available, use it for the research/exploration phase. If you have the `writing-plans` skill available, use it when writing the phase document. Do NOT make any git commits.

You may ask clarifying questions if something is ambiguous, but you are not required to.

## Task

Read the master migration plan at `llms/sanity-migration/plan.md` (Section 10). Then explore the current Prismic content model by reading all `customtypes/*/index.json` files and `prismicio-types.d.ts`. Also read the Prismic client setup to understand how to fetch all documents.

Research Sanity's mutation API and content migration patterns using Context7 if available.

Write a detailed phase document to `llms/sanity-migration/phases/phase-5-content-migration.md` covering:

1. **Migration Script Architecture** — folder structure, entry point, how to run, dependencies needed (tsx, @sanity/client, @prismicio/client)
2. **Prismic Export Client** — code for fetching all documents from Prismic's REST API, handling pagination, rate limits
3. **Sanity Import Client** — code for creating/updating documents via Sanity's mutation API, batch transaction patterns
4. **ID Mapping Strategy** — how Prismic IDs map to Sanity IDs, the lookup table approach, handling forward references
5. **Transformer Functions** — complete code for EACH content type transformer (13 total + blogCategory seeding):
   - Input: Prismic document shape
   - Output: Sanity document shape
   - Field-by-field mapping with type conversions
   - Reference resolution (Prismic Link -> Sanity reference)
   - Handling of Group fields -> arrays
   - Handling of Select fields -> strings or references
6. **Rich Text Converter** — complete implementation of Prismic StructuredText -> Sanity Portable Text:
   - Block mapping (paragraph, headings, preformatted)
   - Span/mark conversion (bold, italic, links)
   - List item handling (bullet and numbered)
   - Embedded images (download + re-upload)
   - Embedded videos/oembeds
   - Edge cases (empty blocks, nested marks)
7. **Image Migration** — download from Prismic CDN, upload to Sanity asset pipeline, preserve alt text and dimensions, handle thumbnails
8. **Migration Order & Dependencies** — the exact sequence, which types can run in parallel, dependency graph
9. **Verification Scripts** — how to validate migration completeness:
   - Document count comparison
   - Reference integrity checks
   - Image availability checks
   - Rich text spot-check sampling
10. **Rollback Strategy** — how to delete all migrated content and re-run if needed
11. **Delta Migration** — how to handle content changes in Prismic during the migration window

Include complete, runnable TypeScript code for all scripts. Someone should be able to `npx tsx scripts/migrate.ts` and have it work.
```

---

## Agent 7: Phase 6 — Opta Integration, Testing & Cutover

```
## Instructions

If you have the `brainstorming` skill available, use it for the research/exploration phase. If you have the `writing-plans` skill available, use it when writing the phase document. Do NOT make any git commits.

You may ask clarifying questions if something is ambiguous, but you are not required to.

## Task

Read the master migration plan at `llms/sanity-migration/plan.md` (Sections 11, 13, and 12 Phases 5-6). Then explore the Opta integration layer thoroughly:

- Read all files in `src/app/api/opta/`
- Read `src/types/opta-feeds/` for feed type definitions
- Search the codebase for every reference to `opta_id`, `opta_competition_id`, `opta_season_id`, `opta_enabled`
- Read how Opta data merges with CMS data in tournament, match, and team pages
- Read the `src/app/api/revalidate/` route

Write a detailed phase document to `llms/sanity-migration/phases/phase-6-opta-testing-cutover.md` covering:

1. **Opta Integration Audit** — every file that touches both Opta and Prismic data, with exact line references. Map every `team.data.opta_id` -> `team.optaId` style change needed
2. **Opta Code Changes** — complete before/after for every file that needs updating. These should be mechanical find-and-replace level changes with the exact old and new code
3. **Non-CMS Integration Inventory** — confirm that Klaviyo, Resend, Supabase, Millicast, Dolby, GTM/GA integrations need zero changes. Read each integration's code to verify
4. **Comprehensive Test Plan** — for every page type and feature:
   - What to test manually
   - Expected behavior
   - Known edge cases
   - How to verify Opta data still renders correctly
   - How to verify images load from Sanity CDN
   - How to verify rich text renders identically
5. **Performance Benchmarks** — what to measure before (Prismic) and after (Sanity):
   - Page load times for key pages (homepage, tournament, match)
   - GROQ query response times
   - Image loading performance
   - Time to first byte comparisons
6. **Risk Register** — expanded from the master plan, with specific mitigation steps for each risk, DRI (directly responsible individual), and acceptance criteria
7. **Cutover Runbook** — step-by-step checklist for go-live:
   - Content freeze window
   - Final migration run
   - DNS/deployment switch
   - Smoke test checklist
   - Rollback procedure if something fails
   - Post-launch monitoring (what to watch for 48 hours)
8. **Revalidation Strategy** — how the new Sanity webhook replaces the Prismic webhook at `/api/revalidate`, what changes in that route
9. **Client Handoff** — what documentation/training the client needs for the new Studio
```

---

## Running the Agents

All agents can run in parallel. Each reads from the master plan and the codebase independently.

**Output files:**
- `llms/sanity-migration/phases/phase-0-repo-setup.md`
- `llms/sanity-migration/phases/phase-1-schema-design.md`
- `llms/sanity-migration/phases/phase-2-data-flow.md`
- `llms/sanity-migration/phases/phase-3-studio-visual-editing.md`
- `llms/sanity-migration/phases/phase-4-page-migration.md`
- `llms/sanity-migration/phases/phase-5-content-migration.md`
- `llms/sanity-migration/phases/phase-6-opta-testing-cutover.md`
