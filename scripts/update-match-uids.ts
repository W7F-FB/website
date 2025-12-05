import "dotenv/config"
import * as prismic from "@prismicio/client"

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"

function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  const client = prismic.createClient(REPOSITORY_NAME)

  console.log("Fetching all tournaments...")
  const tournaments = await client.getAllByType("tournament")
  
  const matchToTournamentMap = new Map<string, { tournamentId: string; tournamentUid: string }>()
  for (const tournament of tournaments) {
    if (tournament.data.matches) {
      for (const item of tournament.data.matches) {
        if (prismic.isFilled.contentRelationship(item.match)) {
          matchToTournamentMap.set(item.match.id, {
            tournamentId: tournament.id,
            tournamentUid: tournament.uid!
          })
        }
      }
    }
  }
  console.log(`Built reverse lookup map for ${matchToTournamentMap.size} matches`)

  console.log("Fetching all matches with team data...")
  const matches = await client.getAllByType("match", {
    fetchLinks: ["team.name", "team.key"]
  })
  console.log(`Found ${matches.length} matches`)

  for (const match of matches) {
    console.log(`\n${"─".repeat(60)}`)
    console.log(`Processing match: ${match.id}`)
    console.log(`  Current UID: ${match.uid}`)
    
    const tournamentInfo = matchToTournamentMap.get(match.id)
    if (!tournamentInfo) {
      console.log(`  ⚠️  Not found in any tournament's matches list, skipping`)
      continue
    }
    console.log(`  Tournament: ${tournamentInfo.tournamentUid}`)

    const optaId = match.data.opta_id
    const stage = match.data.stage
    const knockoutType = match.data.knockout_stage_match_type
    
    console.log(`  Stage: ${stage}`)
    console.log(`  Knockout Type: ${knockoutType || "N/A"}`)
    console.log(`  Opta ID (raw): "${optaId}" (type: ${typeof optaId})`)
    
    let newUid: string

    if (stage === "Knockout Stage") {
      const typeSlug = slugify(knockoutType || "unknown")
      console.log(`  → Knockout match detected`)
      console.log(`    Type slug: "${typeSlug}"`)
      console.log(`    Opta ID for UID: "${optaId || "MISSING"}"`)
      
      if (!optaId) {
        console.log(`  ⚠️  WARNING: No opta_id found for knockout match!`)
      }
      
      newUid = `${typeSlug}-${optaId || ""}`
    } else {
      const homeTeam = match.data.home_team
      const awayTeam = match.data.away_team
      
      console.log(`  → Group stage match detected`)
      console.log(`    Home team filled: ${prismic.isFilled.contentRelationship(homeTeam)}`)
      console.log(`    Away team filled: ${prismic.isFilled.contentRelationship(awayTeam)}`)
      
      let homeTeamName = "unknown"
      let awayTeamName = "unknown"
      
      if (prismic.isFilled.contentRelationship(homeTeam) && homeTeam.data) {
        const teamData = homeTeam.data as { name?: string; key?: string }
        homeTeamName = teamData.name || teamData.key || "unknown"
        console.log(`    Home team name: "${homeTeamName}"`)
      } else {
        console.log(`    Home team: NO DATA`)
      }
      
      if (prismic.isFilled.contentRelationship(awayTeam) && awayTeam.data) {
        const teamData = awayTeam.data as { name?: string; key?: string }
        awayTeamName = teamData.name || teamData.key || "unknown"
        console.log(`    Away team name: "${awayTeamName}"`)
      } else {
        console.log(`    Away team: NO DATA`)
      }
      
      newUid = `${slugify(homeTeamName)}-vs-${slugify(awayTeamName)}-${optaId || ""}`
    }

    console.log(`  Generated UID: "${newUid}"`)

    const updatedData = {
      ...match.data,
      tournament: {
        link_type: "Document",
        id: tournamentInfo.tournamentId,
        type: "tournament",
        isBroken: false
      }
    }

    const response = await fetch(`${MIGRATION_API_URL}/${match.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${writeToken}`,
        "repository": REPOSITORY_NAME,
        "Content-Type": "application/json",
        "x-api-key": writeToken
      },
      body: JSON.stringify({
        uid: newUid,
        type: "match",
        lang: match.lang,
        title: newUid,
        data: updatedData
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`  ❌ Failed: ${response.status} ${response.statusText}`)
      console.error(`  ${errorText}`)
    } else {
      console.log(`  ✅ Success`)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log("\n✅ Done updating all matches!")
}

main().catch(console.error)

