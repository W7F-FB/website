# Phase 6: Opta Integration, Testing & Cutover

*Generated: 2026-02-17*
*Prerequisite: Phases 1–5 complete (Sanity Studio, data layer, page migration, content migration, visual editing)*

---

## Table of Contents

1. [Opta Integration Audit](#1-opta-integration-audit)
2. [Opta Code Changes](#2-opta-code-changes)
3. [Non-CMS Integration Inventory](#3-non-cms-integration-inventory)
4. [Comprehensive Test Plan](#4-comprehensive-test-plan)
5. [Performance Benchmarks](#5-performance-benchmarks)
6. [Risk Register](#6-risk-register)
7. [Cutover Runbook](#7-cutover-runbook)
8. [Revalidation Strategy](#8-revalidation-strategy)
9. [Client Handoff](#9-client-handoff)

---

## 1. Opta Integration Audit

### 1.1 Architecture Overview

The Opta integration is a **clean, layered system** with CMS data touching Opta data only at the page/component level. The Opta API layer itself (`src/app/api/opta/`, `src/lib/opta/`, `src/types/opta-feeds/`) has **zero CMS dependencies** and requires no changes.

```
┌─────────────────────────────────────────────────────────┐
│ Page Layer (CMS + Opta merge here)                      │
│  - Home page, Tournament page, Club page, Match page    │
│  - NavMain (receives merged data as props)              │
├─────────────────────────────────────────────────────────┤
│ Query Layer (CMS queries fetch opta_* fields)           │
│  - src/cms/queries/tournaments.ts                       │
│  - src/cms/queries/team.ts                              │
│  - src/cms/queries/match.ts                             │
├─────────────────────────────────────────────────────────┤
│ Utility Layer (merges CMS teams with Opta data)         │
│  - src/lib/opta/match-data.ts                           │
│  - src/lib/match-url.ts                                 │
│  - src/components/blocks/match/utils.ts                 │
│  - src/app/(website)/(subpages)/tournament/utils.ts     │
├─────────────────────────────────────────────────────────┤
│ Opta API Layer (UNCHANGED - zero CMS dependency)        │
│  - src/app/api/opta/client.ts                           │
│  - src/app/api/opta/feeds.ts                            │
│  - src/app/api/opta/f*/route.ts (7 route handlers)      │
│  - src/types/opta-feeds/* (9 type definition files)     │
│  - src/lib/opta/utils.ts, formatters.ts, dictionaries/* │
└─────────────────────────────────────────────────────────┘
```

### 1.2 Files That Touch Both Opta AND CMS Data

Every file listed below reads CMS data (currently Prismic) and uses it to connect with Opta data. These are the files that need updating.

#### Page-Level Files (Data Fetching)

| File | Line References | What It Does with Opta+CMS |
|------|----------------|---------------------------|
| `src/app/(website)/(home)/page.tsx` | L34, L36, L117-118, L135-138, L141, L152-154, L183-184, L186-190 | Reads `tournament.data.opta_competition_id`, `tournament.data.opta_season_id`, `team.data.opta_id` to find tournament champions and live fixtures |
| `src/app/(website)/(subpages)/tournament/[slug]/page.tsx` | L117-118, L129, L131-134, L140-141, L144 | Reads `tournament.data.opta_competition_id`, `tournament.data.opta_season_id`, `team.data.opta_id` for standings, fixtures, team stats |
| `src/app/(website)/(subpages)/tournament/[slug]/match/[matchSlug]/page.tsx` | L68-69, L73-74, L77, L139-141 | Reads `tournament.data.opta_competition_id`, `tournament.data.opta_season_id`, `match.data.opta_id` for detailed match data |
| `src/app/(website)/(subpages)/club/[slug]/page.tsx` | L87-90, L92-96, L108, L130, L136-138 | Reads `tournament.data.opta_competition_id`, `tournament.data.opta_season_id`, `team.data.opta_id` for squad, standings, fixtures |

#### Utility Files (Data Merging)

| File | Line References | What It Does with Opta+CMS |
|------|----------------|---------------------------|
| `src/components/blocks/match/utils.ts` | L3, L75-76, L102-106, L123-124, L167-170, L200-205, L212-213, L249-252, L294-309 | `GameCardData` type uses `TeamDocument` (Prismic). Finds Prismic teams by matching `t.data.opta_id === homeTeamRef`. Uses `getImageUrl(team.data.logo)` for team logos |
| `src/lib/opta/match-data.ts` | L6, L102-116 | Imports `TeamDocument` from prismicio-types. `getMatchCardData()` accepts `prismicTeams: TeamDocument[]` parameter |
| `src/lib/match-url.ts` | L1-3, L9-10, L14-22, L29-39 | Imports `TournamentDocument`, `MatchDocument` from prismicio-types. Builds match slug maps from `matchData.opta_id` |
| `src/app/(website)/(subpages)/tournament/utils.ts` | (multiple) | Uses Prismic team/match documents alongside Opta fixture data for grouping, ranking, placeholder resolution |

#### Query Files (CMS Queries That Fetch Opta Fields)

| File | Line References | What It Does |
|------|----------------|-------------|
| `src/cms/queries/tournaments.ts` | L67-90 | `getTournamentByOptaCompetitionId()` — filters by `t.data.opta_competition_id` and `t.data.opta_season_id` |
| `src/cms/queries/team.ts` | L77-94, L116-131, L136-150 | `getTeamsByTournament()` — fetchLinks includes `tournament.opta_enabled`, `tournament.opta_competition_id`, `tournament.opta_season_id`. `getTeamByOptaId()` — filters by `my.team.opta_id`. `getTeamsByOptaIds()` — filters by array of opta_ids |
| `src/cms/queries/match.ts` | L3, L17-35 | Imports `normalizeOptaId`. `getMatchByOptaId()` — finds match by normalized `m.data.opta_id` |

### 1.3 Complete Field Access Path Changes

The migration changes how CMS fields are accessed. In Prismic, documents have a `.data` accessor. In Sanity with GROQ, resolved fields are at the top level.

| Prismic Access Path | Sanity Access Path | Used In |
|---------------------|--------------------|---------|
| `tournament.data.opta_competition_id` | `tournament.optaCompetitionId` | Home page, tournament page, club page, match page |
| `tournament.data.opta_season_id` | `tournament.optaSeasonId` | Home page, tournament page, club page, match page |
| `tournament.data.opta_enabled` | `tournament.optaEnabled` | team.ts query (fetchLinks) |
| `tournament.data.status` | `tournament.status` | Home page, tournament page |
| `tournament.data.title` | `tournament.title` | Tournament page, match page breadcrumbs |
| `tournament.data.nickname` | `tournament.nickname` | Match page breadcrumbs |
| `tournament.data.matches` | `tournament.matches[]->` | match-url.ts `buildMatchSlugMap()` |
| `tournament.data.awards` | `tournament.awards[]->` | Tournament page awards section |
| `tournament.data.navigation_order` | `tournament.navigationOrder` | Home page sorting |
| `tournament.data.number_of_teams` | `tournament.numberOfTeams` | Home page club list |
| `tournament.uid` | `tournament.slug.current` | All page routing |
| `team.data.opta_id` | `team.optaId` | Match utils, home page, club page, tournament page |
| `team.data.name` | `team.name` | Match page fallback names |
| `team.data.logo` | `team.logo` | Match utils `getImageUrl(team.data.logo)` → `team.logo` |
| `team.data.key` | `team.key` | Match utils short name |
| `team.data.alphabetical_sort_string` | `team.alphabeticalSortString` | Home page club sorting |
| `team.data.tournaments` | `team.tournaments[]->` | Club page tournament lookup |
| `match.data.opta_id` | `match.optaId` | Match page, match-url.ts |
| `match.data.home_team` | `match.homeTeam->` | Match utils |
| `match.data.away_team` | `match.awayTeam->` | Match utils |
| `match.data.start_time` | `match.startTime` | Match utils |

### 1.4 Files That Are UNCHANGED

These files have zero CMS dependency and require no migration work:

| File/Directory | Reason |
|---------------|--------|
| `src/app/api/opta/client.ts` | Pure HTTP client for Opta API — uses env vars only |
| `src/app/api/opta/feeds.ts` | Service layer wrapping OptaClient — no CMS imports |
| `src/app/api/opta/f*/route.ts` (7 files) | Route handlers — pass-through to feeds.ts |
| `src/types/opta-feeds/` (9 files) | TypeScript type definitions for Opta XML/JSON feeds |
| `src/lib/opta/utils.ts` | `normalizeOptaId()`, `getStatusDisplay()`, `getMatchTeams()` — Opta-only |
| `src/lib/opta/formatters.ts` | Display formatting utilities — no CMS dependency |
| `src/lib/opta/dictionaries/` (3 files) | Stat, qualifier, position dictionaries — static data |
| `src/lib/opta/get-team-leaders.ts` | Team leader calculations — Opta-only |
| `src/lib/opta/calculate-match-standouts.ts` | Match standout calculations — Opta-only |

---

## 2. Opta Code Changes

All changes are mechanical find-and-replace level. The Opta API calls, XML parsing, and feed processing are completely untouched.

### 2.1 Home Page (`src/app/(website)/(home)/page.tsx`)

**Import changes:**
```typescript
// BEFORE
import type { TeamDocument } from "../../../../prismicio-types";
import type { TournamentDocument } from "../../../../prismicio-types";

// AFTER
// TeamDocument and TournamentDocument types come from Sanity GROQ inference
// or from manually defined types in src/sanity/types.ts
import type { TeamResult, TournamentResult } from "@/sanity/types";
```

**Field access changes:**

```typescript
// BEFORE (L34)
if (tournament.data.status === "Complete" && tournament.data.opta_competition_id && tournament.data.opta_season_id) {

// AFTER
if (tournament.status === "Complete" && tournament.optaCompetitionId && tournament.optaSeasonId) {
```

```typescript
// BEFORE (L36)
const fixtures = await getF1Fixtures(tournament.data.opta_competition_id, tournament.data.opta_season_id);

// AFTER
const fixtures = await getF1Fixtures(tournament.optaCompetitionId, tournament.optaSeasonId);
```

```typescript
// BEFORE (L127-128)
const completeTournaments = allTournaments
    .filter(t => t.data.status === "Complete")
    .sort((a, b) => (b.data.navigation_order || 0) - (a.data.navigation_order || 0));

// AFTER
const completeTournaments = allTournaments
    .filter(t => t.status === "Complete")
    .sort((a, b) => (b.navigationOrder || 0) - (a.navigationOrder || 0));
```

```typescript
// BEFORE (L135-138)
if (t.data.opta_competition_id && t.data.opta_season_id && t.uid) {
    const [fixtures, teams] = await Promise.all([
        getF1Fixtures(t.data.opta_competition_id, t.data.opta_season_id),
        getTeamsByTournament(t.uid)
    ]);

// AFTER
if (t.optaCompetitionId && t.optaSeasonId && t.slug?.current) {
    const [fixtures, teams] = await Promise.all([
        getF1Fixtures(t.optaCompetitionId, t.optaSeasonId),
        getTeamsByTournament(t.slug.current)
    ]);
```

```typescript
// BEFORE (L152-154)
champion = teams.find(
    team => normalizeOptaId(`t${team.data.opta_id}`) === winnerOptaId
) || null;

// AFTER
champion = teams.find(
    team => normalizeOptaId(`t${team.optaId}`) === winnerOptaId
) || null;
```

```typescript
// BEFORE (L183-184)
const competitionId = liveTournament.data.opta_competition_id;
const seasonId = liveTournament.data.opta_season_id;

// AFTER
const competitionId = liveTournament.optaCompetitionId;
const seasonId = liveTournament.optaSeasonId;
```

### 2.2 Tournament Page (`src/app/(website)/(subpages)/tournament/[slug]/page.tsx`)

```typescript
// BEFORE (L117-118)
const competitionId = tournament.data.opta_competition_id
const seasonId = tournament.data.opta_season_id

// AFTER
const competitionId = tournament.optaCompetitionId
const seasonId = tournament.optaSeasonId
```

```typescript
// BEFORE (L129)
if (competitionId && seasonId && tournament.uid && (status === "Live" || status === "Complete")) {

// AFTER
if (competitionId && seasonId && tournament.slug?.current && (status === "Live" || status === "Complete")) {
```

```typescript
// BEFORE (L134)
getTeamsByTournament(tournament.uid)

// AFTER
getTeamsByTournament(tournament.slug.current)
```

```typescript
// BEFORE (L140-141)
const uniqueTeamIds = prismicTeams
    .map(team => team.data.opta_id)
    .filter((id): id is string => !!id)

// AFTER
const uniqueTeamIds = teams
    .map(team => team.optaId)
    .filter((id): id is string => !!id)
```

### 2.3 Match Page (`src/app/(website)/(subpages)/tournament/[slug]/match/[matchSlug]/page.tsx`)

```typescript
// BEFORE (L68-69)
const competitionId = tournament.data.opta_competition_id;
const seasonId = tournament.data.opta_season_id;

// AFTER
const competitionId = tournament.optaCompetitionId;
const seasonId = tournament.optaSeasonId;
```

```typescript
// BEFORE (L73)
const optaId = match.data.opta_id;

// AFTER
const optaId = match.optaId;
```

```typescript
// BEFORE (L139-144)
const [homeTeamPrismic, awayTeamPrismic, broadcastPartners, prismicTeams, matchBlogs] = await Promise.all([
    homeTeamId ? getTeamByOptaId(normalizeOptaId(homeTeamId)) : null,
    awayTeamId ? getTeamByOptaId(normalizeOptaId(awayTeamId)) : null,
    getAllBroadcastPartners(),
    getTeamsByTournament(tournament.uid),
    getBlogsByMatch(match.id).catch(() => []),
]);

// AFTER
const [homeTeamSanity, awayTeamSanity, broadcastPartners, teams, matchBlogs] = await Promise.all([
    homeTeamId ? getTeamByOptaId(normalizeOptaId(homeTeamId)) : null,
    awayTeamId ? getTeamByOptaId(normalizeOptaId(awayTeamId)) : null,
    getAllBroadcastPartners(),
    getTeamsByTournament(tournament.slug.current),
    getBlogsByMatch(match._id).catch(() => []),
]);
```

### 2.4 Club Page (`src/app/(website)/(subpages)/club/[slug]/page.tsx`)

```typescript
// BEFORE (L87-90)
const competitionId = currentTournament?.data.opta_competition_id;
const seasonId = currentTournament?.data.opta_season_id;
const teamOptaId = team.data.opta_id;
const teamOptaIdNumeric = teamOptaId?.toString().replace("t", "") || "";

// AFTER
const competitionId = currentTournament?.optaCompetitionId;
const seasonId = currentTournament?.optaSeasonId;
const teamOptaId = team.optaId;
const teamOptaIdNumeric = teamOptaId?.toString().replace("t", "") || "";
```

```typescript
// BEFORE (L108)
const uniqueOptaIds = [...new Set(allTeamRefs.map((ref) => ref.replace("t", "")))];

// AFTER (unchanged — this is Opta-only logic, no CMS access)
const uniqueOptaIds = [...new Set(allTeamRefs.map((ref) => ref.replace("t", "")))];
```

### 2.5 Match Utils (`src/components/blocks/match/utils.ts`)

```typescript
// BEFORE (L3)
import type { TeamDocument, MatchDocument } from "../../../../prismicio-types"

// AFTER
import type { TeamResult, MatchResult } from "@/sanity/types"
```

```typescript
// BEFORE (L123-124)
const homeTeam = prismicTeams.find(t => t.data.opta_id === homeTeamRef)
const awayTeam = prismicTeams.find(t => t.data.opta_id === awayTeamRef)

// AFTER
const homeTeam = teams.find(t => t.optaId === homeTeamRef)
const awayTeam = teams.find(t => t.optaId === awayTeamRef)
```

```typescript
// BEFORE (L167-170)
const homeLogoUrl = homeTeam ? getImageUrl(homeTeam.data.logo) : null
const awayLogoUrl = awayTeam ? getImageUrl(awayTeam.data.logo) : null
const homeLogoAlt = homeTeam ? getImageAlt(homeTeam.data.logo) : ""
const awayLogoAlt = awayTeam ? getImageAlt(awayTeam.data.logo) : ""

// AFTER
const homeLogoUrl = homeTeam ? sanityImageUrl(homeTeam.logo) : null
const awayLogoUrl = awayTeam ? sanityImageUrl(awayTeam.logo) : null
const homeLogoAlt = homeTeam?.logo?.alt || ""
const awayLogoAlt = awayTeam?.logo?.alt || ""
```

```typescript
// BEFORE (L212-213)
const homeTeam = prismicTeams.find(t => t.data.opta_id === homeTeamRef)
const awayTeam = prismicTeams.find(t => t.data.opta_id === awayTeamRef)

// AFTER
const homeTeam = teams.find(t => t.optaId === homeTeamRef)
const awayTeam = teams.find(t => t.optaId === awayTeamRef)
```

### 2.6 Match Data Utils (`src/lib/opta/match-data.ts`)

```typescript
// BEFORE (L6)
import type { TeamDocument } from "../../../prismicio-types"

// AFTER
import type { TeamResult } from "@/sanity/types"
```

```typescript
// BEFORE (L102-106)
export async function getMatchCardData(
    matchId: string,
    fixture: F1MatchData,
    prismicTeams: TeamDocument[],
    optaTeams: F1TeamData[]
): Promise<GameCardData> {

// AFTER
export async function getMatchCardData(
    matchId: string,
    fixture: F1MatchData,
    teams: TeamResult[],
    optaTeams: F1TeamData[]
): Promise<GameCardData> {
```

### 2.7 Match URL Utils (`src/lib/match-url.ts`)

```typescript
// BEFORE (L1-3)
import { isFilled } from "@prismicio/client";
import { normalizeOptaId } from "@/lib/opta/utils";
import type { TournamentDocument, MatchDocument } from "../../prismicio-types";

// AFTER
import { normalizeOptaId } from "@/lib/opta/utils";
import type { TournamentResult, MatchResult } from "@/sanity/types";
```

```typescript
// BEFORE (L9-26)
export function buildMatchSlugMap(tournament: TournamentDocument): Map<string, string> {
    const map = new Map<string, string>();
    if (!tournament.data.matches) return map;
    for (const item of tournament.data.matches) {
        if (!isFilled.contentRelationship(item.match)) continue;
        const matchData = item.match.data;
        const matchUid = item.match.uid;
        if (matchData && matchUid && matchData.opta_id) {
            const normalizedOptaId = normalizeOptaId(matchData.opta_id);
            map.set(normalizedOptaId, matchUid);
        }
    }
    return map;
}

// AFTER
export function buildMatchSlugMap(tournament: TournamentResult): Map<string, string> {
    const map = new Map<string, string>();
    if (!tournament.matches) return map;
    for (const match of tournament.matches) {
        if (!match?.optaId || !match?.slug?.current) continue;
        const normalizedId = normalizeOptaId(match.optaId);
        map.set(normalizedId, match.slug.current);
    }
    return map;
}
```

### 2.8 CMS Query Files

These files are being entirely rewritten as part of Phase 2 (Data Fetching Layer), so the Opta field changes are part of that rewrite. The key changes:

- `src/cms/queries/tournaments.ts` → GROQ queries use `optaCompetitionId`, `optaSeasonId` instead of `opta_competition_id`, `opta_season_id`
- `src/cms/queries/team.ts` → `getTeamByOptaId()` uses GROQ filter `*[_type == "team" && optaId == $optaId]`
- `src/cms/queries/match.ts` → `getMatchByOptaId()` uses GROQ filter `*[_type == "match" && optaId == $optaId]`

---

## 3. Non-CMS Integration Inventory

Every non-CMS integration was read and verified. **All require zero changes.**

### 3.1 Klaviyo (Email Marketing) — NO CHANGES NEEDED

| File | What It Does |
|------|-------------|
| `src/app/api/klaviyo/subscribe/route.ts` | API route accepting email/firstName/lastName/phone/listId. Creates Klaviyo profiles and subscription jobs. |
| `src/components/blocks/stay-updated-banner.tsx` | Newsletter signup form → POST `/api/klaviyo/subscribe` with list ID `UrjmkJ` |
| `src/components/forms/form-footer-subscribe.tsx` | Footer email signup → POST `/api/klaviyo/subscribe` with list ID `UrjmkJ` |
| `src/components/blocks/forms/vip-cabanas/private-vip-form.tsx` | VIP inquiry form → POST `/api/klaviyo/subscribe` with list IDs `SAqwTH` + `UrjmkJ` |

**CMS interaction:** None. Pure client-side form → API route → Klaviyo API. No Prismic imports, no CMS data.

### 3.2 Resend (Transactional Email) — NO CHANGES NEEDED

| File | What It Does |
|------|-------------|
| `src/app/api/resend/send/route.ts` | Generic email sender: accepts `to`, `cc`, `subject`, `html`, `replyTo`, `fromName`. Uses Resend SDK. |
| `src/app/api/resend/vip-cabana/route.ts` | VIP-specific email route with same pattern |
| `src/app/(website)/(subpages)/contact/page-content.tsx` | Contact form → POST `/api/resend/send`. Routes to topic-specific emails (careers@, ticketing@, media@, etc.) |

**CMS interaction:** None. Form data flows directly to email. Hardcoded recipient addresses.

### 3.3 Supabase (Video Highlights) — NO CHANGES NEEDED

| File | What It Does |
|------|-------------|
| `src/lib/supabase/client.ts` | Supabase client initialization from env vars |
| `src/lib/supabase/queries/highlights.ts` | Queries `"Match Highlights"` table by `opta_match_id`. Functions: `getHighlightsByMatchId()`, `getMatchRecap()`, `getRecapVideosForMatches()` |
| `src/lib/supabase/hightlight-ingest.ts` | Ingests highlight videos from WCS API. Maps Opta match IDs to Supabase records |

**CMS interaction:** None. Links to Opta data via `opta_match_id` (stored in Supabase, not CMS). Supabase schema is independent of CMS structure.

### 3.4 Millicast + Dolby (Ref Cam Streaming) — NO CHANGES NEEDED

| File | What It Does |
|------|-------------|
| `src/dolby/ref-cam-config.ts` | Millicast stream configuration: `streamAccountId`, `streamName`, `subscriberToken` |
| `src/dolby/ref-cam-context.tsx` | React context for ref cam state management |
| `src/dolby/dolby-ref-cam-ip-list.ts` | IP whitelist for Dolby access control |
| `src/app/api/check-ref-cam/route.ts` | Health check endpoint — validates Millicast Director API availability |

**CMS interaction:** None. Pure streaming infrastructure with env-var configuration.

### 3.5 GTM / Google Analytics — NO CHANGES NEEDED

| File | What It Does |
|------|-------------|
| `src/app/layout.tsx` | `<GoogleTagManager gtmId="GTM-PM4L7D3W" />` and `<GoogleAnalytics gaId="G-MLFVZ11CHH" />` |

**CMS interaction:** None. Static configuration in root layout. The layout file will be modified for Sanity (`SanityLive` component), but GTM/GA lines remain unchanged.

---

## 4. Comprehensive Test Plan

### 4.1 Homepage (`/`)

| Test Case | Expected Behavior | Edge Cases |
|-----------|-------------------|------------|
| Tournament champions carousel | Shows completed tournaments with correct champion team logos and names | Tournament with no Final match in Opta; champion team missing from Sanity |
| Live tournament fixture slider | Displays current match scores, live minutes, team logos | No live tournament; all matches in PreMatch state |
| Club list section | Shows teams sorted alphabetically with placement badges (1st–4th) | Tournament with fewer than 4 teams; team without `opta_id` |
| Recent news section | 4 most recent blog posts sorted by date field, then publication date | No blog posts exist; blog without date field |
| Tournament recap blog | Featured recap blog card | No tournament recap category posts |
| **Opta verification** | Champions match Opta Final winner IDs; live scores update correctly | Verify `normalizeOptaId()` still strips prefixes correctly |
| **Image verification** | All team logos load from Sanity CDN (`cdn.sanity.io`) | Missing logo field; large image dimensions |
| **Rich text verification** | N/A — homepage uses structured data, not rich text | — |

### 4.2 Tournament Page (`/tournament/[slug]`)

| Test Case | Expected Behavior | Edge Cases |
|-----------|-------------------|------------|
| **Upcoming state** | Shows tournament info without Opta data | Tournament with no start date |
| **Live state** | Full standings, fixtures grouped by date, live scores, team stat sheets | All matches pre-match; single match live |
| **Complete state** | Final standings, all results, awards section, recap videos | Missing awards data; no recap videos |
| F3 Standings table | Teams ranked correctly with W-L-D records | Tied teams; teams with 0 matches |
| F1 Fixtures grid | Matches grouped by date, correct home/away assignment | Match with TBD teams (placeholder names from Opta) |
| F9 Match details | Live scores, period display (FT, AET, FT/PKs), goal scorers | Penalty shootout with ShootOutScore |
| F30 Team stats | Per-team season statistics | Team with zero stats; missing stat keys |
| Broadcast partner logos | Correct broadcast partner display | Missing broadcast partner UID |
| **Opta verification** | `opta_competition_id` and `opta_season_id` map to correct Opta feeds | Verify same IDs produce same F1/F3/F30 data as current Prismic site |
| **Image verification** | Team logos, tournament images load from Sanity CDN | — |
| **Rich text verification** | Tournament descriptions render from Portable Text | — |

### 4.3 Match Page (`/tournament/[slug]/match/[matchSlug]`)

| Test Case | Expected Behavior | Edge Cases |
|-----------|-------------------|------------|
| Match header | Correct teams, scores, period status | Match hasn't started (PreMatch) |
| F9 detailed stats | Team stats comparison (possession, shots, passes) | Match with no F9 data available |
| F13 commentary | Play-by-play events with timestamps | No commentary available; non-English language |
| F24 events | Event timeline (goals, cards, substitutions) | No events; delayed event data |
| F2 preview | Pre-match team comparison | Preview not available for older matches |
| F40 squad lineups | Starting XI with player positions | Player not in squad list |
| Broadcast partners | Where to watch links | No broadcast partners assigned |
| Match blogs | Related articles | No match-linked blogs |
| Highlight videos | Supabase video embeds by opta_match_id | No highlights available |
| Breadcrumbs | Home > Tournament Name > Team A vs Team B | Long team names; special characters |
| **Opta verification** | `match.optaId` resolves to correct F9/F13/F24 data | Verify `normalizeOptaId()` works with `g`-prefixed IDs |
| **Image verification** | Team logos from Sanity; broadcast partner logos | — |

### 4.4 Club Page (`/club/[slug]`)

| Test Case | Expected Behavior | Edge Cases |
|-----------|-------------------|------------|
| Team header | Team name, logo, colors | Team without logo |
| F40 Squad roster | Full player list with positions, jersey numbers | Team not in Opta squad data |
| F3 Standings position | Current ranking in tournament | Team in multiple tournaments |
| F1 Fixtures list | Team's match schedule and results | No fixtures available |
| F30 Season stats | Team performance statistics | No stats for team |
| Team-specific blogs | Articles linked to this team | No team blogs |
| Tournament history | List of tournaments this team has participated in | Team in zero tournaments |
| **Opta verification** | `team.optaId` matches F40 `Team.uID` correctly | Verify `t` prefix handling with `teamOptaIdWithPrefix` |
| **Image verification** | Team logo and player images from Sanity CDN | — |

### 4.5 News Pages (`/news/[slug]`)

| Test Case | Expected Behavior | Edge Cases |
|-----------|-------------------|------------|
| Blog post rendering | Title, date, author, body content | Post without date; post without author |
| Rich text body | Headings, paragraphs, lists, links, images, embeds | Nested lists; consecutive headings; large images |
| Category display | Blog category label and filtering | Uncategorized post |
| Related content | Tournament/team links if present | No related content |
| **Image verification** | Inline images and hero image from Sanity CDN | Wide images; tall images; SVG |
| **Rich text verification** | Compare Portable Text rendering vs current Prismic rich text | Bold, italic, links, image embeds, video embeds |

### 4.6 Dynamic Pages (`/[uid]` — About, Fan Experience, etc.)

| Test Case | Expected Behavior | Edge Cases |
|-----------|-------------------|------------|
| Section rendering | All section types render correctly via SectionRenderer | Empty sections; single section page |
| Section types: SubpageHero | Hero image, title, subtitle | Missing image |
| Section types: TextBlock | Rich text content | Empty text block |
| Section types: ImageWithText | Image + text side by side | Missing image |
| Section types: NewsList | Blog post cards | No matching posts |
| Section types: CommunityChampions | Champion highlights | No champions data |
| Section types: Divider | Visual separator | — |
| **Image verification** | All section images from Sanity CDN | — |
| **Rich text verification** | All rich text fields render identically to Prismic | — |

### 4.7 Other Pages

| Page | Key Test | Verification |
|------|----------|-------------|
| Leadership (`/leadership`) | Team members grouped by department, ordered by display_order | Images load from Sanity |
| Policies (`/resources/[slug]`) | Policy content renders; PDF links work | PDF asset URLs from Sanity |
| Contact (`/contact`) | Form submission works; Resend + Klaviyo calls succeed | No CMS dependency |
| FAQs (`/faqs`) | FAQ content renders | — |
| Navigation | Tournament links, active states | Correct tournament slugs |
| Footer | Newsletter subscribe, social links, sponsor logos | Images from Sanity CDN |

### 4.8 Cross-Cutting Verifications

| Verification Area | Method |
|-------------------|--------|
| **All Opta IDs match** | Run verification script: for each team/match/tournament in Sanity, confirm `optaId` matches the value from Prismic. Use `getTeamByOptaId()` to verify lookup works |
| **All images load** | Crawl all pages; check for broken images. Verify `next/image` works with `cdn.sanity.io` hostname in `next.config.ts` |
| **All rich text renders** | Side-by-side comparison of every blog post and text section between Prismic site and Sanity site |
| **SEO metadata** | Verify `<title>`, `<meta description>`, Open Graph, Twitter cards match current site |
| **404 handling** | Non-existent slugs return 404 page |
| **Draft mode** | Visual Editing preview works for all page types |

---

## 5. Performance Benchmarks

### 5.1 What to Measure

| Metric | Measurement Tool | Baseline (Prismic) | Target (Sanity) |
|--------|-----------------|--------------------|-----------------|
| **TTFB (Time to First Byte)** | WebPageTest / Lighthouse | Measure for each page type | Should be equal or faster |
| **LCP (Largest Contentful Paint)** | Lighthouse | Measure for each page type | Should be equal or faster |
| **Total page load time** | Chrome DevTools Network tab | Measure for each page type | Should be equal or faster |
| **CMS query response time** | Server-side timing logs | Multiple Prismic API calls (~100-200ms each) | Single GROQ query (~50-100ms with CDN) |
| **Image loading time** | Chrome DevTools | Prismic CDN (images.prismic.io) | Sanity CDN (cdn.sanity.io) — both use global CDNs |
| **Total API calls per page** | Network tab count | Homepage: ~10+ calls, Tournament: ~8+ calls | Homepage: 2-3 GROQ + Opta, Tournament: 1-2 GROQ + Opta |

### 5.2 Key Pages to Benchmark

| Page | Current Data Fetching | Expected After |
|------|----------------------|----------------|
| **Homepage** (`/`) | `getTournaments()` + `getLiveTournament()` + `getTeamsByTournament()` × N + `getF1Fixtures()` × N + `getSocialBlogsByCategory()` + `getAllNews()` = **10+ Prismic API calls** | 1 GROQ query with joins + Opta calls = **2-3 total CMS calls** |
| **Tournament** (`/tournament/[slug]`) | `getTournamentByUid()` + `getBlogsByTournament()` + `getTeamsByTournament()` + `getBroadcastPartnerByUid()` × 8 = **11+ Prismic API calls** | 1 GROQ query with expanded references = **1-2 total CMS calls** |
| **Match** (`/tournament/.../match/[matchSlug]`) | `getTournamentByUid()` + `getMatchBySlug()` + `getTeamByOptaId()` × 2 + `getAllBroadcastPartners()` + `getTeamsByTournament()` + `getBlogsByMatch()` = **7 Prismic API calls** | 1 GROQ query = **1 total CMS call** |
| **Club** (`/club/[slug]`) | `getTeamByUid()` + `getTournamentByUid()` + `getTeamsByOptaIds()` + `getBlogsByTeam()` = **4+ Prismic API calls** | 1 GROQ query = **1 total CMS call** |

### 5.3 How to Measure

```bash
# Before migration: measure current Prismic performance
# Visit each page type and record in Chrome DevTools:
# 1. Network tab → Total requests, total transfer size, DOMContentLoaded, Load time
# 2. Lighthouse → Performance score, TTFB, LCP, CLS
# 3. Server logs → Add timing to data fetching functions

# After migration: same measurements with Sanity
# Compare side-by-side in a spreadsheet
```

### 5.4 GROQ Query Performance Expectations

GROQ with `useCdn: true` should be **faster** than Prismic's REST API because:
- **Fewer round trips** — GROQ resolves references server-side (no N+1 problem)
- **CDN-cached** — Sanity's CDN caches GROQ query results
- **Single query** — Multiple Prismic `client.getAllByType()` calls become one GROQ query

Opta API call performance is **unchanged** — same endpoints, same caching.

---

## 6. Risk Register

| # | Risk | Likelihood | Impact | Mitigation | DRI | Acceptance Criteria |
|---|------|-----------|--------|------------|-----|-------------------|
| 1 | **Opta ID matching breaks after migration** | Low | **Critical** | Field is a simple string copy (`opta_id` → `optaId`). Write a verification script that queries every team/match/tournament from both Prismic and Sanity, confirming all Opta IDs match exactly. Run before cutover. | Developer | Verification script reports 0 mismatches across all documents |
| 2 | **Rich text conversion loses formatting** | Medium | Medium | Build comprehensive test suite comparing Prismic StructuredText → Portable Text output. Visually compare every blog post. Pay special attention to: nested lists, inline images, video embeds, linked text. | Developer | Side-by-side comparison of all blog posts shows identical rendering |
| 3 | **Image quality/dimensions change** | Low | Medium | Upload original resolution images to Sanity. Sanity's image pipeline handles responsive sizing via URL parameters. Verify `next/image` with Sanity CDN produces equivalent output. | Developer | Lighthouse image audit scores equal or better; no visible quality degradation |
| 4 | **Prismic content changes during migration window** | Medium | **High** | Implement a content freeze window (see Cutover Runbook §7.3). Notify client 1 week before freeze. Keep freeze to 2-4 hours maximum. Have a delta migration script ready as fallback. | Developer + Client | Client confirms content freeze; delta script tested on staging |
| 5 | **GROQ query performance on complex pages** | Low | Medium | Use `useCdn: true` for all published content queries. Pre-test GROQ queries with Sanity Vision plugin. Profile tournament page (most complex) specifically. | Developer | Tournament page TTFB ≤ current Prismic TTFB |
| 6 | **Visual Editing overlays don't work on all components** | Medium | Low | Start with key components (headings, text, images). Use `encodeDataAttribute` on priority fields. Progressively add stega encoding. Not all components need Visual Editing. | Developer | Visual Editing works on: blog body, tournament title, team name, page sections |
| 7 | **Client confused by new Studio** | Medium | Medium | Write documentation (see §9). Conduct 1-hour walkthrough session. Customize Studio desk structure to match their existing Prismic workflow. | Developer | Client can independently create/edit blog posts, update tournament status, manage teams |
| 8 | **Revalidation webhook fails silently** | Low | Medium | Sanity webhook includes HMAC validation. Log all webhook events. Set up monitoring alert for failed revalidations. Test with Sanity webhook simulator. | Developer | Webhook fires within 5s of Sanity publish; pages update within 30s |
| 9 | **DNS/deployment switch causes downtime** | Low | **High** | Use blue-green deployment. Keep old deployment running for 48 hours as fallback. Test rollback procedure before go-live. | Developer | Zero-downtime switch verified on staging; rollback tested and documented |
| 10 | **Supabase highlights stop loading** | Very Low | Medium | Supabase queries use `opta_match_id` which is Opta data, not CMS data. No CMS migration impact. Verify highlights still load on match pages post-migration. | Developer | All existing match highlights load correctly on Sanity site |

---

## 7. Cutover Runbook

### 7.1 Pre-Cutover Checklist (T-7 days)

- [ ] All pages migrated and rendering correctly on staging
- [ ] Content migration script tested on full dataset (not just samples)
- [ ] Opta ID verification script passes with 0 mismatches
- [ ] Side-by-side visual comparison of all page types complete
- [ ] Performance benchmarks recorded and compared
- [ ] Sanity webhook endpoint deployed and tested
- [ ] Client notified of content freeze window
- [ ] Rollback procedure documented and tested
- [ ] DNS TTL lowered to 60s (if changing DNS)

### 7.2 Pre-Cutover Checklist (T-1 day)

- [ ] Final content sync — check for any Prismic changes since last migration run
- [ ] Staging environment matches production data
- [ ] All environment variables configured in production deployment platform
- [ ] Sanity project production dataset verified
- [ ] Monitoring alerts configured (uptime, error rates)
- [ ] Team available for the cutover window

### 7.3 Content Freeze Window (2-4 hours)

| Step | Action | Duration |
|------|--------|----------|
| T+0:00 | Notify client: "Content freeze begins now. Do not edit Prismic." | — |
| T+0:05 | Run final migration script against production Prismic data | ~30 min |
| T+0:35 | Verify migration: run Opta ID verification script | ~10 min |
| T+0:45 | Spot-check 10 key pages (homepage, 2 tournaments, 2 matches, 2 clubs, 2 blogs, 1 policy) | ~15 min |
| T+1:00 | Verify images load from Sanity CDN | ~10 min |
| T+1:10 | Deploy production build pointing to Sanity | ~10 min |
| T+1:20 | Switch DNS / deployment target (if needed) | ~5 min |
| T+1:25 | Run smoke test checklist (§7.4) | ~15 min |
| T+1:40 | Notify client: "Content freeze ended. You can now edit in Sanity Studio." | — |

### 7.4 Smoke Test Checklist (Post-Deploy)

- [ ] Homepage loads — champion teams display with correct logos
- [ ] Homepage — live tournament ticker works (if tournament is live)
- [ ] Tournament page (complete) — standings, fixtures, awards render
- [ ] Tournament page (live) — live scores update
- [ ] Match page — F9 stats, F13 commentary, F24 events display
- [ ] Club page — squad, standings, fixtures load
- [ ] News page — blog post renders with images and rich text
- [ ] Dynamic page — sections render via SectionRenderer
- [ ] Leadership page — team members display
- [ ] Policy page — content renders; PDF link works
- [ ] Contact form — submission succeeds (check email delivery)
- [ ] Newsletter subscribe — Klaviyo subscription works
- [ ] Navigation — tournament links correct
- [ ] Footer — logos and links display
- [ ] 404 page — unknown slug returns 404
- [ ] Sanity Studio — accessible at `/studio`
- [ ] Visual Editing — draft mode works
- [ ] Sanity webhook — edit a test document, verify page revalidates
- [ ] Mobile responsiveness — spot-check 3 pages on mobile viewport

### 7.5 Rollback Procedure

If critical issues are discovered after deploy:

| Step | Action | Duration |
|------|--------|----------|
| 1 | Revert DNS / deployment to previous Prismic build | ~5 min |
| 2 | Verify old site is serving correctly | ~5 min |
| 3 | Notify client: "We've rolled back temporarily. Prismic is active again." | — |
| 4 | Diagnose issue on staging environment | Variable |
| 5 | Fix issue, re-test, schedule new cutover window | — |

**Rollback is possible as long as:** The old Prismic deployment is still available and no DNS changes have propagated beyond the TTL window. Keep old deployment running for minimum 48 hours.

### 7.6 Post-Launch Monitoring (48 hours)

| What to Watch | How | Alert Threshold |
|---------------|-----|----------------|
| **Error rates** | Vercel/hosting error logs | Any 500 errors on page routes |
| **Page load times** | Vercel Analytics / RUM | >50% increase in p95 TTFB |
| **Opta API failures** | Server logs | Any Opta feed returning errors that weren't happening before |
| **Image 404s** | Browser console / error tracking | Any broken images |
| **Sanity webhook delivery** | Sanity project dashboard → Webhooks | Webhook failures or >30s delay |
| **Client reports** | Slack/email | Any client-reported issues |
| **Search engine indexing** | Google Search Console | Crawl errors or deindexing |

---

## 8. Revalidation Strategy

### 8.1 Current Prismic Revalidation

**File:** `src/app/api/revalidate/route.ts`

```typescript
// Current implementation — extremely simple
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("prismic", "page");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
```

This is a generic POST endpoint with no webhook validation, no payload parsing, and no selective revalidation. Prismic sends a webhook on any content change, and this route revalidates everything tagged `"prismic"` or `"page"`.

### 8.2 New Sanity Revalidation

Replace the Prismic webhook with Sanity's webhook-based on-demand revalidation.

**New file:** `src/app/api/revalidate/route.ts`

```typescript
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string;
      slug?: { current: string };
    }>(req, process.env.SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return new Response("Invalid signature", { status: 401 });
    }

    if (!body?._type) {
      return new Response("Bad Request", { status: 400 });
    }

    // Revalidate based on document type
    revalidateTag(body._type);

    // Also revalidate general tags
    revalidateTag("sanity");

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      type: body._type,
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return new Response("Error", { status: 500 });
  }
}
```

### 8.3 Sanity Webhook Configuration

In the Sanity project dashboard (manage.sanity.io):

1. **URL:** `https://worldsevensfootball.com/api/revalidate`
2. **Secret:** Set `SANITY_REVALIDATE_SECRET` env var (generate with `openssl rand -base64 32`)
3. **Trigger on:** Create, Update, Delete
4. **Filter:** Leave empty (trigger on all document types) or set to `_type in ["tournament", "team", "match", "blog", "page", "policy", "siteSettings", "teamMember", "sponsor", "broadcastPartner", "blogCategory", "award", "player"]`
5. **Projection:** `{_type, slug}`
6. **HTTP method:** POST

### 8.4 Tag Strategy for `sanityFetch`

In the Sanity client, tag each fetch with the document type:

```typescript
// src/sanity/live.ts or src/sanity/client.ts
export async function sanityFetch<T>({
  query,
  params,
  tags,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags?: string[];
}) {
  return client.fetch<T>(query, params ?? {}, {
    next: {
      tags: [...(tags ?? []), "sanity"],
    },
  });
}

// Usage:
const tournament = await sanityFetch({
  query: TOURNAMENT_BY_SLUG_QUERY,
  params: { slug },
  tags: ["tournament"],
});
```

This enables **selective revalidation**: editing a blog post only revalidates pages tagged `"blog"`, not tournament or match pages.

---

## 9. Client Handoff

### 9.1 Documentation Deliverables

| Document | Contents |
|----------|----------|
| **Studio User Guide** | How to navigate the Studio; how to create/edit each content type; how to publish/unpublish; how to use Visual Editing |
| **Content Types Reference** | List of all document types with field descriptions and required/optional indicators |
| **Image Guidelines** | Recommended image dimensions for each field (hero, logo, thumbnail); how Sanity's image pipeline handles responsive sizing |
| **Rich Text Guide** | Available block types (headings, lists, links, images, video embeds); how to use the Portable Text editor |
| **FAQ** | Common questions: "How do I preview changes?", "How do I revert a change?", "How do I add a new tournament?" |

### 9.2 Training Session Agenda (1 hour)

| Time | Topic |
|------|-------|
| 0:00–0:10 | Studio tour — navigation, document lists, search |
| 0:10–0:20 | Create a new blog post — title, body, category, images, publish |
| 0:20–0:30 | Edit a tournament — status change, Opta IDs, awards |
| 0:30–0:40 | Visual Editing — preview changes before publishing |
| 0:40–0:50 | Manage teams — add team, update logo, assign to tournament |
| 0:50–1:00 | Q&A |

### 9.3 Key Differences from Prismic

| Feature | Prismic | Sanity |
|---------|---------|--------|
| **Editor URL** | prismic.io dashboard | `/studio` on your own site |
| **Content structure** | Custom Types + Slices | Document Types + Sections |
| **Rich text** | Structured Text editor | Portable Text editor |
| **Preview** | Preview button → preview route | Visual Editing with live overlay |
| **Image management** | Prismic Media Library | Sanity Media Library (within Studio) |
| **Publishing** | Publish button | Publish button (same concept) |
| **Scheduling** | Prismic Releases (limited) | Sanity Scheduling (available with plugin) |
| **Collaboration** | Limited | Real-time collaboration (multiple editors) |

### 9.4 Ongoing Support

- **First 2 weeks post-launch:** Developer available for questions via Slack/email
- **Bug reports:** Submit via agreed channel (email, Slack, or GitHub issues)
- **Studio customization requests:** Handled as separate tickets

---

*End of Phase 6 Document*
