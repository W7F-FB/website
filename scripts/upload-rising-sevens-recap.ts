import { config } from "dotenv"
config({ path: ".env.local" })

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"
const EXISTING_DOC_ID = "aYt-vREAACMA5_wG"

// --- Helpers ---

type Span =
  | { start: number; end: number; type: "strong" }
  | { start: number; end: number; type: "em" }
  | { start: number; end: number; type: "hyperlink"; data: { url: string; link_type: "Web" } }

function p(text: string, spans: Span[] = []) {
  return { type: "paragraph" as const, text, spans }
}

function h2(text: string, spans: Span[] = []) {
  return { type: "heading2" as const, text, spans }
}

function blockquote(text: string, spans: Span[] = []) {
  return { type: "preformatted" as const, text, spans }
}

function bold(text: string, substring: string): Span {
  const start = text.indexOf(substring)
  if (start === -1) throw new Error(`Bold substring not found: "${substring}" in "${text.slice(0, 80)}..."`)
  return { start, end: start + substring.length, type: "strong" }
}

function bolds(text: string, ...substrings: string[]): Span[] {
  return substrings.map(s => bold(text, s))
}

// --- Article Data ---

const uid = "t2-recap-rising-sevens"
const title = "Inaugural Rising Sevens Youth Tournament Augments W7F Fort Lauderdale"
const date = "2025-12-08"
const author = "World Sevens Football"
const excerpt = "The inaugural Rising Sevens brought nearly 200 girls ages 9\u201312 to Fort Lauderdale for three days of elite 7v7 competition alongside the W7F professional tournament."

const content = (() => {
  const c: Array<{ type: string; text: string; spans: Span[] }> = []

  c.push(p("The inaugural Rising Sevens Youth Tournament marked a major milestone for World Sevens Football, bringing the energy, innovation, and vision of the W7F platform to the next generation of players from December 5-7 in Fort Lauderdale, Florida."))

  c.push(p("Designed as a youth extension of the World Sevens Football 7v7 experience, Rising Sevens provided girls ages 9-12 with the rare opportunity to compete in an elite, professional-style environment while sharing the stage with the world\u2019s best in women\u2019s football."))

  const p3 = "Across the weekend, 15 teams and nearly 200 players from three divisions \u2014 the combined U9/U10 division, U11 and U12 \u2014 took part in the competition. All three competed on Saturday and Sunday, embracing the fast-paced 7v7 format that defines the World Sevens Football model. Matches were played on half-sized pitches as mini games consisting of two 15-minute halves, with teams advancing through group play and into championship rounds."
  c.push(p(p3))

  const p4 = "The results showcased both competitive excellence and the depth of emerging talent in girls\u2019 football. Weston FC 2016 Girls Black claimed the U9/U10 Division title, MVLA Barcelona emerged as champions in the U11 Division, and Fort Lauderdale United 2014 captured the U12 crown. Each champion was celebrated not only for their on-field success, but for embodying the spirit of creativity, confidence, and joy that Rising Sevens aims to inspire."
  c.push(p(p4, bolds(p4, "Weston FC 2016 Girls Black", "MVLA Barcelona", "Fort Lauderdale United 2014")))

  const p5 = "Beyond wins and losses, the tournament emphasized development, learning, and inspiration. Players competed on their own World Sevens 7v7 stage while also engaging in meaningful off-field experiences, including opportunities to connect with Player Advisors such as: Tobin Heath, Kelley O\u2019Hara, Anita Asante, Caroline Seger and Laura Georges, along with professional athletes competing in the World Sevens Football event. The chance to observe, learn from, and interact with elite players reinforced Rising Sevens\u2019 core mission: providing the next generation of footballers an opportunity to showcase their talent and learn from the best."
  c.push(p(p5, [bold(p5, "Tobin Heath, Kelley O\u2019Hara, Anita Asante, Caroline Seger and Laura Georges")]))

  c.push(blockquote("One of the most powerful moments? The confidence circle where players and advisors came together to lift each other up, share their goals and walk away knowing they belong on any pitch."))

  c.push(p("All participants received a World Sevens Football t-shirt and complimentary access to the professional W7F matches, allowing families and players to experience the full scope of the event weekend. For many, it was their first exposure to a truly global football platform \u2014 one that blends innovation, entertainment, and elite performance."))

  c.push(p("Rising Sevens also stood out for its open and inclusive approach. The tournament is not affiliated with pFYSA or US Club Soccer, making it accessible to all clubs, coaches, trainers, and independent teams. Whether organized by a club or assembled by a coach or parent, teams were welcomed into an environment built to prioritize opportunity and growth."))

  const p8 = "The weekend culminated in a memorable awards experience, with championship teams honored during a Trophy and Medal Presentation Ceremony held on Beyond Bancard Field ahead of the World Sevens Football Finals. For young players, standing on the same field as the professionals provided a powerful and lasting memory\u2014one that underscored the tournament\u2019s belief in the future of the game."
  c.push(p(p8, [bold(p8, "Trophy and Medal Presentation Ceremony")]))

  c.push(p("From first whistle to final celebration, the future of football was on full display in Fort Lauderdale. Rising Sevens didn\u2019t just introduce a new youth tournament \u2014 it created a pathway, a stage, and a shared experience that will resonate with players long after the weekend ended."))

  return c
})()

// --- Upload Logic ---

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  console.log(`Updating Rising Sevens Recap...\n`)
  console.log(`Title: ${title}`)
  console.log(`UID:   ${uid}`)
  console.log(`Date:  ${date}`)
  console.log(`Mode:  UPDATE (${EXISTING_DOC_ID})`)

  const data: Record<string, unknown> = {
    title,
    category: "Tournament Recap",
    date,
    author,
    excerpt,
    content,
  }

  try {
    const response = await fetch(`${MIGRATION_API_URL}/${EXISTING_DOC_ID}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${writeToken}`,
        "repository": REPOSITORY_NAME,
        "Content-Type": "application/json",
        "x-api-key": writeToken,
      },
      body: JSON.stringify({
        uid,
        type: "blog",
        lang: "en-us",
        title,
        data,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`  \u274C Failed: ${response.status} ${response.statusText}`)
      console.error(`  ${errorText}`)
    } else {
      const result = await response.json()
      console.log(`  \u2705 Updated successfully (id: ${result.id || EXISTING_DOC_ID})`)
    }
  } catch (error) {
    console.error(`  \u274C Error: ${error}`)
  }

  console.log("\n\u2705 Done!")
}

main().catch(console.error)
