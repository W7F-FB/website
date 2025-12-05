import "dotenv/config"
import * as prismic from "@prismicio/client"
import * as fs from "fs"
import * as path from "path"
import sharp from "sharp"

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io"
const MAX_IMAGE_SIZE = 1000
const JPEG_QUALITY = 85
const DELAY_BETWEEN_PLAYERS = 500
const DELAY_AFTER_ASSET_UPLOAD = 300
const MAX_RETRIES = 3
const RETRY_DELAY = 3000

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T | null> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (errorMessage.includes("429") || errorMessage.includes("Rate limit")) {
        console.log(`  Rate limited, waiting ${delay / 1000}s before retry ${attempt}/${retries}...`)
        await sleep(delay * attempt)
      } else {
        throw error
      }
    }
  }
  return null
}

interface OptaPlayer {
  firstName: string
  lastName: string
  playerId: string
  teamId: string
}

interface PlayerMatch {
  player: OptaPlayer
  headshot: string | null
  extractedName: string | null
  confidence: number
}

interface TeamMapping {
  prismicId: string
  optaId: string
  name: string
}

function generateUID(firstName: string, lastName: string, playerId: string): string {
  const namePart = `${firstName}-${lastName}`
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
  return `${namePart}-${playerId}`.slice(0, 63)
}

async function processImage(filePath: string): Promise<Buffer> {
  const image = sharp(filePath)
  const metadata = await image.metadata()
  
  let processor = image
  
  if (metadata.width && metadata.height) {
    if (metadata.width > MAX_IMAGE_SIZE || metadata.height > MAX_IMAGE_SIZE) {
      processor = processor.resize(MAX_IMAGE_SIZE, MAX_IMAGE_SIZE, {
        fit: "inside",
        withoutEnlargement: true,
      })
    }
  }
  
  return processor
    .jpeg({ quality: JPEG_QUALITY, progressive: true })
    .toBuffer()
}

async function uploadAsset(
  filePath: string,
  writeToken: string,
  altText: string
): Promise<{ id: string; url: string } | null> {
  const processedBuffer = await processImage(filePath)
  const originalFileName = path.basename(filePath)
  const fileName = originalFileName.replace(/\.(png|webp|jpg|jpeg)$/i, ".jpg")
  
  console.log(`  Processed image: ${(processedBuffer.length / 1024).toFixed(0)}KB`)

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const createResponse = await fetch("https://asset-api.prismic.io/assets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${writeToken}`,
        "repository": REPOSITORY_NAME,
        "Accept": "application/json",
      },
      body: (() => {
        const formData = new FormData()
        const arrayBuffer = processedBuffer.buffer.slice(
          processedBuffer.byteOffset,
          processedBuffer.byteOffset + processedBuffer.byteLength
        ) as ArrayBuffer
        formData.append("file", new Blob([arrayBuffer], { type: "image/jpeg" }), fileName)
        return formData
      })(),
    })

    if (!createResponse.ok) {
      const errorText = await createResponse.text()
      if (createResponse.status === 429) {
        console.log(`  Rate limited on asset upload, waiting ${RETRY_DELAY * attempt / 1000}s (attempt ${attempt}/${MAX_RETRIES})...`)
        await sleep(RETRY_DELAY * attempt)
        continue
      }
      console.error(`  Failed to upload asset: ${createResponse.status} - ${errorText}`)
      return null
    }

    const assetData = await createResponse.json()
    await sleep(DELAY_AFTER_ASSET_UPLOAD)
    return { id: assetData.id, url: assetData.url }
  }

  console.error(`  Failed to upload asset after ${MAX_RETRIES} retries`)
  return null
}

