import "dotenv/config"
import * as prismic from "@prismicio/client"

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  const client = prismic.createClient(REPOSITORY_NAME)

  console.log("Fetching all players from Prismic...")
  const players = await client.getAllByType("player")
  
  console.log(`Found ${players.length} players to delete`)
  
  if (players.length === 0) {
    console.log("No players to delete")
    return
  }

  const dryRun = process.argv.includes("--dry-run")
  if (dryRun) {
    console.log("\n=== DRY RUN - No deletions will be made ===")
    for (const player of players) {
      console.log(`  Would delete: ${player.data.first_name} ${player.data.last_name} (${player.id})`)
    }
    return
  }

  console.log("\nDeleting players...")
  let deleted = 0
  let failed = 0

  for (const player of players) {
    const name = `${player.data.first_name} ${player.data.last_name}`
    console.log(`[${deleted + failed + 1}/${players.length}] Deleting ${name}...`)

    const response = await fetch(`${MIGRATION_API_URL}/${player.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${writeToken}`,
        "repository": REPOSITORY_NAME,
        "x-api-key": writeToken,
      },
    })

    if (response.ok || response.status === 404) {
      console.log(`  ✅ Deleted`)
      deleted++
    } else {
      const errorText = await response.text()
      console.error(`  ❌ Failed: ${response.status} - ${errorText}`)
      failed++
      
      if (response.status === 429) {
        console.log("  Rate limited, waiting 30s...")
        await sleep(30000)
      }
    }

    await sleep(2000)
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Deleted: ${deleted}`)
  console.log(`Failed: ${failed}`)
}

main().catch(console.error)

