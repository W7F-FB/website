# Phase 0: Repo Setup & Foundation

> **Goal:** A clean new repo with all Prismic dependencies removed, Sanity installed, and a minimal Studio loading at `/studio`.
>
> **Prerequisites:** You already have a Sanity project created with a project ID and dataset.

---

## 1. Repo Setup

### 1.1 Create New GitHub Repository

```bash
# 1. Create the new repo on GitHub (private, no template, no README)
gh repo create w7f-website-sanity --private --confirm

# 2. From the current project root, create a clean copy
cd /path/to/parent-directory
cp -R w7f-website w7f-website-sanity
cd w7f-website-sanity

# 3. Remove the old git history and start fresh
rm -rf .git
git init
git remote add origin git@github.com:<your-org>/w7f-website-sanity.git

# 4. Initial commit with the current codebase
git add -A
git commit -m "Initial commit: clone of w7f-website before Sanity migration"
git branch -M main
git push -u origin main

# 5. Create the migration branch
git checkout -b sanity-migration
```

### 1.2 What to Preserve

- Full `src/` directory (will be modified in later phases)
- All non-Prismic config files (`tailwind.config.ts`, `postcss.config.mjs`, etc.)
- `src/app/api/opta/` — Opta integration is CMS-independent
- `src/app/api/klaviyo/`, `src/app/api/resend/` — email integrations unchanged
- `src/dolby/`, `src/hooks/`, `src/styles/`, `src/types/opta-feeds/`, `src/lib/`
- `src/components/ui/`, `src/components/blocks/`, `src/components/website-base/` (except Prismic-specific files listed in Section 2)
- `scripts/` directory — kept for reference during migration (deleted in a later phase)

---

## 2. Prismic Removal Checklist

### 2.1 Uninstall npm Packages

```bash
# Production dependencies
npm uninstall @prismicio/client @prismicio/next @prismicio/react

# Dev dependencies
npm uninstall @prismicio/types @slicemachine/adapter-next prismic-ts-codegen slice-machine-ui
```

**7 packages total:**

| Package | Type | Current Version |
|---------|------|----------------|
| `@prismicio/client` | dependency | ^7.21.0 |
| `@prismicio/next` | dependency | ^2.0.2 |
| `@prismicio/react` | dependency | ^3.2.2 |
| `@prismicio/types` | devDependency | ^0.2.9 |
| `@slicemachine/adapter-next` | devDependency | ^0.3.86 |
| `prismic-ts-codegen` | devDependency | ^0.1.28 |
| `slice-machine-ui` | devDependency | ^2.19.1 |

### 2.2 Remove the `slicemachine` Script from package.json

In `package.json`, delete this line from `"scripts"`:

```diff
- "slicemachine": "start-slicemachine"
```

### 2.3 Delete Prismic Files & Directories

```bash
# Core Prismic client files
rm src/prismicio.ts
rm src/cms/client.ts

# Prismic config files
rm slicemachine.config.json
rm prismicio-types.d.ts
rm prismicCodegen.config.ts

# Slice library (entire directory — 6 slices)
rm -rf src/cms/slices/

# Custom types (entire directory — 14 types)
rm -rf customtypes/

# Preview API routes
rm -rf src/app/api/preview/
rm -rf src/app/api/exit-preview/

# Slice simulator page
rm -rf src/app/slice-simulator/

# Prismic rich text component
rm src/components/website-base/prismic-rich-text.tsx
```

**Files deleted (detailed inventory):**