async function createPlayerDocument(
  player: OptaPlayer,
  teamPrismicId: string | null,
  teamName: string | null,
  assetId: string | null,
  assetUrl: string | null,
  writeToken: string
): Promise<boolean> {
  const uid = generateUID(player.firstName, player.lastName, player.playerId)
  
  const altText = teamName 
    ? `${player.firstName} ${player.lastName} - ${teamName} player headshot`
    : `${player.firstName} ${player.lastName} player headshot`
  
  const imageField = assetId && assetUrl ? {
    id: assetId,
    url: assetUrl,
    dimensions: { width: 1000, height: 1000 },
    alt: altText,
    copyright: null,
    edit: { x: 0, y: 0, zoom: 1, background: "transparent" },
  } : null

  const teamLink = teamPrismicId ? {
    id: teamPrismicId,
    type: "team",
    link_type: "Document",
  } : null

  const documentData: Record<string, unknown> = {
    opta_id: player.playerId,
    first_name: player.firstName,
    last_name: player.lastName,
  }
  
  if (imageField) {
    documentData.headshot = imageField
  }
  
  if (teamLink) {
    documentData.team = teamLink
  }

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(`${MIGRATION_API_URL}/documents`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${writeToken}`,
        "repository": REPOSITORY_NAME,
        "Content-Type": "application/json",
        "x-api-key": writeToken,
      },
      body: JSON.stringify({
        uid,
        type: "player",
        lang: "en-us",
        title: `${player.firstName} ${player.lastName}`,
        data: documentData,
      }),
    })

    if (response.ok) {
      return true
    }

    const errorText = await response.text()
    
    if (response.status === 429) {
      console.log(`  Rate limited on document create, waiting ${RETRY_DELAY * attempt / 1000}s (attempt ${attempt}/${MAX_RETRIES})...`)
      await sleep(RETRY_DELAY * attempt)
      continue
    }

    if (response.status === 400 && errorText.includes("UID already exists")) {
      console.log(`  Player already exists (UID collision), skipping`)
      return true
    }

    console.error(`  Failed to create player: ${response.status} - ${errorText}`)
    return false
  }

  console.error(`  Failed to create player after ${MAX_RETRIES} retries`)
  return false
}

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  const dryRun = process.argv.includes("--dry-run")
  const startFrom = parseInt(process.argv.find(a => a.startsWith("--start="))?.replace("--start=", "") || "0")
  
  if (dryRun) {
    console.log("=== DRY RUN MODE - No changes will be made ===\n")
  }

  const matchesPath = path.join(process.cwd(), "scripts", "data", "player-headshot-matches.json")
  const matches: PlayerMatch[] = JSON.parse(fs.readFileSync(matchesPath, "utf-8"))

  console.log(`Loaded ${matches.length} player matches`)

  const client = prismic.createClient(REPOSITORY_NAME)
  
  console.log("Fetching teams from Prismic...")
  const teams = await client.getAllByType("team")
  const teamMap = new Map<string, { id: string; name: string }>()
  for (const team of teams) {
    if (team.data.opta_id) {
      teamMap.set(team.data.opta_id as string, { 
        id: team.id, 
        name: team.data.name as string || "Unknown Team" 
      })
    }
  }
  console.log(`Found ${teamMap.size} teams with opta_id`)

  console.log("Checking for existing players...")
  const existingPlayers = await client.getAllByType("player")
  const existingOptaIds = new Set(existingPlayers.map(p => p.data.opta_id as string).filter(Boolean))
  console.log(`Found ${existingOptaIds.size} existing players`)

  let uploaded = 0
  let skipped = 0
  let failed = 0
  let noHeadshot = 0

  for (let i = startFrom; i < matches.length; i++) {
    const match = matches[i]
    const { player, headshot } = match
    
    console.log(`\n[${i + 1}/${matches.length}] ${player.firstName} ${player.lastName} (${player.playerId})`)

    if (existingOptaIds.has(player.playerId)) {
      console.log(`  Skipping - already exists in Prismic`)
      skipped++
      continue
    }

    const teamInfo = teamMap.get(player.teamId)
    if (!teamInfo) {
      console.log(`  Warning: No Prismic team found for opta_id ${player.teamId}`)
    }

    const teamPrismicId = teamInfo?.id || null
    const teamName = teamInfo?.name || null

    if (dryRun) {
      console.log(`  [DRY RUN] Would create player:`)
      console.log(`    UID: ${generateUID(player.firstName, player.lastName, player.playerId)}`)
      console.log(`    Team: ${teamName || "none"} (${teamPrismicId || "no id"})`)
      console.log(`    Headshot: ${headshot ? path.basename(headshot) : "none"}`)
      uploaded++
      continue
    }

    let assetId: string | null = null
    let assetUrl: string | null = null

    const altText = teamName 
      ? `${player.firstName} ${player.lastName} - ${teamName} player headshot`
      : `${player.firstName} ${player.lastName} player headshot`

    if (headshot && fs.existsSync(headshot)) {
      console.log(`  Uploading headshot: ${path.basename(headshot)}`)
      const assetResult = await uploadAsset(headshot, writeToken, altText)
      if (assetResult) {
        assetId = assetResult.id
        assetUrl = assetResult.url
        console.log(`  Asset uploaded: ${assetId}`)
      } else {
        console.log(`  ❌ Failed to upload headshot - STOPPING`)
        console.log(`\n=== STOPPED DUE TO ASSET UPLOAD ERROR ===`)
        console.log(`Uploaded: ${uploaded}`)
        console.log(`\nTo resume, run with: --start=${i}`)
        process.exit(1)
      }
    } else if (!headshot) {
      console.log(`  No headshot available`)
      noHeadshot++
    } else {
      console.log(`  ❌ Headshot file not found: ${headshot} - STOPPING`)
      console.log(`\n=== STOPPED DUE TO MISSING FILE ===`)
      process.exit(1)
    }

    console.log(`  Creating player document...`)
    const success = await createPlayerDocument(player, teamPrismicId, teamName, assetId, assetUrl, writeToken)

    if (success) {
      console.log(`  ✅ Created successfully`)
      uploaded++
    } else {
      console.log(`  ❌ Failed to create - STOPPING`)
      failed++
      console.log(`\n=== STOPPED DUE TO ERROR ===`)
      console.log(`Uploaded: ${uploaded}`)
      console.log(`Failed: ${failed}`)
      console.log(`Remaining: ${matches.length - i - 1}`)
      console.log(`\nTo resume, run with: --start=${i}`)
      process.exit(1)
    }

    console.log(`  Waiting ${DELAY_BETWEEN_PLAYERS / 1000}s before next player...`)
    await sleep(DELAY_BETWEEN_PLAYERS)
  }

  console.log(`\n=== SUMMARY ===`)
  console.log(`Uploaded: ${uploaded}`)
  console.log(`Skipped (existing): ${skipped}`)
  console.log(`Failed: ${failed}`)
  console.log(`Without headshot: ${noHeadshot}`)
}

main().catch(console.error)

