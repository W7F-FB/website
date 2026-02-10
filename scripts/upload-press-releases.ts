import { config } from "dotenv"
config({ path: ".env.local" })

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"
const EXISTING_DOC_ID = "aYqIyBEAACMA5kIw" // PR #1, already uploaded — will be updated via PUT

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

/** Blockquote — rendered as <Blockquote> via preformatted mapping */
function blockquote(text: string, spans: Span[] = []) {
  return { type: "preformatted" as const, text, spans }
}

/** Find a substring and return a bold span for it */
function bold(text: string, substring: string): Span {
  const start = text.indexOf(substring)
  if (start === -1) throw new Error(`Bold substring not found: "${substring}" in "${text.slice(0, 80)}..."`)
  return { start, end: start + substring.length, type: "strong" }
}

/** Create multiple bold spans */
function bolds(text: string, ...substrings: string[]): Span[] {
  return substrings.map(s => bold(text, s))
}

/** Create a hyperlink span */
function link(text: string, substring: string, url: string): Span {
  const start = text.indexOf(substring)
  if (start === -1) throw new Error(`Link substring not found: "${substring}" in "${text.slice(0, 80)}..."`)
  return { start, end: start + substring.length, type: "hyperlink", data: { url, link_type: "Web" } }
}

/** Italic the entire text */
function allItalic(text: string): Span[] {
  return [{ start: 0, end: text.length, type: "em" }]
}

// --- Press Release Data ---

interface PressRelease {
  uid: string
  existingId?: string // If set, update via PUT instead of creating
  title: string
  date: string
  excerpt: string
  content: Array<{ type: string; text: string; spans: Span[] }>
}

const FTL_URL = "/tournament/fort-lauderdale"