| Path | Contents |
|------|----------|
| `src/prismicio.ts` | Prismic client factory with route resolver |
| `src/cms/client.ts` | Duplicate Prismic client factory |
| `slicemachine.config.json` | Slice Machine config (repo name, adapter, library path) |
| `prismicio-types.d.ts` | Auto-generated Prismic types (~2,750 lines) |
| `prismicCodegen.config.ts` | Deprecated codegen config (disabled with warning) |
| `src/cms/slices/CommunityChampions/` | Slice: index.tsx, model.json, mocks.json, screenshot |
| `src/cms/slices/Divider/` | Slice: index.tsx, model.json, screenshot |
| `src/cms/slices/ImageWithText/` | Slice: index.tsx, model.json, mocks.json, screenshot |
| `src/cms/slices/NewsList/` | Slice: index.tsx, model.json, mocks.json, screenshot |
| `src/cms/slices/SubpageHero/` | Slice: index.tsx, model.json, mocks.json, screenshot |
| `src/cms/slices/TextBlock/` | Slice: index.tsx, model.json, mocks.json, screenshot |
| `src/cms/slices/index.ts` | Auto-generated slice component exports |
| `customtypes/awards/index.json` | Custom type definition |
| `customtypes/blog/index.json` | Custom type definition |
| `customtypes/broadcast_partners/index.json` | Custom type definition |
| `customtypes/image_with_text/index.json` | Custom type definition |
| `customtypes/match/index.json` | Custom type definition |
| `customtypes/page/index.json` | Custom type definition |
| `customtypes/player/index.json` | Custom type definition |
| `customtypes/policy/index.json` | Custom type definition |
| `customtypes/sponsor/index.json` | Custom type definition |
| `customtypes/team/index.json` | Custom type definition |
| `customtypes/team_member/index.json` | Custom type definition |
| `customtypes/testimonial/index.json` | Custom type definition |
| `customtypes/tournament/index.json` | Custom type definition |
| `customtypes/website/index.json` | Custom type definition |
| `src/app/api/preview/route.ts` | Prismic preview redirect handler |
| `src/app/api/exit-preview/route.ts` | Prismic exit-preview handler |
| `src/app/slice-simulator/page.tsx` | Slice Machine simulator page |
| `src/components/website-base/prismic-rich-text.tsx` | Custom PrismicRichText wrapper |

### 2.4 Clean Up layout.tsx

Edit `src/app/layout.tsx` to remove all Prismic references:

**Remove these lines:**

```diff
- import { PrismicPreview } from "@prismicio/next";
```

```diff
-        <Script
-          async
-          defer
-          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=world-sevens-football"
-        />
```

```diff
-        <PrismicPreview repositoryName="world-sevens-football" />
```

If the `Script` import from `next/script` is no longer used by anything else in the file, remove that import too.

**After cleanup, `layout.tsx` should look like:**

```tsx
import type { Metadata } from "next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

import "../styles/globals.css";

import { ClipPaths } from "@/components/ui/clip-paths";
import { MetallicGradients } from "@/components/website-base/icons";
import { ErrorHandler } from "@/components/website-base/error-handler";


export const metadata: Metadata = {
  title: "World Sevens Football",
  description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth scroll-pt-24 overscroll-auto lg:overscroll-none" data-scroll-behavior="smooth" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-PM4L7D3W" />
      <GoogleAnalytics gaId="G-MLFVZ11CHH" />
      <body className="w7f-v2 bg-background font-body min-h-dvh" suppressHydrationWarning>
        <ErrorHandler />
        <ClipPaths />
        <MetallicGradients />
        {children}
      </body>
    </html>
  );
}
```

### 2.5 Stub Out CMS Exports (Prevent Build Crashes)

The file `src/cms/index.ts` exports from deleted files and will crash the build. Replace its contents with stubs so that downstream imports don't blow up during Phase 0. These stubs will be replaced with real Sanity implementations in Phase 2.

**Replace `src/cms/index.ts` with:**

```typescript
// Stubbed CMS exports — Prismic removed, Sanity not yet wired up.
// These will be replaced in Phase 2 (Data Fetching Layer).

export function getNavigationTournaments() {
  console.warn("[CMS STUB] getNavigationTournaments called — not yet implemented");
  return Promise.resolve([]);
}

export function getTournaments() {
  console.warn("[CMS STUB] getTournaments called — not yet implemented");
  return Promise.resolve([]);
}

export function getTournamentByUid(_uid: string) {
  console.warn("[CMS STUB] getTournamentByUid called — not yet implemented");
  return Promise.resolve(null);
}

export function getPolicyBySlug(_slug: string) {
  console.warn("[CMS STUB] getPolicyBySlug called — not yet implemented");
  return Promise.resolve(null);
}

export function getPoliciesForNav() {
  console.warn("[CMS STUB] getPoliciesForNav called — not yet implemented");
  return Promise.resolve([]);
}

export function getSiteSettings() {
  console.warn("[CMS STUB] getSiteSettings called — not yet implemented");
  return Promise.resolve(null);
}

export function getFooterData() {
  console.warn("[CMS STUB] getFooterData called — not yet implemented");
  return Promise.resolve(null);
}

// Stub utilities
export function getImageUrl(_image: unknown): string | null {
  return null;
}

export function getImageAlt(_image: unknown): string {
  return "";
}

export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  return new Date(dateString);
}

// Stub types — will be replaced by Sanity schema-derived types
export type TournamentDocument = Record<string, unknown>;
export type PolicyDocument = Record<string, unknown>;
export type WebsiteDocument = Record<string, unknown>;
export type FooterColumnData = Record<string, unknown>;
export type SiteSettings = Record<string, unknown>;
```

