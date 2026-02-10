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

function h4(text: string, spans: Span[] = []) {
  return { type: "heading4" as const, text, spans }
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
  // #1 — August 26, 2025 — Venue Announcement
  {
    uid: "w7f-fort-lauderdale-venue-announcement",
    existingId: "aYqIyBEAACMA5kIw",
    title: "Grand Slam Women\u2019s 7v7 Tournament: World Sevens Football Moves Stateside to Fort Lauderdale for Second Tournament",
    date: "2025-08-26",
    excerpt: "Global Stars, $5 Million Prize Pool, and High-Octane 7v7 Action Set for December 5-7, 2025",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK (August 26, 2025): After a spectacular debut in Estoril, Portugal earlier this summer, World Sevens Football (W7F) announces its second tournament today. The next edition will take place from December 5-7, 2025, in Fort Lauderdale, Florida, at Beyond Bancard Field \u2013 home of the newly founded professional women\u2019s soccer team, Fort Lauderdale United FC. This fast-paced 7v7 women\u2019s football series redefines the game with elite talent from the best clubs in the world, an immersive fan-first experience, and a groundbreaking $5 million prize pool\u2014the largest in the sport, designed to fuel intense, high-stakes competition.`
      c.push(p(p1, [bold(p1, "NEW YORK (August 26, 2025):")]))

      // Mission
      c.push(p(`W7F\u2019s mission is clear: \u201CTo be an undeniable force in the game of football that ignites growth and equity, delivers electrifying experiences, and connects global communities\u201D. The series is designed to advance women\u2019s football, elevate clubs and athletes, attract a new and younger fanbase, and build the next generation of stars. The innovative 7v7 format is tailored for today\u2019s digital-first audience. It features 15-minute halves, pumping music from a live DJ, content that keeps fans engaged onsite at the tournament, and online through W7F\u2019s streaming partner DAZN and their popular YouTube channel.`))

      // Inaugural event
      const p3 = `The inaugural event in Portugal featured a stellar lineup: Ajax, Bayern M\u00FCnchen, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma, and FC Roseng\u00E5rd, with global icons like Pernille Harder, Kerolin Nicoli, Ella Toone, and Lily Yohannes. Bayern M\u00FCnchen ultimately claimed the championship and the lion\u2019s share of the $5 million prize pool, with the prize money split between clubs and players.`
      c.push(p(p3, bolds(p3, "Ajax, Bayern M\u00FCnchen, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma, and FC Roseng\u00E5rd,", "Pernille Harder, Kerolin Nicoli, Ella Toone, and Lily Yohannes")))

      // Jennifer Mackesy quote
      const q1 = `\u201CWe\u2019re thrilled to confirm our second World Sevens Football tournament will take place this December in Fort Lauderdale,\u201D said Jennifer Mackesy, Co-Founder of W7F. \u201CThe response to our first event exceeded every expectation - world-class players and clubs, an electrifying format, and content that gave fans a real, authentic connection to the athletes. We can\u2019t wait to welcome this new group of players to what we promise will be not just fun and competitive, but also financially rewarding. And who doesn\u2019t want to be in Florida in the middle of the US winter, watching some of the best athletes having the time of their lives on and off the pitch?\u201D`
      c.push(p(q1, bolds(q1, "Jennifer Mackesy, Co-Founder of W7F.")))

      // Adrian Jacob quote
      const q2 = `Head of W7F Football, Adrian Jacob, adds, \u201CWith an average of 11 goals every 90 minutes of play and unforgettable moments on and off the pitch, we saw undeniable proof of concept. Now, we\u2019re building on that momentum and in advanced conversations with some of the top clubs across the Americas, all truly eager to be part of World Sevens. This isn\u2019t just a tournament\u2014it\u2019s a movement, this time in America, where women\u2019s soccer has unprecedented momentum.\u201D`
      c.push(p(q2, bolds(q2, "Head of W7F Football, Adrian Jacob,")))

      // Feedback heading
      c.push(h4("Feedback from the first event was overwhelmingly positive:"))

      // Blockquotes
      c.push(blockquote(`\u201CW7F is creating a future where women footballers have greater opportunities, financial security, and a bigger platform to connect with fans.\u201D\n\u2014 Tobin Heath, W7F Player Advisory Council Chair`))

      c.push(blockquote(`\u201CIt\u2019s so sick; I\u2019m loving it, absolutely loving it.\u201D\n\u2014 Maya Le Tissier, Manchester United captain`))

      c.push(blockquote(`\u201CI\u2019m loving the innovation. I\u2019m so pleased that women are getting the opportunity to play 7-a-side like this. It\u2019s so serious. Great prize money. Kids can watch it. It\u2019s another factor of women\u2019s football that people can enjoy. So brilliant here!\u201D\n\u2014 Ian Wright`))

      c.push(blockquote(`\u201CIf we\u2019re not invited back, I am going to be mad.\u201D\n\u2014 Marc Skinner, Manchester United Coach`))

      c.push(blockquote(`\u201CYou have created a very top event, and we are very proud to have been part of it! We are glad we were part of this vision of future football.\u201D\n\u2014 AS Roma`))

      // Player welfare
      c.push(p(`W7F is built around player welfare, with rolling substitutions, short matches, and a format that encourages and rewards the artistry, creativity, and risk-taking on the ball that made players fall in love with the world\u2019s game as kids. Surveys of each team from the inaugural event showed a 90% overall tournament approval rating, 91% enjoyment, and 95% happiness at participation.`))

      // Player Advisory Council
      const pac = `W7F leadership works alongside a distinguished Player Advisory Council that includes global football legends Tobin Heath, Anita Asante, Kelley O\u2019Hara, Laura Georges, and Caroline Seger, who play a vital role in shaping W7F player welfare, competition integrity, and sustainable growth, ensuring the series remains a transformative force in women\u2019s football worldwide. Collectively, the entire W7F team is committed to advancing the women\u2019s game, providing a dynamic platform for players to showcase their skills, build their brands, and unlock new economic opportunities.`
      c.push(p(pac, bolds(pac, "Tobin Heath, Anita Asante, Kelley O\u2019Hara, Laura Georges, and Caroline Seger,")))

      // DAZN partnership
      c.push(p(`W7F will again partner with DAZN, the world\u2019s leading sports entertainment platform, to deliver live coverage and exclusive content worldwide, leveraging DAZN\u2019s reach across 100+ distribution platforms and the largest dedicated women\u2019s football YouTube channel. This collaboration includes a strategic sublicensing model designed to expand access, secure sponsorships and partnerships, and bring thrilling action to fans everywhere.`))

      // Hannah Brown quote
      const q3 = `\u201CAfter a fantastic experience in Portugal earlier this summer, DAZN is delighted to extend our partnership with World Sevens Football,\u201D said Hannah Brown, EVP Business Development at DAZN. \u201CThe quality and unique atmosphere of W7F, both on and off the pitch, combined with an event experience that is made for broadcast, makes this property a great event to bring to our global audience of sports fans on DAZN and our partner channels. With this second event building on the momentum from Portugal and following a hugely successful FIFA Club World Cup broadcast globally on DAZN, we are expecting to reach and engage millions of football fans from around the world.\u201D`
      c.push(p(q3, bolds(q3, "Hannah Brown, EVP Business Development at DAZN.")))

      // Community Champions
      c.push(p(`W7F drives positive social change with initiatives like Community Champions and Rising 7\u2019s, expanding girls\u2019 access to football and delivering professional development to coaches and local organizations. Local partner organizations will be announced prior to the December tournament.`))

      // Closing with link
      const info = `For more details and information, visit worldsevensfootball.com`
      c.push(p(info, [link(info, "worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      return c
    })(),
  },

  // #2 — September 16, 2025 — Sarah Cummins CEO Appointment
  {
    uid: "w7f-appoints-sarah-cummins-as-ceo",
    existingId: "aYqf2hEAACMA5mQW",
    title: "World Sevens Football Appoints Sarah Cummins as CEO",
    date: "2025-09-16",
    excerpt: "Cummins brings more than 25 years of experience in sports, entertainment, and media to lead the global women\u2019s football series",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK CITY (September 16, 2025) \u2013 World Sevens Football (W7F), the internationally anticipated seven-a-side professional women\u2019s football series, is delighted to announce the appointment of Sarah Cummins as its new Chief Executive Officer (CEO). Cummins assumes leadership with a wealth of experience spanning more than 25 years as a revenue driver, brand builder, and commercial operator across global sports, entertainment, and media.`
      c.push(p(p1, [bold(p1, "NEW YORK CITY (September 16, 2025) \u2013")]))

      // Background
      c.push(p(`Cummins most recently served as SVP, Partnerships at WTA Ventures, where she led commercial brand partnerships for the WTA Tour, the global leader in women\u2019s tennis. Her other roles include Operating Partner at Isos Capital, SVP of Consumer Products at WWE, and leadership positions with New York Road Runners, Vineyard Vines, and the USTA. With her comes a formidable track record of overseeing multi-million dollar contract negotiations, driving global commercial growth strategies, and building high-performing teams.`))

      // Sarah Cummins quote
      const q1 = `\u201CI\u2019m absolutely thrilled to join World Sevens Football as CEO. Throughout my career, I\u2019ve proudly worked for sports and entertainment properties committed to innovation, pushing boundaries, and building communities. World Sevens Football embodies all of those same characteristics and promises to engage fans and players to build the next generation of women\u2019s football.\u201D Cummins shared. \u201CThe competition\u2019s global platform, game-changing prize pool, and bold vision to elevate the athlete experience are the perfect foundation for success. I look forward to working alongside our players, partners, and fans to shape the future of the game.\u201D`
      c.push(p(q1, bolds(q1, "Cummins shared.")))

      // Jen Mackesy quote
      const q2 = `Jen Mackesy, Co-Founder and Investor, added: \u201CSarah\u2019s wide-ranging experience across sports, entertainment, and media brings invaluable perspective and energy to W7F. We\u2019re extremely excited to have her in this leadership role, which will enable us to take World Sevens Football to the next level as we continue our mission to grow the women\u2019s game globally.\u201D`
      c.push(p(q2, bolds(q2, "Jen Mackesy, Co-Founder and Investor,")))

      // Closing
      c.push(p(`World Sevens Football, launched in May 2025 with a $5 million prize pool per event, delivers faster-paced matches, unmissable global exposure, and unparalleled opportunities for women footballers and clubs. The next edition will take place from December 5-7, 2025, in Fort Lauderdale, Florida, at Beyond Bancard Field, home of the newly founded professional women\u2019s soccer team, Fort Lauderdale United FC, a member of the Gainbridge Super League.`))

      return c
    })(),
  },

  // #3 — October 9, 2025 — First Two Teams (Club América & Flamengo)
  {
    uid: "w7f-unveils-first-two-teams-club-america-and-flamengo",
    existingId: "aYqg1hEAACMA5mWT",
    title: "World Sevens Football Unveils First Two Elite Women\u2019s Teams Representing Brazil and Mexico for Second Tournament This December",
    date: "2025-10-09",
    excerpt: "Global Football Stars, $5 Million Prize Pool, and High-Octane 7v7 Action Set for December 5\u20137, 2025 in Ft. Lauderdale, Florida",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Tickets line (italic)
      const tix = `Tickets on sale at www.worldsevensfootball.com`
      c.push(p(tix, [...allItalic(tix), link(tix, "www.worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      // Dateline
      const p1 = `NEW YORK (October 9, 2025): World Sevens Football (W7F) announced today the first two professional women\u2019s football clubs to compete in its second global tournament: Mexico\u2019s Club Am\u00E9rica and Brazil\u2019s Clube de Regatas do Flamengo. Both teams will be among eight elite squads confirmed for this electrifying event, which will take place December 5-7, 2025, at Beyond Bancard Field in Fort Lauderdale, Florida, home of Gainbridge USL\u2019s Fort Lauderdale United FC.`
      c.push(p(p1, [bold(p1, "NEW YORK (October 9, 2025):")]))

      // Tickets info
      const tix2 = `Tickets are now available, including premium sideline, party deck, pitchside, and VIP options. Each ticket includes access to the W7F Fan Fest featuring football activities, giveaways, and food and beverages for purchase. To purchase tickets, fans can visit www.worldsevensfootball.com.`
      c.push(p(tix2, [link(tix2, "www.worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      // About Club América
      c.push(h4("About Club Am\u00E9rica \u2014 Mexico City, Mexico"))
      c.push(p(`Club Am\u00E9rica, hailing from Mexico City, stands as a dominant power in Latin American women\u2019s football. As a two-time Liga MX Femenil champion, clinching the title in Apertura 2018 and Clausura 2023, Club Am\u00E9rica has set the standard for the Mexican women\u2019s league\u2019s rapid growth. The club has become synonymous with excellence, combining a vibrant attacking style with a strong commitment to developing youth and international stars. Their storied history within Mexican football, massive nationwide support, and a deeply competitive squad have cemented their status as consummate performers on both the domestic and international stage.`))

      // Luis Fuentes quote
      const q1 = `\u201CThis invitation to participate in World Sevens Football is a point of pride for everyone connected to Club Am\u00E9rica,\u201D said Luis Fuentes, Sporting Director of Am\u00E9rica Femenil. \u201CWe are thrilled to join the tournament\u2019s innovative vision to advance women\u2019s football around the world, and we are eager to contribute our passion and talent to a world-class competition in Fort Lauderdale.\u201D`
      c.push(p(q1, bolds(q1, "said Luis Fuentes, Sporting Director of Am\u00E9rica Femenil.")))

      // About Flamengo
      c.push(h4("About Clube de Regatas do Flamengo \u2014 Rio de Janeiro, Brazil"))
      c.push(p(`Based in the heart of Rio de Janeiro, Clube de Regatas do Flamengo is one of Brazil\u2019s most storied institutions, drawing on a legacy of excellence both domestically and internationally. Flamengo\u2019s women\u2019s team competes at the pinnacle of the Brazilian game, with a Campeonato Brasileiro S\u00E9rie A1 national championship and a remarkable eight Campeonato Carioca state titles, the most recent coming in 2024. Founded in 1895, Flamengo plays its home games at Est\u00E1dio da G\u00E1vea and is renowned for a passionate fan base and a long tradition of producing exceptional talent for both club and country. The women\u2019s side is distinguished not just by its historic achievements but also by its development of Brazilian national team stars and rising youth prospects.`))

      // André Rocha quote
      const q2 = `\u201CIt\u2019s an incredible honor to bring Flamengo\u2019s red and black to the World Sevens Football stage,\u201D said Andr\u00E9 Rocha, General Manager of the Women\u2019s Team, Clube de Regatas do Flamengo. \u201CThis format highlights the best of the global women\u2019s game, and we look forward to sharing the pitch with the world\u2019s elite in Fort Lauderdale. Representing Brazil at this event is about more than competition\u2014it\u2019s a celebration of our club, our supporters, and our vision for the future of women\u2019s football.\u201D`
      c.push(p(q2, bolds(q2, "said Andr\u00E9 Rocha, General Manager of the Women\u2019s Team, Clube de Regatas do Flamengo.")))

      // Tournament section
      c.push(h4("Tournament"))

      // Jen Mackesy quote
      const q3 = `\u201CWorld Sevens Football is about more than just competition\u2014it\u2019s about creating a platform that inspires the next generation while celebrating the best in the game and paying these athletes a prize pool they deserve,\u201D said Jen Mackesy, Co-Founder of W7F. \u201CBringing together powerhouse clubs like Club Am\u00E9rica and Flamengo shows how deeply the women\u2019s game is resonating across continents and we can\u2019t wait to share the others joining us in Fort Lauderdale this December!\u201D`
      c.push(p(q3, bolds(q3, "said Jen Mackesy, Co-Founder of W7F.")))

      // Sarah Cummins quote
      const q4 = `\u201CWe know the foundation of World Sevens Football is the world-class athletes who play the game and the passionate communities who support them,\u201D said Sarah Cummins, CEO of W7F. \u201CAs we prepare for our second tournament, our goal is simple: deliver the best possible experience for our players, fans, and partners. From the atmosphere in Fort Lauderdale to our broadcast around the world with DAZN, every decision we make is about raising standards, building excitement, and making every moment memorable for everyone who loves women\u2019s football.\u201D`
      c.push(p(q4, bolds(q4, "said Sarah Cummins, CEO of W7F.")))

      // Building on success
      c.push(p(`Building on the runaway success of its debut in Portugal in May 2025, W7F is again poised to deliver a groundbreaking three-day tournament. Eight top-tier teams will compete for a landmark $5 million prize pool, one of the largest in women\u2019s football. The inaugural W7F event showcased icons such as Pernille Harder, Kerolin Nicoli, Ella Toone, and Lily Yohannes, culminating in a Bayern M\u00FCnchen win over Man United in a gripping final, taking home both the crown and the largest share of the prize money.`))

      // Adrian Jacob quote
      const q5 = `\u201CThe inaugural World Sevens Football tournament proved the global appetite for high-energy, innovative women\u2019s football is stronger than ever,\u201D said Adrian Jacob, Head of Football, W7F. \u201CThese clubs represent the very best of their regions, and their participation speaks volumes about the rising momentum for women\u2019s sport. Fans can expect electrifying play, star power, and an unforgettable weekend as we build the future of the game.\u201D`
      c.push(p(q5, bolds(q5, "said Adrian Jacob, Head of Football, W7F.")))

      // DAZN
      c.push(p(`W7F continues its partnership with DAZN to bring the tournament to fans worldwide, enhancing the viewing experience through 100+ distribution platforms and immersive content on the largest dedicated women\u2019s football YouTube channel. The strategic partnership emphasizes expanding access, attracting major sponsorships, and growing the audience for women\u2019s sport.`))

      return c
    })(),
  },

  // #4 — October 20, 2025 — AFC Toronto Announced As Third Team
  {
    uid: "w7f-afc-toronto-announced-as-third-team",
    existingId: "aYqg1xEAACMA5mWX",
    title: "Northern Super League 2025 Supporters Shield Winners AFC Toronto Announced as Third Team to Compete in World Sevens Football Tournament This December",
    date: "2025-10-20",
    excerpt: "AFC Toronto Joins Mexico\u2019s Club Am\u00E9rica and Brazil\u2019s Clube de Regatas do Flamengo in $5 Million Showdown at First-Ever North American Event in Ft. Lauderdale, Florida",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK (October 20, 2025): World Sevens Football (W7F) announced AFC Toronto, the winners of the 2025 Northern Super League Supporters\u2019 Shield, as the newest addition to its first-ever W7F event in North America, set for December 5\u20137, 2025, at Beyond Bancard Field in Fort Lauderdale, Florida. The Canadian side joins Mexico\u2019s Club Am\u00E9rica and Brazil\u2019s Clube de Regatas do Flamengo on a growing roster of elite teams competing in a high-stakes, high-energy, 7v7 soccer showdown.`
      c.push(p(p1, [bold(p1, "NEW YORK (October 20, 2025):")]))

      // Sarah Cummins quote
      const q1 = `\u201CWe are proud to welcome AFC Toronto \u2014 inaugural 2025 Northern Super League regular season champions and winners of the Supporters\u2019 Shield \u2014 to our second W7F tournament, where they\u2019ll represent the league against elite clubs from across the Americas,\u201D said W7F CEO, Sarah Cummins. \u201CThis milestone invitation marks the first time a team has qualified for W7F based on domestic performance \u2014 having finished with the most points in league play \u2014 underscoring our mission to expand global opportunities for women athletes and celebrate domestic league excellence. With one of the sport\u2019s largest prize pools, valued at $5 million USD, the event embodies our shared commitment to driving the women\u2019s game forward.\u201D`
      c.push(p(q1, bolds(q1, "said W7F CEO, Sarah Cummins.")))

      // AFC Toronto background
      c.push(p(`AFC Toronto enters World Sevens Football on the back of a historic debut campaign \u2014 winning the inaugural Northern Super League Supporters\u2019 Shield in commanding fashion. With a roster led by Canadian international and captain Emma Regan, AFC Toronto is quickly establishing itself as a rising force in North American women\u2019s football.`))

      // Helena Ruken quote
      const q2 = `\u201CIt\u2019s an incredible honor for AFC Toronto to represent the Northern Super League at the first-ever World Sevens event in North America,\u201D said Helena Ruken, CEO of AFC Toronto. \u201CThis is a very special invitation for our club and for professional women\u2019s football in Toronto \u2014 a chance to show what this city and this league are building together. We are proud to compete against world-class clubs from across the Americas who share our ambition to keep moving the game forward.\u201D`
      c.push(p(q2, bolds(q2, "said Helena Ruken, CEO of AFC Toronto.")))

      // Christina Litz quote
      const q3 = `\u201CAs the Northern Super League\u2019s inaugural regular season champions, AFC Toronto has earned the right to compete on one of the world\u2019s biggest stages,\u201D said Christina Litz, President of the Northern Super League. \u201CTheir invitation to World Sevens Football reflects the competitive standard and ambition across our league. The NSL is quickly establishing itself among the top professional women\u2019s soccer leagues globally, and we\u2019re committed to creating new opportunities for our athletes while showcasing the depth of Canadian talent on the international stage. AFC Toronto\u2019s participation is a milestone that underscores the rapid growth of women\u2019s football in Canada and our vision to inspire the next generation here at home and around the world.\u201D`
      c.push(p(q3, bolds(q3, "said Christina Litz, President of the Northern Super League.")))

      // Tournament section
      c.push(h4("Tournament"))

      c.push(p(`After an electrifying debut in Estoril that captivated fans across the globe, World Sevens Football returns this December to deliver once again the high-energy spectacle and global excitement that define the tournament. Eight elite clubs will battle it out over three action-packed days, chasing a share of the unprecedented $5 million prize pool, one of the richest in the women\u2019s game. The inaugural tournament delivered unforgettable moments, from breakout performances to global icons lighting up the pitch, and ended in dramatic fashion with Bayern M\u00FCnchen edging Manchester United in a thrilling final. Now, the stage is set for Fort Lauderdale to take the spotlight.`))

      // Tickets
      const tix = `Tickets are now available, including premium sideline, party deck, pitchside, and VIP options. Each ticket includes access to the W7F Fan Fest, which will feature football activities, giveaways, and food and beverages for purchase. To purchase tickets, fans can visit www.worldsevensfootball.com.`
      c.push(p(tix, [link(tix, "www.worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      // About AFC Toronto
      c.push(h4("About AFC Toronto"))
      c.push(p(`AFC Toronto is a founding club in the Northern Super League, Canada\u2019s new professional women\u2019s soccer league. The club is delivering a winning culture for players, staff, and supporters in its inaugural 2025 season.`))
      c.push(p(`Rooted in community and driven by purpose, AFC Toronto exists not only to compete at the highest level, but to create a platform for girls and women to lead, grow, and thrive \u2014 on and off the pitch. Guided by its ethos \u2014 Run It Our Way \u2014 the club is reimagining what it means to pursue excellence, build meaningful connections, and define success on its own terms.`))
      const afc = `Learn more at afctoronto.com or follow @afc.toronto on social media.`
      c.push(p(afc, [link(afc, "afctoronto.com", "https://afctoronto.com")]))

      // About the Northern Super League
      c.push(h4("About the Northern Super League"))
      const nsl = `The Northern Super League is Canada\u2019s first professional women\u2019s soccer league with six founding clubs: Calgary Wild FC, Halifax Tides FC, Montr\u00E9al Roses, Ottawa Rapid FC, AFC Toronto and Vancouver Rise FC. Built by players including former Canadian Women\u2019s National Team players Diana Matheson, Christine Sinclair (part-owner of the Vancouver Rise FC) and supporters, the League is rooted in global best practices and strives to champion Canadian excellence in sport, equity, and inclusion. For broadcast, streaming and ticket information, visit www.NSL.ca.`
      c.push(p(nsl, [link(nsl, "www.NSL.ca", "https://www.NSL.ca")]))

      return c
    })(),
  },

  // #5 — October 24, 2025 — Tigres Femenil & Deportivo Cali Announcement
  {
    uid: "w7f-adds-tigres-femenil-and-deportivo-cali",
    existingId: "aYqg2REAACQA5mWd",
    title: "World Sevens Football Adds Mexico\u2019s Tigres Femenil and Colombia\u2019s Deportivo Cali Femenino to Star-Studded Roster for US-Based Tournament Debut",
    date: "2025-10-24",
    excerpt: "Joining Mexico\u2019s Club Am\u00E9rica, Brazil\u2019s Flamengo and Canada\u2019s AFC Toronto for World Sevens Football\u2019s North American Debut",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK (October 24, 2025): World Sevens Football (W7F) continues to build its elite lineup for the upcoming North American debut by adding two heavyweight clubs to its December tournament: Tigres Femenil of Mexico and Deportivo Cali Femenino of Colombia. These celebrated teams join a growing roster of global talent set to compete in W7F\u2019s high-energy, three-day 7v7 showdown on December 5\u20137, 2025, at Beyond Bancard Field in Fort Lauderdale, Florida.`
      c.push(p(p1, [bold(p1, "NEW YORK (October 24, 2025):")]))

      // Sarah Cummins quote
      const q1 = `\u201CWelcoming Tigres and Deportivo Cali to our first-ever W7F tournament in North America is a powerful reflection of our mission to unite world-class clubs and expand global opportunities for female footballers,\u201D said Sarah Cummins, CEO of World Sevens Football. \u201CThese teams represent the very best of their regions, with rich histories, passionate fanbases, and a deep commitment to growing the women\u2019s game. We\u2019re proud to offer a platform where elite talent can compete for one of the sport\u2019s largest prize pools and gain international visibility. This tournament is about more than football; it\u2019s about creating meaningful pathways for athletes and celebrating the excellence of clubs across the globe.\u201D`
      c.push(p(q1, bolds(q1, "said Sarah Cummins, CEO of World Sevens Football.")))

      // About Tigres
      c.push(h4("About Tigres UANL Femenil \u2014 San Nicol\u00E1s de los Garza, M\u00E9xico"))
      c.push(p(`Tigres Femenil is a dominant force in Mexican women\u2019s football, boasting six Liga MX Femenil championships and a reputation for excellence across the Americas. Known for their fierce competitiveness, tactical brilliance, and passionate fan base, Tigres has become a beacon for women\u2019s football in the region. Their consistent success, including international friendlies and CONCACAF showings, has positioned them as one of the most respected clubs in the Western Hemisphere.`))

      // Mauricio Culebro Galván quote
      const q2 = `\u201CWe are honored to participate in the World Sevens Football tournament in North America,\u201D said Mauricio Culebro Galv\u00E1n, President of Tigres. \u201CThis innovative format can only benefit women\u2019s soccer. It is a dynamic, global tournament with great potential for growth, and it is a privilege to compete alongside some of the most respected clubs in the world to showcase the talent, passion, and dedication that define our team\u201D.`
      c.push(p(q2, bolds(q2, "said Mauricio Culebro Galv\u00E1n, President of Tigres.")))

      // About Deportivo Cali
      c.push(h4("About Deportivo Cali Femenino \u2014 Cali, Colombia"))
      c.push(p(`Deportivo Cali Femenino has emerged as a trailblazer in South American football, capturing the Liga Femenina Profesional title in 2021 and consistently producing top-tier talent for Colombia\u2019s national team. With a commitment to youth development and a bold, attacking style, Deportivo Cali has earned its place among the continent\u2019s elite. Their participation in Copa Libertadores Femenina and continued investment in the women\u2019s game reflect a club deeply aligned with the future of football.`))

      // Eduardo Calderón quote
      const q3 = `\u201CJoining World Sevens Football\u2019s North American debut is a meaningful milestone for our club,\u201D said Eduardo Calder\u00F3n, Vice President. \u201CWe see this as more than a tournament; this is a platform to amplify the voices and talents of women footballers across South America. Deportivo Cali has always believed in building from the ground up, investing in youth, and pushing the game forward. To be part of World Sevens Football, a global tournament that shares those values, is both an honor and a responsibility we embrace with pride.\u201D`
      c.push(p(q3, bolds(q3, "said Eduardo Calder\u00F3n, Vice President.")))

      // Tournament
      c.push(h4("Tournament"))
      c.push(p(`Building on the global momentum sparked by its electrifying debut in Estoril, World Sevens returns this December with its first-ever North American tournament, a high-octane, three-day showcase set to redefine the women\u2019s game. Eight elite clubs from across the globe will compete for a $5 million prize pool, one of the largest in women\u2019s football. The inaugural event delivered unforgettable moments: breakout stars, global icons, and a dramatic final where Bayern M\u00FCnchen edged Manchester United to claim the inaugural crown.`))

      // Tickets
      const tix = `Tickets are now available, including premium sideline, party deck, pitchside, and VIP options. Each ticket includes access to the W7F Fan Fest, which will feature football activities, giveaways, and food and beverages for purchase. To purchase tickets, fans can visit www.worldsevensfootball.com.`
      c.push(p(tix, [link(tix, "www.worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      return c
    })(),
  },

  // #6 — October 28, 2025 — NWSL Clubs Announcement
  {
    uid: "w7f-nwsl-clubs-kansas-city-current-san-diego-wave",
    existingId: "aYqg2xEAACMA5mWk",
    title: "NWSL Clubs to Compete in First-Ever North American World Sevens Football Tournament",
    date: "2025-10-28",
    excerpt: "Kansas City Current and San Diego Wave FC to face off against powerhouse teams from across the Americas in high stakes, 7v7 showcase",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK \u2014 October 28, 2025 \u2014 World Sevens Football (W7F) proudly announces that it will be welcoming two National Women\u2019s Soccer League (NWSL) teams to its inaugural North American edition with the Kansas City Current and San Diego Wave FC representing the league in the tournament, which will take place December 5\u20137, 2025, in Fort Lauderdale, Florida at Beyond Bancard Field.`
      c.push(p(p1, [bold(p1, "NEW YORK \u2014 October 28, 2025 \u2014")]))

      // Joining paragraph
      c.push(p(`Joining Canada\u2019s AFC Toronto, Mexico\u2019s Club Am\u00E9rica and Tigres Femenil, Brazil\u2019s Clube de Regatas do Flamengo, and Colombia\u2019s Deportivo Cali Femenino, these elite teams will come together for a global showcase of elite women\u2019s football talent in a 7v7 format. The event will unite top clubs from across the Americas, create more playing opportunities, and deliver one of the most significant prize pools in women\u2019s football.`))

      // Sarah Cummins quote
      const q1 = `Sarah Cummins, CEO of W7F: \u201CWe are thrilled to welcome the Kansas City Current and San Diego Wave FC to our exhilarating 7v7 tournament, where they will compete against top clubs from across the Americas. This high-stakes competition showcases the talent and ambition fueling the women\u2019s game today. We know the fans will come out and cheer on these world-class teams as they compete for the title and a significant prize, reflecting our ongoing commitment to creating opportunities that reward excellence and elevate women\u2019s football on the global stage.\u201D`
      c.push(p(q1, bolds(q1, "Sarah Cummins, CEO of W7F:")))

      // Kansas City Current
      c.push(h4("Kansas City Current \u2014 Kansas City, Missouri"))
      c.push(p(`Kansas City Current is one of the league\u2019s fastest-rising franchises, with owners Angie and Chris Long at the helm. Their visionary leadership has transformed player and fan experience, recently opening CPKC Stadium, the first stadium in the world purpose-built for a women\u2019s professional team, and breaking records in the process. With an elite attack and stalwart defense, the Kansas City Current locked up the 2025 NWSL Shield and will take the No. 1 seed into the postseason.`))
      c.push(p(`The Current is led by international stars like Malawian Temwa Chawinga, the 2024 NWSL MVP and Golden Boot winner and a 2025 Ballon d\u2019Or nominee, and the Brazilian National Team trio of Debinha, Lorena, and Bia Zaneratto. Strong U.S. National talents Michelle Cooper, Claire Hutton, Ally Sentnor, and Lo\u2019eau LaBonta give the Current a potent combination of experience and firepower.`))

      // Milan Ivanovic quote
      const q2 = `Milan Ivanovic, Assistant Coach, Kansas City Current: \u201COur team thrives on intensity, creativity, and competition, which fit perfectly with the 7v7 style of play. This tournament is an incredible opportunity for our players to test themselves against some of the world\u2019s best in a dynamic, fast-paced environment. We\u2019re proud to represent Kansas City and the NWSL on the international stage and to continue pushing the women\u2019s game forward. The growth of women\u2019s football is accelerating globally, and events like World Sevens Football help showcase the skill and excitement that define our sport. We can\u2019t wait to bring the KC Current energy to Fort Lauderdale.\u201D`
      c.push(p(q2, bolds(q2, "Milan Ivanovic, Assistant Coach, Kansas City Current:")))

      // San Diego Wave FC
      c.push(h4("San Diego Wave FC \u2014 San Diego, California"))
      c.push(p(`Wave FC has rapidly established itself atop US women\u2019s soccer, with community fan support and world-class talent. Led by Sporting Director and General Manager Camille Ashton, the Wave continue their pursuit of silverware and make their Sevens debut with high ambitions. The club\u2019s roster features several international stars, including Delphine Cascarino (forward), Kenza Dali (midfielder), and standout goalkeeper Kailen Sheridan, as well as dynamic talents like Adriana Leon and young U-18 forward Melanie Barcenas. Cascarino, in particular, was named to the NWSL Best XI earlier in the season and leads the Wave in goal contributions, while Dali is known for her playmaking and set-piece prowess.`))

      // Camille Ashton quote
      const q3 = `Camille Ashton, General Manager, San Diego Wave FC: \u201CI am honored for San Diego Wave FC to represent the National Women\u2019s Soccer League on this global stage. Our club\u2019s vision is rooted in excellence, and we embrace opportunities like World Sevens Football to push the game further and give our players another opportunity to shine. We are grateful to be invited, and we cannot wait to share this experience with our fans, challenge ourselves, and compete among some of the world\u2019s best.\u201D`
      c.push(p(q3, bolds(q3, "Camille Ashton, General Manager, San Diego Wave FC:")))

      // Tournament Details
      c.push(h4("Tournament Details"))
      c.push(p(`The World Sevens Football tournament will feature fast-paced 7v7 matches, a $5 million prize pool\u2014one of the largest in women\u2019s football\u2014and a broadcast partnership with DAZN. With Kansas City Current and San Diego Wave FC now joining the international lineup, fans can expect fierce competition and unforgettable moments.`))

      // Tickets
      const tix2 = `Tickets are now available, including premium sideline, party deck, pitchside, and VIP options. Each ticket includes access to the W7F Fan Fest, which will feature football activities, giveaways, and food and beverages for purchase. To purchase tickets, fans can visit www.worldsevensfootball.com.`
      c.push(p(tix2, [link(tix2, "www.worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      // About Kansas City Current
      c.push(h4("About Kansas City Current"))
      const kc = `Founded in December 2020, the Kansas City Current is led by the ownership group of Angie Long, Chris Long, Brittany Mahomes, and Patrick Mahomes. The team competes in the National Women\u2019s Soccer League (NWSL). The Kansas City Current plays its home matches at CPKC Stadium, the first stadium purpose-built for a professional women\u2019s sports team. Named \u201CThe Most Ambitious NWSL Club\u201D for two consecutive seasons by ESPN, the Current is proud of its many precedent-setting accomplishments. To receive updates on the Current visit kansascitycurrent.com.`
      c.push(p(kc, [link(kc, "kansascitycurrent.com", "https://kansascitycurrent.com")]))

      // About San Diego Wave FC
      c.push(h4("About San Diego Wave FC"))
      const sd = `San Diego Wave F\u00FAtbol Club was founded in 2021 and competes in the National Women\u2019s Soccer League (NWSL). The Wave quickly established itself as one of the world\u2019s premier clubs, making history by breaking the NWSL\u2019s single-game attendance record and reaching the playoffs in its inaugural season. The Club has continued to set new milestones, ranking #2 globally in women\u2019s soccer attendance in 2024. Dedicated to excellence on the field and meaningful impact off it, the Wave fosters strong connections within the San Diego community under the leadership of the Leichtman Levine Family. Wave FC plays its home matches at the state-of-the-art Snapdragon Stadium. For more information, visit sandiegowavefc.com.`
      c.push(p(sd, [link(sd, "sandiegowavefc.com", "https://sandiegowavefc.com")]))

      return c
    })(),
  },

  // #7 — November 12, 2025 — Rising Sevens Youth Tournament
  {
    uid: "w7f-rising-sevens-youth-tournament-fort-lauderdale",
    existingId: "aYqh-xEAACEA5meF",
    title: "World Sevens Football Brings \u201CRising Sevens\u201D Youth Tournament for U9-U12 Girls to Fort Lauderdale",
    date: "2025-11-12",
    excerpt: "Connecting local youth, global stars, and community impact through the World Sevens Football experience",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK (November 12, 2025): World Sevens Football (W7F) proudly introduces Rising Sevens, a youth version of the World Sevens Football experience designed to give the next generation of elite players a platform to shine. The youth tournament will take place on Saturday, December 6, and Sunday, December 7, 2025, at Dolphin Field on the campus of Nova Southeastern University (NSU) in Davie, Florida, the site of W7F\u2019s professional tournament.`
      c.push(p(p1, [bold(p1, "NEW YORK (November 12, 2025):")]))

      // Tobin Heath quote
      const q1 = `\u201CRising Sevens embodies what World Sevens Football is all about, which is creating opportunity, connection, and inspiration for the next generation,\u201D said Tobin Heath, USWNT Legend and W7F Player Advisory Council Member at World Sevens Football. \u201CBy bringing youth players into the heart of our professional tournaments, we\u2019re giving them a front-row seat to what\u2019s possible, and helping them imagine themselves as the future of the game.\u201D`
      c.push(p(q1, bolds(q1, "said Tobin Heath, USWNT Legend and W7F Player Advisory Council Member at World Sevens Football.")))

      // Rising Sevens description
      c.push(p(`The Rising Sevens initiative invites girls\u2019 teams in the U9 through U12 age groups to compete in an exciting weekend of 7v7 play that mirrors the fast-paced, high-energy style of W7F\u2019s global professional events. The tournament is open to all clubs, coaches, and teams, regardless of affiliation with FYSA or US Club Soccer, providing a welcoming and inclusive environment for players and programs across the region.`))

      // Match format
      c.push(p(`Teams will play mini matches (2 x 15 minutes) in a group-stage format, followed by semi-finals, third-place matches, and championship matches. Registration is $650 per team (including referee fees), with the registration deadline of Friday, November 21, 2025.`))

      // Jennifer Mackesy quote
      const q2 = `\u201CWe want to leverage our platform to shine a light on the great impact work happening in the communities we enter,\u201D said Jennifer Mackesy, Co-Founder of World Sevens Football. \u201CThe Community Champions initiative allows us to recognize and support local organizations that are breaking barriers for girls and women. It\u2019s about fueling opportunities both on and off the pitch.\u201D`
      c.push(p(q2, bolds(q2, "said Jennifer Mackesy, Co-Founder of World Sevens Football.")))

      // Participants info
      c.push(p(`All participants will receive an official W7F t-shirt and a complimentary ticket to one session of the professional W7F matches, offering players the chance to see some of the world\u2019s top footballers in action. Winners and finalists in each age group will receive Rising Sevens medals and trophies, with championship teams recognized on the field during the professional tournament. In the spirit of W7F\u2019s commitment to community impact, each winning team will also receive $500 to donate to one of W7F\u2019s local nonprofit Community Champions.`))

      // Rising Sevens link
      const rs = `For full Rising Sevens Youth Tournament details, including registration and official rules, visit worldsevensfootball.com/rising-sevens`
      c.push(p(rs, [link(rs, "worldsevensfootball.com/rising-sevens", "https://www.worldsevensfootball.com/rising-sevens")]))

      // Community Champions section
      c.push(h4("Community Impact Through W7F Community Champions"))
      c.push(p(`As part of its ongoing commitment to create meaningful change in every city it visits, W7F will also activate its Community Champions initiative during the Fort Lauderdale tournament. The program celebrates and uplifts local organizations that are expanding girls\u2019 access to football and advancing opportunities for women and girls more broadly.`))

      c.push(p(`Through Community Champions, W7F identifies, funds, and raises awareness of three local nonprofit organizations that are driving real impact in their communities. Each selected organization receives a $10,000 USD grant and multiple opportunities to leverage the W7F tournament platform to spotlight their work.`))

      c.push(p(`For the Fort Lauderdale tournament, W7F invites registered 501(c)(3) nonprofit organizations based in Broward County and Miami-Dade County to apply by November 16th to become a W7F Community Champion. Selected organizations will be honored throughout the tournament weekend and integrated into W7F\u2019s on-site programming, alongside the youth and professional competitions.`))

      c.push(p(`Throughout the weekend, Rising Sevens players and W7F Community Champions will have opportunities to meet members of W7F\u2019s Player Advisory Council and current W7F professional players, connecting grassroots talent directly with the game\u2019s global role models.`))

      return c
    })(),
  },

  // #8 — November 13, 2025 — Full Lineup / Club Nacional
  {
    uid: "w7f-full-lineup-club-nacional-uruguay",
    existingId: "aYqh_BEAACQA5meJ",
    title: "World Sevens Football Closes Out Roster of Eight Teams Competing at Its First North American Tournament and Welcomes Club Nacional de Football Femenino of Uruguay",
    date: "2025-11-13",
    excerpt: "Uruguay\u2019s Powerhouse Women\u2019s Side Joins International Roster of Top Clubs Competing for $5,000,000 USD Prize Pool",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK CITY (November 13, 2025): World Sevens Football (W7F) today announced that Club Nacional de Football Femenino, one of South America\u2019s most storied clubs, has completed the lineup of eight women\u2019s teams playing in the first-ever W7F North American tournament taking place December 5-7, 2025, at Beyond Bancard Field in Fort Lauderdale, Florida.`
      c.push(p(p1, [bold(p1, "NEW YORK CITY (November 13, 2025):")]))

      // World-class field
      c.push(p(`The Uruguayan team joins a world-class field featuring the USA\u2019s Kansas City Current, San Diego Wave FC, Canada\u2019s AFC Toronto, Mexico\u2019s Club Am\u00E9rica and Tigres Femenil, Brazil\u2019s Clube de Regatas do Flamengo, and Colombia\u2019s Deportivo Cali Femenino. With a majority of the clubs currently leading or at the top levels of their respective leagues, the tournament will unite some of the most successful and exciting women\u2019s football clubs from across the Americas in a fast-paced 7v7 format.`))

      // Anita Asante quote
      const q1 = `\u201CBringing World Sevens Football to North America for this second edition is incredibly exciting,\u201D said Anita Asante, Football Legend and Member of the World Sevens Football Player Advisory Council. \u201CWhat stands out most is the chance to welcome new teams and see how each club brings its own energy, approach, and tactical style to the pitch. I can\u2019t wait to watch how the strategy and style of play evolve in Fort Lauderdale and to see the incredible talent from across the Americas put on another unforgettable show for the fans.\u201D`
      c.push(p(q1, bolds(q1, "said Anita Asante, Football Legend and Member of the World Sevens Football Player Advisory Council.")))

      // Sarah Cummins quote
      const q2 = `\u201CWe\u2019re thrilled to welcome Club Nacional de Football Femenino as the final club to join our North American debut lineup,\u201D said Sarah Cummins, CEO of World Sevens Football. \u201CTheir legacy, success, and commitment to advancing women\u2019s football make the club a perfect fit for the spirit of World Sevens Football. Our tournament celebrates the global growth of the women\u2019s game, and Club Nacional de Football\u2019s participation underscores the strength, depth, and talent growth across South America. Fans in Fort Lauderdale are in for something truly special.\u201D`
      c.push(p(q2, bolds(q2, "said Sarah Cummins, CEO of World Sevens Football.")))

      // About Club Nacional
      c.push(h4("About Club Nacional de Football Feminino \u2014 Montevideo, Uruguay"))
      c.push(p(`Club Nacional de Football Femenino is one of South America\u2019s most historic and successful women\u2019s football clubs. Competing in Uruguay\u2019s Primera Divisi\u00F3n Femenina, the team has been a dominant force since the league\u2019s inception in 1997, when they captured the inaugural national championship. With multiple league titles and strong showings in the CONMEBOL Libertadores Femenina, Nacional continues to set the benchmark for excellence in Uruguayan women\u2019s football.`))

      // Tatiana Villaverde quote
      const q3 = `\u201CIt is an honor for Club Nacional de Football to represent Uruguay and South America in the World Sevens Football tournament,\u201D said Tatiana Villaverde, board member and head of the women\u2019s team from Club Nacional de Football Femenino. \u201CThis is more than a competition; it\u2019s an opportunity to showcase our talent, culture, and passion for the game on a global stage. We are proud to join such an extraordinary lineup of clubs and look forward to hoisting the trophy in celebration at the end of the weekend.\u201D`
      c.push(p(q3, bolds(q3, "said Tatiana Villaverde, board member and head of the women\u2019s team from Club Nacional de Football Femenino.")))

      // Youth tournament
      c.push(p(`As W7F continues to expand its mission of creating meaningful pathways for players worldwide, the organization will also stage a youth version of the World Sevens Football experience, open to girls\u2019 teams in the U9 through U12 age groups. Designed to provide the next generation of players with a platform to shine, the event will be held on the fields adjacent to the W7F tournament.`))

      // Tournament
      c.push(h4("Tournament"))
      c.push(p(`The Fort Lauderdale event marks World Sevens Football\u2019s North American debut following its successful global launch in Estoril, Portugal, earlier this year. Eight elite clubs from across the Americas will compete for a $5 million prize pool, one of the largest in women\u2019s football. The tournament will be broadcast globally through DAZN, ensuring fans everywhere can experience the action.`))

      // Tickets
      const tix = `Tickets are now available, including premium sideline, party deck, pitchside, and VIP options. Each ticket includes access to the W7F Fan Fest, featuring football activities, giveaways, and food and beverages available for purchase. To purchase tickets, fans can visit www.worldsevensfootball.com.`
      c.push(p(tix, [link(tix, "www.worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      return c
    })(),
  },

  // #9 — November 18, 2025 — TNT Sports Broadcast Announcement
  {
    uid: "w7f-tnt-sports-broadcast-announcement",
    existingId: "aYqh_hEAACIA5meQ",
    title: "TNT Sports to Present First-Ever World Sevens Football 7v7 Soccer Tournament in North America, Dec. 5-7, on TNT, truTV & HBO Max",
    date: "2025-11-18",
    excerpt: "Schedule Unveiled for Fast-Paced Women\u2019s Event With Top Stars and Powerhouse Clubs from Across the Americas Competing for Landmark $5 Million Prize Pool",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK (November 18, 2025): TNT Sports will present the first-ever World Sevens Football 7v7 Soccer Tournament in North America, Friday, Dec. 5 through Sunday, Dec. 7, live on TNT, truTV, and HBO Max.`
      c.push(p(p1, bolds(p1, "NEW YORK (November 18, 2025): TNT Sports", "Friday, Dec. 5", "Sunday, Dec. 7", "TNT,", "truTV,", "HBO Max")))

      // Description
      c.push(p(`The fast-paced World Sevens Football (W7F) series has redefined women\u2019s soccer with elite talent from eight of the best clubs in the world, an immersive fan-first experience, and a groundbreaking $5 million prize pool, the largest in the sport, designed to fuel intense, high-stakes competition.`))

      // Clubs paragraph with bold team names
      const p3 = `Building on its successful May 2025 debut in Portugal, W7F is again poised to deliver a high-energy three-day tournament. The powerhouse clubs from across the Americas scheduled to compete in Ft. Lauderdale are USA\u2019s Kansas City Current and San Diego Wave FC from the NWSL, Mexico\u2019s Club Am\u00E9rica and Tigres UANL, Canada\u2019s AFC Toronto, Brazil\u2019s Clube de Regatas do Flamengo, Colombia\u2019s Deportivo Cali, and Uruguay\u2019s Club Nacional de Football Femenino.`
      c.push(p(p3, bolds(p3, "Kansas City Current", "San Diego Wave FC", "Club Am\u00E9rica", "Tigres UANL", "AFC Toronto", "Clube de Regatas do Flamengo", "Deportivo Cali", "Club Nacional de Football Femenino")))

      // Player welfare
      c.push(p(`W7F is committed to advancing the women\u2019s game, providing a dynamic platform for players to showcase their skills, build their brands, and unlock new economic opportunities. The exhilarating format is built around player welfare, with rolling substitutions and short matches, that encourage and reward the artistry, creativity, and risk-taking on the ball that made players fall in love with the world\u2019s game as kids.`))

      // TNT Sports coverage
      c.push(p(`TNT Sports will produce domestic, English-language coverage for every match and on-site studio shows throughout the three-day tournament. TNT Sports will enhance the fan experience with English-language studio programming plus additional ancillary programming throughout the tournament. Furthermore, TNT Sports\u2019 Bleacher Report, House of Highlights, and B/R Football will produce and share content across their social platforms.`))

      c.push(p(`Additional programming and TNT Sports production details for W7F will be announced leading up to the event.`))

      // Match Schedule
      c.push(h4("Match Schedule"))
      c.push(p("(All Times Eastern)"))

      c.push(h4("Friday, Dec. 5 \u2013 Match Day 1"))
      c.push(p("Session 1 Matches:"))
      c.push(p("Kansas City Current vs. Flamengo \u2013 5 p.m. (TNT & HBO MAX)"))
      c.push(p("Deportivo Cali vs. San Diego Wave FC \u2013 6 p.m. (TNT & HBO MAX)"))
      c.push(p("Club Tigres vs. AFC Toronto - 7 p.m. (truTV & HBO MAX)"))
      c.push(p("Club Am\u00E9rica vs. Nacional \u2013 8 p.m. (truTV & HBO MAX)"))

      c.push(h4("Saturday, Dec. 6 \u2013 Match Day 2"))
      c.push(p("Session 2 Matches:"))
      c.push(p("Flamengo vs. AFC Toronto \u2013 11:30 a.m. (TNT & HBO MAX)"))
      c.push(p("Kansas City Current v Club Tigres \u2013 12:30 p.m. (TNT & HBO MAX)"))
      c.push(p("Nacional vs. Deportivo Cali \u2013 1:30 p.m. (TNT & HBO MAX)"))
      c.push(p("San Diego Wave FC vs. Club Am\u00E9rica \u2013 2:30 p.m. (TNT & HBO MAX)"))
      c.push(p("Session 3 Matches:"))
      c.push(p("Kansas City Current vs. AFC Toronto \u2013 4:30 p.m. (truTV & HBO MAX)"))
      c.push(p("Flamengo vs. Club Tigres \u2013 5:30 p.m. (truTV & HBO MAX)"))
      c.push(p("San Diego Wave FC vs. Nacional \u2013 6:30 p.m. (truTV & HBO MAX)"))
      c.push(p("Deportivo Cali vs. Club Am\u00E9rica - 7:30 p.m. (truTV & HBO MAX)"))

      c.push(h4("Sunday, Dec. \u2013 Match Day 3"))
      c.push(p("Session 4 Matches:"))
      c.push(p("Semi-Finals \u2013 11:30 a.m. (TNT & HBO MAX)"))
      c.push(p("Third Place Match \u2013 3 p.m. (truTV & HBO MAX)"))
      c.push(p("Finals \u2013 4:30 p.m. (TNT & HBO MAX)"))

      // About TNT Sports
      c.push(h4("About TNT Sports"))
      c.push(p(`TNT Sports is a global leader in the delivery of premium sports content. The TNT Sports U.S. portfolio includes expansive, multi-platform partnerships with Major League Baseball, the NCAA Division I Men\u2019s Basketball Championship, National Hockey League, United States Soccer Federation, College Football Playoff games, BIG EAST, Big 12, NASCAR and Roland-Garros. TNT Sports also produces the iconic Inside the NBA studio show. Owned and operated platforms are highlighted by Bleacher Report, the #1 digital destination for young sports fans, along with House of Highlights, B/R W, Golf Digest, and a full suite of digital and social portfolio brands. Additionally, TNT Sports co-manages NCAA.com and NCAA March Madness Live. TNT Sports in Europe and the Republic of Ireland includes partnerships with the Premier League, Emirates FA Cup, UEFA, Premiership Rugby, MotoGP, British and World Superbikes, UFC, Australian Open and Roland-Garros, Grand Tour Cycling, the UCI Mountain Bike World Series, every major winter sports World Championship and World Cup event, and the Olympic Games 2026-2032.`))

      return c
    })(),
  },

  // #10 — December 3, 2025 — DAZN Global Broadcast Announcement
  {
    uid: "w7f-dazn-global-broadcast-announcement",
    existingId: "aYqiABEAACQA5meV",
    title: "DAZN to Broadcast World Sevens Football U.S. Tournament to Fans Globally for Free",
    date: "2025-12-03",
    excerpt: "DAZN is the exclusive global production and broadcast partner for the second World Sevens Football Event. All matches will be available live and free globally on the DAZN platform and on the DAZN Women\u2019s Football YouTube channel in eligible markets.",
    content: (() => {
      const c: any[] = []

      const b1 = "DAZN is the exclusive global production and broadcast partner for the second World Sevens Football Event."
      c.push(p(b1, allItalic(b1)))
      const b2 = "All matches will be available live and free globally on the DAZN platform and on the DAZN Women\u2019s Football YouTube channel in eligible markets."
      c.push(p(b2, allItalic(b2)))
      const b3 = "The tournament takes place in Florida, U.S., December 5\u20137, featuring 16 matches in an innovative 7v7 format."
      c.push(p(b3, allItalic(b3)))

      c.push(p("DAZN, the world\u2019s leading sports entertainment platform, is the exclusive global production and broadcast partner of World Sevens Football for their second-ever football tournament. The groundbreaking seven-a-side series that is revolutionising professional women\u2019s football, will hold the tournament in Fort Lauderdale, Florida, U.S. from December 5-7."))

      c.push(p("DAZN is the exclusive global broadcaster for the event, as part of its ongoing multi-event partnership with World Sevens Football. DAZN is committed to increasing accessibility and visibility for emerging formats of the sport, and will make every match available to watch live and free on the DAZN platform globally, as well as on the DAZN Women\u2019s Football YouTube channel in all eligible markets."))

      c.push(p("DAZN will serve as host broadcaster, providing full production of all 16 matches. Leveraging its industry-leading capabilities in live sports production, multi-platform delivery and digital distribution, DAZN will help elevate the viewing experience for this fast-growing global football format."))

      c.push(p("DAZN\u2019s coverage will feature an exceptional team of on-screen talent:"))

      const t1 = "Current Women\u2019s Football Broadcaster of the Year Seema Jaswal will present the live coverage alongside special guest, former Scottish Captain Jen Beattie MBE."
      c.push(p(t1, bolds(t1, "Seema Jaswal", "Jen Beattie MBE")))
      const t2 = "Expert analysis will be given by former US Internationals and NWSL veterans Jordan Angeli, Kacey White and Darian Jenkins, and former Columbian International Chelsea Cabarcas, while Jenny Chiu will act as DAZN\u2019s pitchside reporter."
      c.push(p(t2, bolds(t2, "Jordan Angeli", "Kacey White", "Darian Jenkins", "Chelsea Cabarcas", "Jenny Chiu")))
      const t3 = "Jacqui Oatley MBE and Jessica Charman will serve as lead commentators, with Moises Linares set to provide insights for the Spanish-language feed."
      c.push(p(t3, bolds(t3, "Jacqui Oatley MBE", "Jessica Charman", "Moises Linares")))
      c.push(p("Members of the World Sevens Football Player Advisory Council will also share their views on-screen, ensuring fans receive diverse and authoritative perspectives throughout the event."))

      const q1 = "Shay Segev, DAZN Group CEO, said: \u201CDAZN\u2019s global scale and digital-first distribution strategy make us uniquely positioned to deliver this World Sevens Football tournament to fans around the world. With our platform available in more than 200 markets and our ability to offer this tournament free-to-view, DAZN is playing a central role in bringing this innovative format to the widest possible audience. As the exclusive global production and broadcast partner of World Sevens Football, our international reach is helping to accelerate the growth of women\u2019s football worldwide.\u201D"
      c.push(p(q1, [bold(q1, "Shay Segev, DAZN Group CEO, said:")]))

      const q2 = "Sarah Cummins, CEO of World Sevens Football, said: \u201CWe\u2019re thrilled to continue our partnership with DAZN as the global production and broadcast partner for World Sevens Football. Their commitment to accessibility and innovation ensures fans can experience this dynamic seven-a-side format, live and free, around the world. Together, we will showcase the skills and intensity of the women\u2019s game, creating a platform that inspires players and fans globally.\u201D"
      c.push(p(q2, [bold(q2, "Sarah Cummins, CEO of World Sevens Football, said:")]))

      c.push(p("TNT has been confirmed as the co-exclusive sublicensee partner in the U.S., along with Univision for Spanish-language in the U.S. and Mexico, and ESPN throughout LATAM, Central America, and the Caribbean (excluding Mexico)."))

      // About DAZN
      c.push(h4("About DAZN"))
      c.push(p("DAZN, the world\u2019s leading sports entertainment platform, streams more than 110,000 live events annually and is available in over 200 markets worldwide. DAZN is the home of European football, women\u2019s football, boxing and MMA, as well as the NFL Game Pass and NHL.TV internationally. The platform features the biggest sports and leagues from around the world \u2013 Bundesliga, Serie A, LALIGA, Ligue 1, Formula 1, NBA, Moto GP, and many more."))
      c.push(p("DAZN is transforming the way people enjoy sport. With a single, frictionless platform, sports fans can watch, play, buy, and connect. Live and on-demand sports content, anywhere, in any language, on any device \u2013 only on DAZN. The company partners with leading pay-TV operators, ISPs and Telcos worldwide to maximise sports exposure to a broad audience."))
      const aboutP3 = "DAZN is a global, privately-owned company, founded in 2016, with more than 4,000 employees. For more information on DAZN, visit www.dazngroup.com"
      c.push(p(aboutP3, [link(aboutP3, "www.dazngroup.com", "https://www.dazngroup.com")]))

      return c
    })(),
  },

  // #11 — December 4, 2025 — Partners Announcement
  {
    uid: "w7f-partners-announcement-fort-lauderdale",
    existingId: "aYqjyhEAACQA5mqj",
    title: "World Sevens Football Announces Partnerships with Invisalign, Ally, Emburse, mainelove, and StubHub for North American Tournament Debut in Fort Lauderdale",
    date: "2025-12-04",
    excerpt: "Global Stars and High-Octane 7v7 Action Set for December 5-7, 2025",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `NEW YORK (December 4, 2025) \u2013 World Sevens Football (W7F), the trailblazing 7v7 women\u2019s football series, is proud to announce five partners: Invisalign\u00AE, Ally Financial, Emburse, mainelove, and StubHub, ahead of its much-anticipated tournament this December in Fort Lauderdale, Florida. These partnerships mark a major step forward as W7F continues its global mission to elevate the women\u2019s game, deliver unrivaled fan and athlete experiences, and build the next generation of football stars.`
      c.push(p(p1, [bold(p1, "NEW YORK (December 4, 2025)")]))

      // Invisalign
      c.push(h4("Invisalign"))
      c.push(p(`The Invisalign\u00AE brand once again joins W7F as a Founding Partner and Official Global Clear Aligner Partner following a successful partnership at the inaugural tournament in Portugal earlier this year. Invisalign will continue to power the \u201CInvisalign Confidence Content Series\u201D through a docu-style campaign, highlighting player journeys, their \u201Cwhy\u201D for choosing Invisalign aligners, and moments of self-confidence on and off the pitch.`))
      c.push(p(`Tournament fans will enjoy interactive activations, including a Confidence Mirror at the Welcome Party for all players, coaches, and staff, as well as a Confidence Photo Booth at the Official Wrap Party. Invisalign branding will be featured across tournament signage, VIP cabanas, and all major broadcast graphics, with Invisalign presenting both the \u201CConfidence Moment of the Match\u201D and the \u201CConfidence Player of the Tournament\u201D awards.`))

      // Ally Financial
      c.push(h4("Ally Financial"))
      c.push(p(`Home to the nation\u2019s largest all-digital bank, Ally\u2019s commitment to helping customers unlock their financial potential has inspired its game-changing investments in the growth of women\u2019s sports. Ally now joins as the Official Banking Partner of W7F\u2019s tournament in Fort Lauderdale, where fans will experience the brand in several different ways, including ownership of the \u201CMinted Carpet\u201D where players will walk for \u201Cfit checks\u201D that will live across social channels, stadium signage, and LED around the venue and Party Deck, and exclusive fan giveaways.`))

      // Emburse
      c.push(h4("Emburse"))
      c.push(p(`Emburse joins World Sevens Football as the Official Travel and Expense Technology Platform Partner, empowering organizations with Emburse Expense Intelligence to make smarter spend decisions across corporate travel, reimbursements, accounts payable, and payments. Fans and players will see Emburse branding across LED ribbon boards, Party Deck signage, and broadcast-visible assets. The company will also partner on the Welcome Party and host VIP guests in branded cabanas. Beyond the venue, Emburse will activate through collaborative posts on LinkedIn, including custom content and evergreen video storytelling featuring executives and leadership. With exclusive merchandise packs, signed kits, and direct engagement with participating clubs, Emburse demonstrates its commitment to innovation, efficiency, and progress \u2013 helping organizations intelligently orchestrate spend while championing the growth and visibility of women\u2019s football.`))

      // mainelove
      c.push(h4("mainelove"))
      c.push(p(`Emerging canned water company mainelove joins World Sevens Football as the Official Hydration Partner, bringing a bold, interactive presence to the Fort Lauderdale tournament. Fans will engage with the brand through its \u201Cmy mainelove is\u2026\u201D wall activation featured across both the Rising Sevens Youth Tournament and the Fan Zone, with content captured for W7F social platforms. Furthermore, mainelove will provide hydration for athletes, referees, media, and youth participants, reinforcing the brand\u2019s commitment to fueling athletes and elevating the fan experience.`))

      // StubHub
      c.push(h4("StubHub"))
      c.push(p("StubHub is the Official Direct Issuance Partner for the W7F Fort Lauderdale event, allowing W7F to directly list select primary ticket inventory (including General Admission, Party Deck, and On-Pitch seats, as well as VIP and 3-day passes) on the StubHub platform. W7F tickets will be available in the U.S. and Canada via StubHub, as well as internationally via viagogo."))

      // Aly Wagner quote
      const q1 = `\u201CAs a former player and now working across the business side of the game, I know just how critical it is for brands to understand the value in women\u2019s football,\u201D said Aly Wagner, former USWNT legend and Chief of Strategy and Head of Sponsorship at W7F. \u201CWhat\u2019s happening at World Sevens Football is more than a series; it\u2019s a movement powered by innovation, community, and a belief that the women\u2019s game deserves the world\u2019s main stage. The brands that are stepping up with us, including Invisalign, Ally, Emburse, mainelove, and StubHub, are a testament to that vision. Their investment is more than sponsorship; it is a reflection of bold, forward-thinking leadership, recognizing that women\u2019s football isn\u2019t just ready for the spotlight; it is the spotlight.\u201D`
      c.push(p(q1, bolds(q1, "said Aly Wagner, former USWNT legend and Chief of Strategy and Head of Sponsorship at W7F.")))

      // Tournament summary
      c.push(p(`The Grand Slam Women\u2019s 7v7 by World Sevens Football will take place December 5-7, 2025, at Beyond Bancard Field in Fort Lauderdale, Florida, featuring rising stars, and one of the largest prize pools in women\u2019s football, top global clubs, and top clubs, including the USA\u2019s Kansas City Current and San Diego Wave FC, Canada\u2019s AFC Toronto, Mexico\u2019s Club Am\u00E9rica and Tigres Femenil, Brazil\u2019s Clube de Regatas do Flamengo, Colombia\u2019s Deportivo Cali Femenino, and Uruguay\u2019s Club Nacional de Football Femenino.`))

      const info = `For more information on World Sevens Football and the upcoming tournament, visit worldsevensfootball.com or follow @WorldSevensFootball on all platforms.`
      c.push(p(info, [link(info, "worldsevensfootball.com", "https://www.worldsevensfootball.com")]))

      return c
    })(),
  },

  // #12 — December 5, 2025 — Day 1 Wrap
  {
    uid: "w7f-day-1-wrap-21-goals-fort-lauderdale",
    existingId: "aYqjyxEAACIA5mqp",
    title: "World Sevens Football Opens with Thrilling First Day and 21 Goals in Fort Lauderdale",
    date: "2025-12-05",
    excerpt: "Four exciting matches delivered drama, skill, and a standout Tigres hat trick as the tournament roars to life",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `(FORT LAUDERDALE, FLORIDA \u2014 December 5, 2025): The World Sevens Football tournament kicked off its highly anticipated second edition with a spectacular first day full of excitement, skill, and plenty of goals. Across four electrifying matches, 21 goals were scored, and every team found the back of the net, setting a thrilling tone for the weekend ahead.`
      c.push(p(p1, bolds(p1, "(FORT LAUDERDALE, FLORIDA \u2014 December 5, 2025): The World Sevens Football tournament kicked off", "Across four electrifying matches, 21 goals were scored, and every team found the back of the net")))

      // Results
      const p2 = `Flamengo, Club Am\u00E9rica, Tigres, and San Diego Wave all claimed victories, while Kansas City Current, Deportivo Cali, AFC Toronto, and Club Nacional fought valiantly but fell short in tightly contested battles. One of the standout performances came from Mar\u00EDa S\u00E1nchez, who scored a brilliant hat trick to lead Tigres to a 3\u20132 victory over AFC Toronto in a match that showcased the fast-paced, skillful nature of the 7v7 format.`
      c.push(p(p2, bolds(p2, "Flamengo, Club Am\u00E9rica, Tigres, and San Diego Wave all claimed victories", "Mar\u00EDa S\u00E1nchez, who scored a brilliant hat trick")))

      // Jonas Eidevall quote
      const q1 = `San Diego Wave coach Jonas Eidevall praised the unique challenge and energy of the tournament, saying, \u201CI think the players feel a little bit different. Some love it, and for some, it\u2019s a little bit harder for them, but you can see the smiles on their faces. It brings out a different version of yourself.\u201D`
      c.push(p(q1, bolds(q1, "San Diego Wave coach Jonas Eidevall")))

      // María Sánchez quote
      const q2 = `Meanwhile, Tigres star Mar\u00EDa S\u00E1nchez reflected on the surreal experience, \u201CThis has been amazing. I don\u2019t think I could have written it out any better than how it is going. Two weeks ago, we were winning a championship, and now we\u2019re here enjoying this. It has been surreal.\u201D`
      c.push(p(q2, bolds(q2, "Meanwhile, Tigres star Mar\u00EDa S\u00E1nchez")))

      // Closing
      c.push(p("With a perfect blend of flair, resilience, and competitive spirit on display, the first day of W7F Fort Lauderdale set the stage for what promises to be an unforgettable tournament. Fans both in the stands and around the world can expect more edge-of-the-seat action as the teams battle for glory and a share of the $5 million prize pool."))

      return c
    })(),
  },

  // #13 — December 6, 2025 — Day 2 Wrap
  {
    uid: "w7f-day-2-wrap-san-diego-wave-semi-final",
    existingId: "aYqjzREAACEA5mqu",
    title: "San Diego Wave FC Book Spot in Semi Final as W7F Heads into Final Day",
    date: "2025-12-06",
    excerpt: "San Diego Wave FC top Group 2, undefeated, and advance to the Semi Finals against Clube de Regatas do Flamengo after a dramatic Day 2 in Fort Lauderdale",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `FORT LAUDERDALE (December 6, 2025) \u2013 Day 2 of the first-ever World Sevens Football tournament in Florida delivered another electrifying showcase of elite women\u2019s football, with eight high-tempo matches, 26 goals scored, and this tournament\u2019s first three sudden-death penalty shootouts. Fans at Beyond Bancard Field were treated to constant drama as the group stage reached its thrilling conclusion.`
      c.push(p(p1, bolds(p1, "FORT LAUDERDALE (December 6, 2025) \u2013 Day 2 of the first-ever World Sevens Football tournament in Florida", "26 goals scored")))

      // San Diego headline
      const p2 = `San Diego Wave FC emerged as the clear headline of Group 2, finishing as the only undefeated team left in the tournament. A commanding 3-1 win over Club Nacional de Football Femenino secured top spot and set up a blockbuster semi-final showdown against Clube de Regatas do Flamengo on Day 3.`
      c.push(p(p2, bolds(p2, "San Diego Wave FC emerged as the clear headline of Group 2", "only undefeated team left in the tournament")))

      // KC vs Toronto
      c.push(p("One of the most intense battles of the day came in Group 1, where Kansas City Current FC and AFC Toronto delivered a five-goal thriller. Despite the showpiece 3-2 Toronto victory, both teams were ultimately eliminated following other group results. The match, however, stood out as one of the most dramatic of the tournament so far."))

      // Mexican giants
      c.push(p(`On the opposite side of the bracket, the second of Sunday\u2019s semi-final features a matchup worthy of a final: Tigres UANL vs. Club Am\u00E9rica. The two Mexican giants advanced with authority - Club Tigres topping Group 1 with dominant performances, and Am\u00E9rica securing progression after a crucial win over Deportivo Cali. The clash will bring classic Mexican playing style to the pitch for one of the weekend\u2019s most anticipated encounters.`))

      // Day 3 preview
      c.push(p(`With the stage now set, W7F\u2019s final day promises plenty of action. Semi Final 1 kicks off at 11:30 AM, followed by Semi Final 2 at 1:00 PM, into the Third Place match (3:00 PM), and the Final at 4:30 PM. The stakes have never been higher as the remaining contenders fight for the W7F crown and $5 million prize pool.`))

      return c
    })(),
  },

  // #14 — December 7, 2025 — Day 3 Wrap — San Diego Wave Champions
  {
    uid: "w7f-san-diego-wave-crowned-champions",
    existingId: "aYqjzhEAACEA5mqy",
    title: "San Diego Wave FC Crowned Champions at World Sevens Football\u2019s First-Ever Tournament in North America",
    date: "2025-12-07",
    excerpt: "Three days of world-class action, vibrant crowds, and breakthrough moments mark W7F\u2019s triumphant launch in North America",
    content: (() => {
      const c: Array<{ type: string; text: string; spans: Span[] }> = []

      // Dateline
      const p1 = `(FORT LAUDERDALE, 7 December 2025): San Diego Wave FC were crowned champions of the second-ever World Sevens Football tournament, completing a perfect five-match run as W7F made its North American debut and taking home the top prize of USD $2,000,000. Across 16 matches, the event delivered 60 goals and a competitive showcase of the women\u2019s game, culminating in a 3\u20130 victory for San Diego Wave FC over Tigres in the final at Beyond Bancard Field.`
      c.push(p(p1, bolds(p1, "(FORT LAUDERDALE, 7 December 2025): San Diego Wave FC were crowned champions of the second-ever World Sevens Football tournament")))

      // Semi-finalists
      const p2 = `The weekend produced tight battles and knockout-stage drama, with Flamengo, Club Am\u00E9rica, Tigres, and San Diego Wave FC emerging as semi-finalists. San Diego advanced after a strong second-half performance against Flamengo, while Tigres edged out Club Am\u00E9rica to reach the final.`
      c.push(p(p2, bolds(p2, "Flamengo, Club Am\u00E9rica, Tigres, and San Diego Wave FC")))

      // Championship match & awards
      const p3 = `In the championship match, San Diego\u2019s efficiency and execution proved the difference. Goals from Makenzy Robbe and an Adriana Leon brace secured the title. The tournament\u2019s top individual honors also reflected the finalists\u2019 impact: Tigres forward Mar\u00EDa S\u00E1nchez earned the Golden Boot with six goals, becoming W7F\u2019s all-time leading scorer, and was named Player of the Tournament, while San Diego Wave FC goalkeeper DiDi Hara\u010Di\u0107 claimed the Golden Glove for her standout performances between the sticks.`
      c.push(p(p3, bolds(p3, "Mar\u00EDa S\u00E1nchez earned the Golden Boot", "six goals", "and was named Player of the Tournament", "San Diego Wave FC goalkeeper DiDi Hara\u010Di\u0107 claimed the Golden Glove")))

      // DiDi Haračić quote
      const q1 = `DiDi Hara\u010Di\u0107, San Diego Wave FC Goalkeeper, said: \u201CThis was a great experience, and I would love to be back again. We got the bag. We honestly just enjoyed the moment, we were all present. It was amazing to see all the diversity, all the cultures, and how everyone else wants to play. It\u2019s just a beautiful moment.\u201D`
      c.push(p(q1, bolds(q1, "DiDi Hara\u010Di\u0107, San Diego Wave FC Goalkeeper, said:")))

      // Mackenzy Robbe quote
      const q2 = `Mackenzy Robbe, San Diego Wave forward, said: \u201CIt was amazing, and so fun. Playing 7v7 is every player\u2019s dream. It was just a very exciting weekend. The pressure is off, a little bit, and you get to have more fun, a little more creativity. I loved this weekend.\u201D`
      c.push(p(q2, bolds(q2, "Mackenzy Robbe, San Diego Wave forward, said:")))

      // Jen Mackesy quote
      const q3 = `Jen Mackesy, Co-Founder, World Sevens Football, said: \u201CCongratulations to San Diego Wave FC, the second club in history to lift the World Sevens Football trophy. Their triumph at our first-ever North American tournament secured their spot in W7F history. From the opening whistle to the final celebration, they displayed skill, spirit, and joy that perfectly reflect what this competition is all about.\u201D`
      c.push(p(q3, bolds(q3, "Jen Mackesy, Co-Founder, World Sevens Football, said:")))

      // Sarah Cummins quote
      const q4 = `Sarah Cummins, CEO, World Sevens Football, said: \u201CThe second-ever World Sevens Football tournament, and the first-ever in North America, has been a resounding success, bringing together clubs from across the Americas and beyond to deliver three days of unforgettable football. From the vibrant atmosphere to the global broadcast audience, the energy, and engagement by our incredible partners, proved that W7F is more than a tournament, it\u2019s a movement. Every team and player contributed to this milestone, and together they\u2019ve set a new benchmark for what women\u2019s football can achieve.\u201D`
      c.push(p(q4, bolds(q4, "Sarah Cummins, CEO, World Sevens Football, said:")))

      // Rising Sevens
      c.push(p(`The Rising Sevens youth initiative was held alongside the professional tournament in Fort Lauderdale, giving U9\u2013U12 girls\u2019 teams the opportunity to compete in W7F\u2019s signature 7v7 format. Hosted at Nova Southeastern University\u2019s Dolphin Field, the program brought young players closer to the professional stage, with participants receiving official W7F gear, tickets to matches, and championship recognition in front of the main tournament crowd.`))

      // Community Champions
      c.push(p(`W7F also activated its Community Champions program during the tournament, celebrating three local nonprofit organizations from Broward and Miami-Dade counties that are advancing opportunities for girls and women in sport. Each organization was awarded a $10,000 grant and featured throughout the weekend\u2019s programming, ensuring that the tournament\u2019s impact extended beyond the pitch and into the communities it serves.`))

      // Closing
      c.push(p(`With San Diego Wave now etched on the trophy alongside Bayern M\u00FCnchen, who defeated Manchester United to claim the inaugural title in May in Estoril, Portugal, the stage is set for even greater moments to come with locations and timing to be announced soon.`))

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