const pressReleases: PressRelease[] = [
  // #1 — August 26, 2025 — Venue / Second Tournament Announcement
  {
    uid: "w7f-moves-stateside-to-fort-lauderdale-for-second-tournament",
    existingId: EXISTING_DOC_ID,
    title: "Grand Slam Women\u2019s 7v7 Tournament: World Sevens Football Moves Stateside to Fort Lauderdale for Second Tournament",
    date: "2025-08-26",
    excerpt: "Global Stars, $5 Million Prize Pool, and High-Octane 7v7 Action Set for December 5-7, 2025",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline paragraph
      const p1 = `NEW YORK (August 26, 2025): After a spectacular debut in Estoril, Portugal earlier this summer, World Sevens Football (W7F) announces its second tournament today. The next edition will take place from December 5-7, 2025, in Fort Lauderdale, Florida, at Beyond Bancard Field \u2013 home of the newly founded professional women\u2019s soccer team, Fort Lauderdale United FC. This fast-paced 7v7 women\u2019s football series redefines the game with elite talent from the best clubs in the world, an immersive fan-first experience, and a groundbreaking $5 million prize pool\u2014the largest in the sport, designed to fuel intense, high-stakes competition.`
      c.push(p(p1, [
        bold(p1, "NEW YORK (August 26, 2025):"),
        link(p1, "Fort Lauderdale, Florida", FTL_URL),
      ]))

      // Mission paragraph
      c.push(p(`W7F\u2019s mission is clear: \u201CTo be an undeniable force in the game of football that ignites growth and equity, delivers electrifying experiences, and connects global communities\u201D. The series is designed to advance women\u2019s football, elevate clubs and athletes, attract a new and younger fanbase, and build the next generation of stars. The innovative 7v7 format is tailored for today\u2019s digital-first audience. It features 15-minute halves, pumping music from a live DJ, content that keeps fans engaged onsite at the tournament, and online through W7F\u2019s streaming partner DAZN and their popular YouTube channel.`))

      // Inaugural event paragraph
      const p3 = `The inaugural event in Portugal featured a stellar lineup: Ajax, Bayern M\u00FCnchen, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma, and FC Roseng\u00E5rd, with global icons like Pernille Harder, Kerolin Nicoli, Ella Toone, and Lily Yohannes. Bayern M\u00FCnchen ultimately claimed the championship and the lion\u2019s share of the $5 million prize pool, with the prize money split between clubs and players.`
      c.push(p(p3, [
        bold(p3, "Ajax, Bayern M\u00FCnchen, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma, and FC Roseng\u00E5rd,"),
        bold(p3, "Pernille Harder, Kerolin Nicoli, Ella Toone, and Lily Yohannes"),
      ]))

      // Jennifer Mackesy quote
      const p4 = `\u201CWe\u2019re thrilled to confirm our second World Sevens Football tournament will take place this December in Fort Lauderdale,\u201D said Jennifer Mackesy, Co-Founder of W7F. \u201CThe response to our first event exceeded every expectation - world-class players and clubs, an electrifying format, and content that gave fans a real, authentic connection to the athletes. We can\u2019t wait to welcome this new group of players to what we promise will be not just fun and competitive, but also financially rewarding. And who doesn\u2019t want to be in Florida in the middle of the US winter, watching some of the best athletes having the time of their lives on and off the pitch?\u201D`
      c.push(p(p4, bolds(p4, "Jennifer Mackesy, Co-Founder of W7F")))

      // Adrian Jacob quote
      const p5 = `Head of W7F Football, Adrian Jacob, adds, \u201CWith an average of 11 goals every 90 minutes of play and unforgettable moments on and off the pitch, we saw undeniable proof of concept. Now, we\u2019re building on that momentum and in advanced conversations with some of the top clubs across the Americas, all truly eager to be part of World Sevens. This isn\u2019t just a tournament\u2014it\u2019s a movement, this time in America, where women\u2019s soccer has unprecedented momentum.\u201D`
      c.push(p(p5, bolds(p5, "Head of W7F Football, Adrian Jacob,")))

      // Feedback section header
      const feedbackHeader = "Feedback from the first event was overwhelmingly positive:"
      c.push(p(feedbackHeader, bolds(feedbackHeader, feedbackHeader)))

      // Tobin Heath quote — blockquote
      c.push(blockquote(`\u201CW7F is creating a future where women footballers have greater opportunities, financial security, and a bigger platform to connect with fans.\u201D\n\u2014 Tobin Heath, W7F Player Advisory Council Chair`))

      // Maya Le Tissier quote — blockquote
      c.push(blockquote(`\u201CIt\u2019s so sick; I\u2019m loving it, absolutely loving it.\u201D\n\u2014 Maya Le Tissier, Manchester United captain`))

      // Ian Wright quote — blockquote
      c.push(blockquote(`\u201CI\u2019m loving the innovation. I\u2019m so pleased that women are getting the opportunity to play 7-a-side like this. It\u2019s so serious. Great prize money. Kids can watch it. It\u2019s another factor of women\u2019s football that people can enjoy. So brilliant here!\u201D\n\u2014 Ian Wright`))

      // Marc Skinner quote — blockquote
      c.push(blockquote(`\u201CIf we\u2019re not invited back, I am going to be mad.\u201D\n\u2014 Marc Skinner, Manchester United Coach`))

      // AS Roma quote — blockquote
      c.push(blockquote(`\u201CYou have created a very top event, and we are very proud to have been part of it! We are glad we were part of this vision of future football.\u201D\n\u2014 AS Roma`))

      // Player welfare paragraph
      c.push(p("W7F is built around player welfare, with rolling substitutions, short matches, and a format that encourages and rewards the artistry, creativity, and risk-taking on the ball that made players fall in love with the world\u2019s game as kids. Surveys of each team from the inaugural event showed a 90% overall tournament approval rating, 91% enjoyment, and 95% happiness at participation."))

      // Advisory council paragraph
      const p13 = `W7F leadership works alongside a distinguished Player Advisory Council that includes global football legends Tobin Heath, Anita Asante, Kelley O\u2019Hara, Laura Georges, and Caroline Seger, who play a vital role in shaping W7F player welfare, competition integrity, and sustainable growth, ensuring the series remains a transformative force in women\u2019s football worldwide. Collectively, the entire W7F team is committed to advancing the women\u2019s game, providing a dynamic platform for players to showcase their skills, build their brands, and unlock new economic opportunities.`
      c.push(p(p13, bolds(p13, "Tobin Heath, Anita Asante, Kelley O\u2019Hara, Laura Georges, and Caroline Seger,")))

      // DAZN partnership paragraph
      c.push(p(`W7F will again partner with DAZN, the world\u2019s leading sports entertainment platform, to deliver live coverage and exclusive content worldwide, leveraging DAZN\u2019s reach across 100+ distribution platforms and the largest dedicated women\u2019s football YouTube channel. This collaboration includes a strategic sublicensing model designed to expand access, secure sponsorships and partnerships, and bring thrilling action to fans everywhere.`))

      // Hannah Brown quote
      const p15 = `\u201CAfter a fantastic experience in Portugal earlier this summer, DAZN is delighted to extend our partnership with World Sevens Football,\u201D said Hannah Brown, EVP Business Development at DAZN. \u201CThe quality and unique atmosphere of W7F, both on and off the pitch, combined with an event experience that is made for broadcast, makes this property a great event to bring to our global audience of sports fans on DAZN and our partner channels. With this second event building on the momentum from Portugal and following a hugely successful FIFA Club World Cup broadcast globally on DAZN, we are expecting to reach and engage millions of football fans from around the world.\u201D`
      c.push(p(p15, bolds(p15, "Hannah Brown, EVP Business Development at DAZN")))

      // Social change paragraph
      c.push(p(`W7F drives positive social change with initiatives like Community Champions and Rising 7\u2019s, expanding girls\u2019 access to football and delivering professional development to coaches and local organizations. Local partner organizations will be announced prior to the December tournament.`))

      return c
    })(),
  },
]

// --- Upload Logic ---

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  console.log(`Uploading/updating ${pressReleases.length} press release(s)...\n`)

  for (const pr of pressReleases) {
    console.log(`${"─".repeat(60)}`)
    console.log(`Title: ${pr.title}`)
    console.log(`UID:   ${pr.uid}`)
    console.log(`Date:  ${pr.date}`)
    console.log(`Mode:  ${pr.existingId ? `UPDATE (${pr.existingId})` : "CREATE"}`)

    const data: Record<string, unknown> = {
      title: pr.title,
      category: "Press Releases",
      date: pr.date,
      excerpt: pr.excerpt,
      content: pr.content,
    }

    const url = pr.existingId
      ? `${MIGRATION_API_URL}/${pr.existingId}`
      : MIGRATION_API_URL

    const method = pr.existingId ? "PUT" : "POST"

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Authorization": `Bearer ${writeToken}`,
          "repository": REPOSITORY_NAME,
          "Content-Type": "application/json",
          "x-api-key": writeToken,
        },
        body: JSON.stringify({
          uid: pr.uid,
          type: "blog",
          lang: "en-us",
          title: pr.title,
          data,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`  \u274C Failed: ${response.status} ${response.statusText}`)
        console.error(`  ${errorText}`)
      } else {
        const result = await response.json()
        console.log(`  \u2705 ${pr.existingId ? "Updated" : "Created"} successfully (id: ${result.id || pr.existingId})`)
      }
    } catch (error) {
      console.error(`  \u274C Error: ${error}`)
    }

    // Rate limit delay
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log("\n\u2705 Done!")
}

main().catch(console.error)