Also **replace `src/cms/utils.ts` with:**

```typescript
// Stubbed — Prismic client removed. Will be replaced by Sanity utilities in Phase 2.

export function getImageUrl(_image: unknown): string | null {
  return null;
}

export function getImageAlt(_image: unknown): string {
  return "";
}

export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  return new Date(dateString);
}
```

### 2.6 Files NOT Deleted in Phase 0

These files contain Prismic imports but will be migrated in later phases. Do **not** delete them now:

| File | Phase | Why |
|------|-------|-----|
| `src/cms/queries/*.ts` (11 files) | Phase 2 | Rewritten to use GROQ/sanityFetch |
| `src/app/(website)/(home)/page.tsx` | Phase 3 | Page migration |
| `src/app/(website)/(subpages)/[uid]/page.tsx` | Phase 3 | SliceZone -> SectionRenderer |
| `src/app/(website)/(subpages)/news/[slug]/page.tsx` | Phase 3 | Query migration |
| `src/app/(website)/(subpages)/tournament/[slug]/**` | Phase 3 | Query migration |
| `src/app/(website)/(subpages)/club/[slug]/**` | Phase 3 | Query migration |
| `src/app/(website)/(subpages)/leadership/page.tsx` | Phase 3 | Query migration |
| `src/app/(website)/(subpages)/resources/[slug]/page.tsx` | Phase 3 | Query migration |
| `src/components/blocks/*.tsx` (using PrismicNextImage/PrismicLink) | Phase 3 | Component migration |
| `src/components/website-base/nav/nav-*.tsx` | Phase 3 | Nav migration |
| `src/lib/utils.ts` (mapBlogDocumentToMetadata) | Phase 3 | Type migration |
| `scripts/*.ts` (11 Prismic utility scripts) | Phase 4+ | Kept for reference |

These files will have TypeScript errors after Prismic packages are removed. That is expected — they will be fixed in their respective phases. The build will still pass because these pages are dynamically rendered and won't be statically analyzed at build time (they receive data via params/props at request time).

---

## 3. Sanity Installation

### 3.1 Install Packages

```bash
npm install sanity next-sanity @sanity/image-url @sanity/vision
```

| Package | Purpose |
|---------|---------|
| `sanity` | Core Sanity Studio framework |
| `next-sanity` | Next.js integration (defineLive, NextStudio, sanityFetch) |
| `@sanity/image-url` | Image URL builder for responsive images |
| `@sanity/vision` | GROQ playground plugin for the Studio |

### 3.2 Create Sanity Environment File

**Create `src/sanity/env.ts`:**

```typescript
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = '2025-03-04'

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
if (!dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET')
```

### 3.3 Create Sanity Client

**Create `src/sanity/client.ts`:**

```typescript
import { createClient } from 'next-sanity'
import { projectId, dataset, apiVersion } from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl: '/studio' },
})
```

### 3.4 Create Studio Configuration

**Create `src/sanity/sanity.config.ts`:**

```typescript
'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { projectId, dataset, apiVersion } from './env'

export default defineConfig({
  name: 'w7f-studio',
  title: 'World Sevens Football',
  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: apiVersion }),
  ],

  schema: {
    types: [],  // Schemas will be added in Phase 1
  },
})
```

> **Note:** The `'use client'` directive is required — the Studio config is used by client-side components.

### 3.5 Create Embedded Studio Route

**Create `src/app/studio/[[...tool]]/page.tsx`:**

```tsx
import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
```

### 3.6 Directory Structure After Phase 0

```
src/
  sanity/
    env.ts              # Environment variable validation
    client.ts           # Sanity client setup
    sanity.config.ts    # Studio configuration
  app/
    studio/
      [[...tool]]/
        page.tsx        # Embedded Studio route
```

---

## 4. Environment Variables

### 4.1 Variables to Remove

| Variable | Location |
|----------|----------|
| `NEXT_PUBLIC_PRISMIC_ENVIRONMENT` | `.env.local` line 7 |
| `PRISMIC_ACCESS_TOKEN` | `.env.local` line 8 |
| `PRISMIC_WRITE_TOKEN` | `.env.local` line 9 |

