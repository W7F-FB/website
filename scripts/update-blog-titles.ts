import { config } from "dotenv"
config({ path: ".env.local" })
import * as prismic from "@prismicio/client"
import type { BlogDocument } from "../prismicio-types"

const REPOSITORY_NAME = "world-sevens-football"
const MIGRATION_API_URL = "https://migration.prismic.io/documents"

const TITLE_UPDATES: Record<string, string> = {
  "aTYGkREAACAA1bzt": "Final Match — San Diego Wave FC Crowned W7F Champions With Perfect 5 Win Run",
  "aTYSOBEAACEA1c6G": "Tournament Recap — San Diego Wave FC Rides Undefeated Run to W7F Trophy",
  "aTORkBEAAB8A0iYJ": "Club América Show Their Class in Five Goal Win Over Club Nacional",
  "aTOA6xEAACIA0gz3": "San Diego Open Their W7F Campaign With Energetic Win Over Deportivo Cali",
  "aTSwpxEAACAA08Tw": "Kaylee Hunter Masterclass Lifts Toronto to First Win",
  "aTTLtREAACEA0-sF": "The Wave Remain Only Unbeaten Team With 3-1 Win Over Club Nacional",
  "aTSWyhEAACIA059w": "Wave Edge Club América in Keeper Showdown to Claim Second Straight Win",
  "aTR58xEAACAA03RK": "NWSL Champs Kansas City Edge Tigres in Second Penalty Shootout of the Day",
  "aTN8UBEAACIA0gWe": "Flamengo Stun Kansas City in Five-Goal Opener",
  "aTXJvREAACEA1VzF": "Tigres Conquer Mexican Clásico to Reach the Final",
  "aTXcXREAACAA1Xnc": "Undefeated Wave Surge Into Final With Emphatic Win Over Flamengo",
  "aTXskREAACAA1ZId": "Gutiérrez 'Golazo' Seals Bronze for Club América",
  "aTRt5xEAACIA02JZ": "Flamengo Clinches Dramatic Penalty Win Over AFC Toronto in Day Two Opener",
  "aTS-IxEAACAA09f0": "Tigres Beat Flamengo to Claim First Place in Group 1",
  "aTT0mBEAACAA1CZL": "Club América Will Face Tigres in Semi Final 1 After Win Against Cali",
  "aTSKXREAACAA04xW": "Cali Gets Convincing Win Over Nacional in South American Showdown",
  "aNGIXxEAACQAj1ef": "Match 2 Recap — Manchester United Edge Roma in Five-Goal Thriller",
  "aNGFXBEAACIAj1L3": "Match 9 Recap — Bayern München Stay Perfect to Top Group 1",
  "aNGH1hEAACMAj1bL": "Match 3 Recap — Bayern München Top Ajax",
  "aNGCWhEAACQAj048": "Consolation Match Game Recap — PSG Triumph Over City",
  "aNGHaBEAACQAj1Ym": "Match 4 Recap — PSG Take Benfica",
  "aNGC0xEAACIAj074": "Semifinal #2 Recap — Manchester United Headed to the Title Game",
  "aNGDOBEAACMAj0-U": "Semifinal #1 Recap — Bayern München Roll Into the Final",
  "aNGEGhEAACQAj1D7": "Match 12 Recap — Manchester United Win Group 2",
  "aNGFpxEAACQAj1Nv": "Match 8 Recap — Manchester United Punch Ticket to Semis",
  "aNGG5REAACMAj1Vb": "Match 5 Recap — Man City Survive Ajax Scare",
  "aNGGDhEAACQAj1QL": "Match 7 Recap — PSG Oust Roma in Sudden Death",
  "aNGGiREAACQAj1TN": "Match 6 Recap — Bayern München Trounce FC Rosengård",
  "aNGBgxEAACMAj0ze": "Final Match Game Recap — Bayern Are Champions!",
  "aNGElBEAACQAj1HA": "Match 11 Recap — Roma End Tournament With a Win",
  "aNGE_hEAACIAj1Jf": "Match 10 Recap — Ajax Notch First Win",
  "aS_w1BEAACQAws6q": "The Field Is Set! Beyond Bancard Field in Fort Lauderdale, Florida, December 5-7",
  "aNGJpREAACIAj1mM": "Opening Whistle Is Imminent — World Sevens Football Kicks Off Today at 17:00GMT",
  "aNGLMxEAACMAj1wC": "World Sevens Football Welcomes Kika Nazareth as a Player Ambassador",
  "aQ4RRRAAACYAaPEb": "World Sevens Football Adds Mexico's Tigres Femenil and Colombia's Deportivo Cali Femenino to Star-Studded Roster for US-Based Tournament Debut",
  "aNGDsBEAACIAj1BM": "W7F Connects With the Local Community",
  "aM18ZhEAACEAiVJb": "Tournament Recap — Bayern Win Inaugural W7F Tournament",
  "aM2czBEAACQAiYar": "Grand Slam Women's 7v7 Tournament: World Sevens Football Moves Stateside to Fort Lauderdale for Second Tournament",
  "aM2cUREAACMAiYXb": "World Sevens Football Appoints Sarah Cummins as CEO",
  "aRXzBxIAACIA6mlG": "Club Nacional De Football Feminino Joins the W7F Field!",
  "aNGIzBEAACIAj1hH": "Match 1 Recap — Manchester City Handle FC Rosengård in Dominant Fashion",
  "aQ4SLRAAACUAaPMj": "NWSL Clubs to Compete in First-Ever North American World Sevens Football Tournament",
}

async function main() {
  const writeToken = process.env.PRISMIC_WRITE_TOKEN
  if (!writeToken) {
    console.error("PRISMIC_WRITE_TOKEN environment variable is required")
    process.exit(1)
  }

  const client = prismic.createClient(REPOSITORY_NAME)
  const blogIds = Object.keys(TITLE_UPDATES)
  
  console.log(`Updating ${blogIds.length} blog titles...\n`)

  for (const blogId of blogIds) {
    const newTitle = TITLE_UPDATES[blogId]
    console.log(`\n${"─".repeat(60)}`)
    console.log(`Processing blog: ${blogId}`)
    
    try {
      const doc = await client.getByID(blogId)
      if (doc.type !== "blog") {
        console.error(`  ❌ Document is not a blog: ${doc.type}`)
        continue
      }
      const blog = doc as BlogDocument
      console.log(`  Current title: ${blog.data.title}`)
      console.log(`  New title: ${newTitle}`)

      const updatedData = {
        ...blog.data,
        title: newTitle,
      }

      const response = await fetch(`${MIGRATION_API_URL}/${blogId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${writeToken}`,
          "repository": REPOSITORY_NAME,
          "Content-Type": "application/json",
          "x-api-key": writeToken
        },
        body: JSON.stringify({
          uid: blog.uid,
          type: "blog",
          lang: blog.lang,
          title: newTitle,
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
    } catch (error) {
      console.error(`  ❌ Error: ${error}`)
    }

    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  console.log("\n✅ Done updating all blog titles!")
}

main().catch(console.error)
