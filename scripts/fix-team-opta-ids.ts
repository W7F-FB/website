import "dotenv/config"
import * as prismic from "@prismicio/client"

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"

const FIXES = [
  { currentOptaId: "23624", correctOptaId: "23627", expectedName: "San Diego Wave" },
  { currentOptaId: "23627", correctOptaId: "23624", expectedName: "Tigres UANL" },
]

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  const client = prismic.createClient(REPOSITORY_NAME)

  console.log("Fetching all teams...")
  const teams = await client.getAllByType("team")
  console.log(`Found ${teams.length} teams`)

  for (const fix of FIXES) {
    const team = teams.find(t => t.data.opta_id === fix.currentOptaId)
    
    if (!team) {
      console.log(`\n⚠️  No team found with opta_id ${fix.currentOptaId}`)
      continue
    }

    console.log(`\nFixing team: ${team.data.name}`)
    console.log(`  Current opta_id: ${fix.currentOptaId}`)
    console.log(`  Correct opta_id: ${fix.correctOptaId}`)
    console.log(`  Expected name: ${fix.expectedName}`)

    const response = await fetch(`${MIGRATION_API_URL}/${team.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${writeToken}`,
        "repository": REPOSITORY_NAME,
        "Content-Type": "application/json",
        "x-api-key": writeToken
      },
      body: JSON.stringify({
        uid: team.uid,
        type: "team",
        lang: team.lang,
        title: team.data.name,
        data: {
          ...team.data,
          opta_id: fix.correctOptaId
        }
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`  ❌ Failed: ${response.status} - ${errorText}`)
    } else {
      console.log(`  ✅ Success`)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log("\n✅ Done fixing team opta_ids!")
}

main().catch(console.error)