### 4.2 Variables to Add

| Variable | Value | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `<your-project-id>` | Sanity project identifier |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` | Sanity dataset name |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | `https://worldsevensfootball.com/studio` | Studio URL for visual editing |
| `SANITY_API_READ_TOKEN` | `<viewer-token>` | API token with Viewer rights |

### 4.3 Updated `.env.local` Template

```env
#Internal
PARTNER_INGEST_SECRET=d4f3127fa0c977e2b52cf59a0fa8f962ee2d94a3e120f12aac5dbed6cf4b91e0
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_OPTA_ENABLED=true

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=<your-project-id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_STUDIO_URL=https://worldsevensfootball.com/studio
SANITY_API_READ_TOKEN=<viewer-token>

#Klaviyo
KLAVIYO_API_KEY=pk_267610a9d61e60862eee610bc81684bf10

#Resend
RESEND_API_KEY=re_bnYFGk4E_NvJVJgHfjmJsakhvsVAyeZQW

#Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
NEXT_PUBLIC_SUPABASE_URL="https://aucusaxsdyrwmwpxhpgl.supabase.co"
SUPABASE_POSTGRES_DATABASE="postgres"
SUPABASE_POSTGRES_HOST="db.aucusaxsdyrwmwpxhpgl.supabase.co"
SUPABASE_POSTGRES_PASSWORD="..."
SUPABASE_POSTGRES_PRISMA_URL="..."
SUPABASE_POSTGRES_URL="..."
SUPABASE_POSTGRES_URL_NON_POOLING="..."
SUPABASE_POSTGRES_USER="postgres"
SUPABASE_JWT_SECRET="..."
SUPABASE_SERVICE_ROLE_KEY="..."
SUPABASE_URL="https://aucusaxsdyrwmwpxhpgl.supabase.co"

# OPTA
OPTA_USERNAME=WorldSevensFootball
OPTA_PASSWORD=zuBZ2fO7603h
```

### 4.4 How to Get the Sanity API Token

