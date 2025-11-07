import { notFound } from "next/navigation"
import { getTournamentByUid } from "@/cms/queries/tournaments"
import { getF3Standings } from "@/app/api/opta/feeds"
import { Section, Container } from "@/components/website-base/padding-containers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FAQItem } from "@/types/basic"
import { P } from "@/components/website-base/typography"
import { getSocialBlogsByCategory } from "@/cms/queries/blog";
import type { BlogDocument } from "../../../../../../prismicio-types";
import type { BlogMetadata } from "@/components/website-base/posts/post";
import { SectionHeading, SectionHeadingHeading, SectionHeadingSubtitle } from "@/components/sections/section-heading"
import { PostGrid } from "@/components/website-base/posts/post-grid"


type Props = {
  params: Promise<{ slug: string }>
}

function mapBlogDocumentToMetadata(blog: BlogDocument): BlogMetadata {
  return {
    slug: blog.uid ?? "",
    title: blog.data.title ?? "Untitled",
    excerpt: blog.data.excerpt ?? null,
    image: blog.data.image?.url ?? undefined,
    category: blog.data.category ?? null,
    author: blog.data.author ?? null,
    date: blog.data.date ?? null,
  }
}

const faqData: FAQItem[] = [
  {
    id: "item-1",
    question: "What is the format of a W7F tournament?",
    answer: (
      <>
        <P>The fast-paced seven-a-side format includes a two-day group-stage round-robin, featuring two groups of four teams. On day three of the tournament, the top two clubs per group will advance to the knockout stage. There will be sixteen matches per tournament, including a third-place match, and of course, a much-anticipated championship match.</P>
        <P>Each club will play between three and five games in total, depending on the progress of that club through the tournament.</P>
      </>
    )
  },
  {
    id: "item-2",
    question: "Who participates in W7F tournaments?",
    answer: (
      <>
        <P>Established professional clubs from the best leagues across the globe have committed to participating in W7F’s seven-a-side tournaments. From that club pool, teams will be chosen to compete.</P>
        <P>For the May 2025 tournament in Estoril, participating clubs were: Ajax, Bayern, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma and FC Rosengard.</P>
      </>
    )
  },
  {
    id: "item-3",
    question: "How many clubs will take part in each W7F tournament?",
    answer: (
      <P>The first and second tournament feature eight sides from the club pool. As the series grows, we expect to expand the number of teams competing in each event.</P>
    )
  }
];

export default async function TournamentPage({ params }: Props) {
  const { slug } = await params
  const tournament = await getTournamentByUid(slug)

  if (!tournament) return notFound()

  const tournamentRecapBlogs = await getSocialBlogsByCategory("Tournament Recap")
  const matchRecapBlogs = await getSocialBlogsByCategory("Match Recap")

  const recapPosts = [
    ...(tournamentRecapBlogs.length > 0 ? [tournamentRecapBlogs[0]] : []),
    ...matchRecapBlogs.slice(0, 3)
  ].map(mapBlogDocumentToMetadata)

  try {
    // Test Opta API call - using example competition and season
    const optaResponse = await getF3Standings(1303, 2025)
    console.log('Opta F3 Standings Response:', JSON.stringify(optaResponse, null, 2))
  } catch (error) {
    console.error('Opta API Error:', error)
  }

  return (
    <div>
      <Section padding="md">
        <Container>
          <SectionHeading variant="split">
            <SectionHeadingSubtitle>
              {tournament.data.title} Recaps
            </SectionHeadingSubtitle>
            <SectionHeadingHeading className="text-4xl">
              Relive the action
            </SectionHeadingHeading>
          </SectionHeading>
          {recapPosts.length > 0 && <PostGrid posts={recapPosts} />}
          <div className="mt-8 text-center">
            <Button asChild size="skew_lg">
              <Link href="/news"><span>All News</span></Link>
            </Button>
          </div>
        </Container>
      </Section>
      <Section padding="md">
        <Container maxWidth="lg">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-headers font-semibold">
                FAQs
              </CardTitle>
              <CardDescription className="text-base">Frequently asked questions about World Sevens Football</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger>
                      <strong>{faq.question}</strong>
                    </AccordionTrigger>
                    <AccordionContent>
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className="mt-8 text-center">
                <Button asChild size="skew">
                  <Link href="/faqs"><span>Read More</span></Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </div>
  )
}
