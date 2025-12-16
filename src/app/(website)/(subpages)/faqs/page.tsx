import type { Metadata } from "next";

import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { H1, H2, P } from "@/components/website-base/typography"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero";
import { SectionNav } from "./section-nav";
import { getAllFaqSections } from "@/cms/queries/faqs";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";

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
        images: [
            {
                url: "https://worldsevensfootball.com/images/static-media/Opengraph.jpg",
                width: 1200,
                height: 630,
                alt: "World Sevens Football",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "FAQs - World Sevens Football",
        description:
            "Frequently asked questions about World Sevens Football. Get answers about tournament format, qualification, rules, prize pools, and everything you need to know about 7v7 soccer.",
        creator: "@worldsevens",
    },
};

export default async function FAQsPage() {
    const allFaqSections = await getAllFaqSections();
    
    const allowedUids = ["competition-format", "event", "ticketing"];
    const faqSections = allFaqSections.filter((section) => 
        section.uid && allowedUids.includes(section.uid)
    );

    const sections = faqSections.map((section) => ({
        id: section.uid || "",
        title: section.data.section_title || "",
    }));

    return <>
        <NavMain showBreadcrumbs />
        <main className="flex-grow min-h-[30rem]">
            <div>
                <PaddingGlobal>
        <SubpageHeroSecondary>
            <H1 className="">FAQs</H1>
            <P className="text-lg">Everything you need to know about the tournament, tickets, and event experience</P>
        </SubpageHeroSecondary>
        <Container maxWidth="lg">
        <Section padding="md" className="min-h-screen grid grid-cols-12 gap-4 md:gap-16 w-full">
            <div className="hidden md:block col-span-3 md:sticky md:top-32 md:self-start">
                <SectionNav sections={sections} />
            </div>

            <div className="col-span-12 md:col-span-9 space-y-10 w-full min-w-0">
                {faqSections.map((section) => (
                    <div key={section.uid} id={section.uid} className="scroll-mt-24 w-full">
                        <Accordion type="single" collapsible className="w-full">
                            <H2 className="uppercase">{section.data.section_title}</H2>
                            {section.data.faqs.map((faq, index) => (
                                <AccordionItem key={`${section.uid}-${index}`} value={`${section.uid}-${index}`}>
                                    <AccordionTrigger>
                                        <span className="font-medium">{faq.question}</span>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <PrismicRichTextComponent field={faq.answer} />
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                ))}
            </div>
        </Section>
    </Container>
    </PaddingGlobal>
            </div>
        </main>
        <Footer />
    </>
}