1. Go to [sanity.io/manage](https://sanity.io/manage)
2. Select your project
3. Go to **API** > **Tokens**
4. Create a new token with **Viewer** permissions
5. Copy the token into `SANITY_API_READ_TOKEN`

---

## 5. Next.js Config Updates

### 5.1 Replace Prismic Image Hostname with Sanity CDN

Edit `next.config.ts` — replace the `images.prismic.io` entry with `cdn.sanity.io`:

```diff
  images: {
    remotePatterns: [
      {
        protocol: 'https',
-       hostname: 'images.prismic.io',
+       hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'omo.akamai.opta.net',
        port: '',
        pathname: '/image.php',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
```

### 5.2 Everything Else Stays

- `compiler.styledComponents: true` — still needed (project uses styled-components)
- `redirects()` — unchanged (URL routing, not CMS-dependent)
- Opta image hostname (`omo.akamai.opta.net`) — unchanged
- Supabase image hostname (`*.supabase.co`) — unchanged

---

## 6. TypeScript Config

**No changes needed.**

The existing `tsconfig.json` path alias already covers Sanity:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Since Sanity files live at `src/sanity/`, they are already accessible as `@/sanity/...`. No additional path aliases required.

The `exclude` array includes `"studio-website"` which appears to be a legacy entry — it can be left as-is or removed, but it does not affect the migration.

---

## 7. Gitignore Updates

Add the following entry to `.gitignore`:

```diff
+ # sanity
+ .sanity/
```

Also remove the now-irrelevant Prismic comment:

```diff
- # prismic types - use prismicio-types.d.ts instead
- types.generated.ts
+ # legacy generated types (no longer used)
+ types.generated.ts
```

**Full `.gitignore` addition (append to end of file):**

```gitignore
# sanity
.sanity/
```

---

## 8. Verification Checklist

Run through each item to confirm Phase 0 is complete:

### 8.1 Prismic Fully Removed

```bash
# Should return NO results for deleted files/directories:
ls src/prismicio.ts 2>/dev/null && echo "FAIL: src/prismicio.ts still exists" || echo "PASS"
ls src/cms/client.ts 2>/dev/null && echo "FAIL: src/cms/client.ts still exists" || echo "PASS"
ls slicemachine.config.json 2>/dev/null && echo "FAIL: slicemachine.config.json still exists" || echo "PASS"
ls prismicio-types.d.ts 2>/dev/null && echo "FAIL: prismicio-types.d.ts still exists" || echo "PASS"
ls prismicCodegen.config.ts 2>/dev/null && echo "FAIL: prismicCodegen.config.ts still exists" || echo "PASS"
ls -d src/cms/slices/ 2>/dev/null && echo "FAIL: src/cms/slices/ still exists" || echo "PASS"
ls -d customtypes/ 2>/dev/null && echo "FAIL: customtypes/ still exists" || echo "PASS"
ls -d src/app/api/preview/ 2>/dev/null && echo "FAIL: src/app/api/preview/ still exists" || echo "PASS"
ls -d src/app/api/exit-preview/ 2>/dev/null && echo "FAIL: src/app/api/exit-preview/ still exists" || echo "PASS"
ls -d src/app/slice-simulator/ 2>/dev/null && echo "FAIL: src/app/slice-simulator/ still exists" || echo "PASS"
ls src/components/website-base/prismic-rich-text.tsx 2>/dev/null && echo "FAIL: prismic-rich-text.tsx still exists" || echo "PASS"
```

```bash
# Prismic packages should not be in package.json:
grep -c "prismicio\|slicemachine\|prismic-ts-codegen\|slice-machine-ui" package.json
# Expected: 0
```

```bash
# No Prismic references in layout.tsx:
grep -c "prismic\|PrismicPreview" src/app/layout.tsx
# Expected: 0
```

### 8.2 Sanity Installed & Configured

```bash
# Sanity packages should be in package.json:
grep "sanity" package.json
# Expected: sanity, next-sanity, @sanity/image-url, @sanity/vision

# Sanity files exist:
ls src/sanity/env.ts && echo "PASS" || echo "FAIL"
ls src/sanity/client.ts && echo "PASS" || echo "FAIL"
ls src/sanity/sanity.config.ts && echo "PASS" || echo "FAIL"
ls src/app/studio/\[\[...tool\]\]/page.tsx && echo "PASS" || echo "FAIL"
```

### 8.3 Environment Variables

```bash
# Prismic vars should NOT be in .env.local:
grep -c "PRISMIC" .env.local
# Expected: 0

# Sanity vars should be in .env.local:
grep "NEXT_PUBLIC_SANITY_PROJECT_ID" .env.local && echo "PASS" || echo "FAIL"
grep "NEXT_PUBLIC_SANITY_DATASET" .env.local && echo "PASS" || echo "FAIL"
grep "SANITY_API_READ_TOKEN" .env.local && echo "PASS" || echo "FAIL"
```

### 8.4 Studio Loads

```bash
npm run dev
```

1. Navigate to `http://localhost:3000/studio`
2. The Sanity Studio should load with the "World Sevens Football" title
3. The schema list will be empty (schemas are added in Phase 1) — this is expected
4. The GROQ Vision plugin should be accessible from the Studio toolbar

### 8.5 Build Passes

```bash
npm run build
```

The build should complete. There may be TypeScript warnings in files that still import from `@prismicio/*` (query files, page files, components) — this is expected and will be resolved in subsequent phases. The stubbed `src/cms/index.ts` and `src/cms/utils.ts` prevent the most critical import chain failures.

If the build fails due to TypeScript errors in files that import from deleted Prismic packages, those files need their imports temporarily commented out or the `// @ts-nocheck` directive added at the top. This is acceptable as a temporary measure — all these files will be rewritten in Phases 2-3.

### 8.6 Next.js Config

```bash
# Verify Sanity CDN is configured:
grep "cdn.sanity.io" next.config.ts && echo "PASS" || echo "FAIL"

# Verify Prismic hostname is removed:
grep -c "images.prismic.io" next.config.ts
# Expected: 0
```

### 8.7 Gitignore

```bash
grep ".sanity/" .gitignore && echo "PASS" || echo "FAIL"
```

---

## Summary of Changes

| Action | Count |
|--------|-------|
| npm packages uninstalled | 7 |
| Files/directories deleted | 30+ |
| Files created | 4 (env.ts, client.ts, sanity.config.ts, studio page.tsx) |
| Files modified | 5 (package.json, layout.tsx, next.config.ts, .env.local, .gitignore) |
| Files stubbed | 2 (cms/index.ts, cms/utils.ts) |
| Files intentionally left with TS errors | ~30 (fixed in Phases 2-3) |

---

*Phase document authored: 2026-02-17*
*Next phase: Phase 1 — Sanity Schema Design (document schemas, object schemas, section schemas, custom desk structure)*
