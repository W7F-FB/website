import type { Metadata } from "next";
import type { FAQItem } from "@/types/basic";
import { Section, Container } from "@/components/website-base/padding-containers"
import { H1 } from "@/components/website-base/typography"
import FaqSection from "@/components/website-base/faq-sidebar";

export const metadata: Metadata = {
    title: "FAQs - World Sevens Football",
    description:
        "Frequently asked questions about World Sevens Football. Get answers about tournament format, qualification, rules, prize pools, and everything you need to know about 7v7 soccer.",
    keywords: [
        "World Sevens FAQ",
        "7v7 football rules",
        "tournament format",
        "qualification process",
        "prize pool information",
    ],
    openGraph: {
        title: "FAQs - World Sevens Football",
        description:
            "Frequently asked questions about World Sevens Football. Get answers about tournament format, qualification, rules, prize pools, and everything you need to know about 7v7 soccer.",
        url: "https://worldsevensfootball.com/faqs",
        siteName: "World Sevens Football",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FAQs - World Sevens Football",
        description:
            "Frequently asked questions about World Sevens Football. Get answers about tournament format, qualification, rules, prize pools, and everything you need to know about 7v7 soccer.",
        creator: "@worldsevens",
    },
};

const faqData: FAQItem[] = [
    {
        id: "item-1",
        question: "What is the format of a W7F tournament?",
        answer: [
            "The fast-paced seven-a-side format includes a two-day group-stage round-robin, featuring two groups of four teams. On day three of the tournament, the top two clubs per group will advance to the knockout stage. There will be sixteen matches per tournament, including a third-place match, and of course, a much-anticipated championship match.",
            "Each club will play between three and five games in total, depending on the progress of that club through the tournament."
        ]
    },
    {
        id: "item-2",
        question: "Who participates in W7F tournaments?",
        answer: [
            "Established professional clubs from the best leagues across the globe have committed to participating in W7F's seven-a-side tournaments. From that club pool, teams will be chosen to compete.",
            "For the May 2025 tournament in Estoril, participating clubs were: Ajax, Bayern, Benfica, Manchester City, Manchester United, Paris Saint-Germain, AS Roma and FC Rosengard."
        ]
    },
    {
        id: "item-3",
        question: "How many clubs will take part in each W7F tournaments?",
        answer: "The first and second tournament feature eight sides from the club pool. As the series grows, we expect to expand the number of teams competing in each event."
    },
    {
        id: "item-4",
        question: "How long is each W7F game?",
        answer: "Each game will last 30 minutes, divided into two halves of 15 minutes each, with extra time for a tie-break. There will be a 5-minute halftime."
    },
    {
        id: "item-5",
        question: "What is the size of a W7F pitch?",
        answer: "Half of the size of a traditional football pitch."

    },
    {
        id: "item-6",
        question: "What is the total prize pool for a W7F tournament?",
        answer: "$5,000,000 per tournament."
    },
    {
        id: "item-7",
        question: "When and where will W7F tournaments take place?",
        answer: "Our second tournament will take place at  Beyond Bancard Field in Fort Lauderdale, Florida 5-7 Dec 2025.Future tournaments are being finalized."
    }

];

export default function FAQsPage() {
    return <Container maxWidth="6xl">
                <Section padding="none">
                    <H1 className="uppercase text-2xl md:text-6xl text-left md:my-16">Faq</H1>
                </Section>

                <Section padding="md" className="min-h-screen">
                    <FaqSection
                        title={<>Competition<br />Format</>}
                        faqData={faqData}
                    />
                </Section>
            </Container>
}
