import { config } from "dotenv"
config({ path: ".env.local" })

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"

// --- Rich Text Helpers ---

function heading1(text: string) {
  return { type: "heading1" as const, text, spans: [] }
}

function heading3(text: string) {
  return { type: "heading3" as const, text, spans: [] }
}

function paragraph(text: string, spans: Array<{ start: number; end: number; type: string }> = []) {
  return { type: "paragraph" as const, text, spans }
}

// --- Build Slice Data ---

function buildSubpageHeroSlice() {
  return {
    slice_type: "subpage_hero",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      subtitle: "Youth Tournament",
      heading: [heading1("Rising Sevens")],
      description: [paragraph("By World Sevens Football")],
      // Image left null — user will upload in Prismic dashboard
    },
    items: [],
  }
}

function buildIntroTextBlockSlice() {
  return {
    slice_type: "text_block",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      heading: [],
      body: [
        paragraph(
          "World Sevens Football proudly introduced the Rising Sevens Youth Tournament, a youth version of the W7F experience at its first North American event in Fort Lauderdale, Florida, in December 2025."
        ),
        paragraph(
          "This groundbreaking global series took place at Dolphin Field on the campus of Nova Southeastern University (NSU) in Davie, Florida — adjacent to Beyond Bancard Stadium, the site of the professional tournament."
        ),
        paragraph(
          "Girls ages 9-12 were provided with the rare opportunity to compete in an elite, professional-style environment while sharing the stage with the world\u2019s best in women\u2019s football."
        ),
      ],
      padding_top: true,
      padding_bottom: true,
      space_above: true,
      space_below: true,
    },
    items: [],
  }
}

function buildTournamentSlice() {
  return {
    slice_type: "image_with_text",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      eyebrow: "",
      title: [heading3("The Tournament")],
      description: [
        paragraph(
          "Across the weekend, 15 teams and nearly 200 players from three divisions — the combined U9/U10 division, U11 and U12 — took part in the competition. All three competed on Saturday and Sunday, embracing the fast-paced 7v7 format that defines the World Sevens Football model. Matches were played on half-sized pitches as mini games consisting of two 15-minute halves, with teams advancing through group play and into championship rounds."
        ),
        paragraph(
          "The results showcased both competitive excellence and the depth of emerging talent in girls\u2019 football. Weston FC 2016 Girls Black claimed the U9/U10 Division title, MVLA Barcelona emerged as champions in the U11 Division, and Fort Lauderdale United 2014 captured the U12 crown. Each champion was celebrated not only for their on-field success, but for embodying the spirit of creativity, confidence, and joy that Rising Sevens aims to inspire."
        ),
      ],
      image_position: "left",
      // Image left null — user will upload in Prismic dashboard
      padding_top: true,
      padding_bottom: true,
      space_above: true,
      space_below: true,
    },
    items: [],
  }
}

function buildImpactSlice() {
  const text =
    "Beyond wins and losses, the tournament emphasized development, learning, and inspiration. Players competed on their own World Sevens 7v7 stage while also engaging in meaningful off-field experiences, including opportunities to connect with Player Advisors such as: Tobin Heath, Kelley O'Hara, Anita Asante, Caroline Seger and Laura Georges, along with professional athletes competing in the World Sevens Football event. The chance to observe, learn from, and interact with elite players reinforced Rising Sevens\u2019 core mission: providing the next generation of footballers an opportunity to showcase their talent and learn from the best."

  // Bold the Player Advisor names
  const spans = [
    { start: text.indexOf("Tobin Heath"), end: text.indexOf("Tobin Heath") + "Tobin Heath".length, type: "strong" },
    { start: text.indexOf("Kelley O'Hara"), end: text.indexOf("Kelley O'Hara") + "Kelley O'Hara".length, type: "strong" },
    { start: text.indexOf("Anita Asante"), end: text.indexOf("Anita Asante") + "Anita Asante".length, type: "strong" },
    { start: text.indexOf("Caroline Seger"), end: text.indexOf("Caroline Seger") + "Caroline Seger".length, type: "strong" },
    { start: text.indexOf("Laura Georges"), end: text.indexOf("Laura Georges") + "Laura Georges".length, type: "strong" },
  ]

  return {
    slice_type: "image_with_text",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      eyebrow: "",
      title: [heading3("The Impact")],
      description: [paragraph(text, spans)],
      image_position: "right",
      // Image left null — user will upload in Prismic dashboard
      padding_top: true,
      padding_bottom: true,
      space_above: true,
      space_below: true,
    },
    items: [],
  }
}

function buildClosingTextBlockSlice() {
  return {
    slice_type: "text_block",
    slice_label: null,
    variation: "default",
    version: "initial",
    primary: {
      heading: [],
      body: [
        paragraph(
          "For young players, standing on the same field as the professionals provided a powerful and lasting memory\u2014one that underscored the tournament\u2019s belief in the future of the game."
        ),
        paragraph(
          "From first whistle to final celebration, the future of football was on full display in Fort Lauderdale. Rising Sevens didn\u2019t just introduce a new youth tournament \u2014 it created a pathway, a stage, and a shared experience that will resonate with players long after the weekend ended."
        ),
      ],
      padding_top: true,
      padding_bottom: true,
      space_above: true,
      space_below: true,
    },
    items: [],
  }
}

// --- Main ---

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required in .env.local")
    process.exit(1)
  }

  console.log("Migrating Rising Sevens page to Prismic...\n")

  // Build slices
  console.log("1. Building slice data...")
  const slices = [
    buildSubpageHeroSlice(),
    buildIntroTextBlockSlice(),
    buildTournamentSlice(),
    buildImpactSlice(),
    buildClosingTextBlockSlice(),
  ]
  console.log(`   Built ${slices.length} slices`)

  // Create page document
  console.log("2. Creating page document...")
  const data: Record<string, unknown> = {
    slices,
    meta_title: "Rising Sevens Youth Tournament - World Sevens Football",
    meta_description:
      "Rising Sevens Youth Tournament by World Sevens Football — a groundbreaking youth 7v7 series giving the next generation of elite players the opportunity to compete alongside the world's best in women's football.",
  }

  try {
    const response = await fetch(MIGRATION_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${writeToken}`,
        repository: REPOSITORY_NAME,
        "Content-Type": "application/json",
        "x-api-key": writeToken,
      },
      body: JSON.stringify({
        uid: "rising-sevens",
        type: "page",
        lang: "en-us",
        title: "Rising Sevens",
        data,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`\n❌ Failed to create page: ${response.status} ${response.statusText}`)
      console.error(`   ${errorText}`)
    } else {
      const result = await response.json()
      console.log(`\n✅ Rising Sevens page created successfully!`)
      console.log(`   Document ID: ${result.id}`)
      console.log(`   UID: rising-sevens`)
      console.log(`\n   Note: Remember to publish the document in the Prismic dashboard.`)
      console.log(`   Images need to be added manually in Prismic for:`)
      console.log(`     - SubpageHero background image`)
      console.log(`     - "The Tournament" section image (left side)`)
      console.log(`     - "The Impact" section image (right side)`)
    }
  } catch (error) {
    console.error(`\n❌ Error creating page: ${error}`)
  }
}

main().catch(console.error)
