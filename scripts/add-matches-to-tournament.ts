import "dotenv/config"
import * as prismic from "@prismicio/client"

const REPOSITORY_NAME = "world-sevens-football"
const TARGET_TOURNAMENT_ID = "aMsv3hEAACIAhcCo"
const EXCLUDE_TOURNAMENT_ID = "aMsxBxEAACEAhcJY"

const MIGRATION_API_URL = "https://migration.prismic.io/documents"

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  const client = prismic.createClient(REPOSITORY_NAME)

  console.log("Fetching all tournaments...")
  const tournaments = await client.getAllByType("tournament")
  
  const excludeTournament = tournaments.find(t => t.id === EXCLUDE_TOURNAMENT_ID)
  const targetTournament = tournaments.find(t => t.id === TARGET_TOURNAMENT_ID)

  if (!targetTournament) {
    console.error(`Target tournament ${TARGET_TOURNAMENT_ID} not found`)
    process.exit(1)
  }

  const excludedMatchIds = new Set<string>()
  if (excludeTournament?.data.matches) {
    for (const item of excludeTournament.data.matches) {
      if (prismic.isFilled.contentRelationship(item.match)) {
        excludedMatchIds.add(item.match.id)
      }
    }
  }
  console.log(`Found ${excludedMatchIds.size} matches to exclude from tournament ${EXCLUDE_TOURNAMENT_ID}`)

  console.log("Fetching all matches...")
  const allMatches = await client.getAllByType("match")
  console.log(`Found ${allMatches.length} total matches`)

  const matchesToAdd = allMatches.filter(match => !excludedMatchIds.has(match.id))
  console.log(`${matchesToAdd.length} matches will be added to tournament ${TARGET_TOURNAMENT_ID}`)

  if (matchesToAdd.length === 0) {
    console.log("No matches to add. Exiting.")
    return
  }

  const existingMatches = (targetTournament.data.matches || [])
    .map(item => prismic.isFilled.contentRelationship(item.match) ? {
      match: {
        id: item.match.id,
        type: "match",
        link_type: "Document"
      }
    } : null)
    .filter((item): item is NonNullable<typeof item> => item !== null)

  const newMatches = matchesToAdd.map(match => ({
    match: {
      id: match.id,
      type: "match",
      link_type: "Document"
    }
  }))

  const allMatchesForTournament = [...existingMatches, ...newMatches]

  console.log(`Updating tournament with ${allMatchesForTournament.length} matches...`)
  console.log("Match IDs to add:", matchesToAdd.map(m => m.id))

  const response = await fetch(`${MIGRATION_API_URL}/${TARGET_TOURNAMENT_ID}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${writeToken}`,
      "repository": REPOSITORY_NAME,
      "Content-Type": "application/json",
      "x-api-key": writeToken
    },
    body: JSON.stringify({
      uid: targetTournament.uid,
      type: "tournament",
      lang: targetTournament.lang,
      title: targetTournament.data.title,
      data: {
        ...targetTournament.data,
        matches: allMatchesForTournament
      }
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Failed to update tournament: ${response.status} ${response.statusText}`)
    console.error(errorText)
    process.exit(1)
  }

  console.log("Successfully updated tournament!")
  const result = await response.json().catch(() => null)
  if (result) {
    console.log("Response:", JSON.stringify(result, null, 2))
  }
}

main().catch(console.error)

