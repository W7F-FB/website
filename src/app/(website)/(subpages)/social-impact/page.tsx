import { SubpageHero, SubpageHeroContent, SubpageHeroMedia } from "@/components/blocks/subpage-hero";
import { Section } from "@/components/website-base/padding-containers";
import { H1, P, Subtitle } from "@/components/website-base/typography";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Social Impact - World Sevens Football",
    description: "Discover how World Sevens Football is making a positive impact through community programs, youth development, and global football initiatives that extend beyond the pitch.",
    keywords: ["World Sevens social impact", "football community programs", "youth development", "soccer social responsibility", "community outreach"],
    openGraph: {
        title: "Social Impact - World Sevens Football",
        description: "Discover how World Sevens Football is making a positive impact through community programs, youth development, and global football initiatives that extend beyond the pitch.",
        url: "https://worldsevensfootball.com/social-impact",
        siteName: "World Sevens Football",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Social Impact - World Sevens Football",
        description: "Discover how World Sevens Football is making a positive impact through community programs, youth development, and global football initiatives that extend beyond the pitch.",
        creator: "@worldsevens",
    },
};

export default function SocialImpactPage() {
  return <div>
    <Section padding="none">
        <SubpageHero>
            <SubpageHeroContent>
                <Subtitle>Global</Subtitle>
                <H1 className="uppercase text-6xl">Social Impact</H1>
                <P>World Sevens Football is committed to making a positive impact on the world through our community programs, youth development, and global football initiatives that extend beyond the pitch.</P>
            </SubpageHeroContent>
            <SubpageHeroMedia>
                <Image src="/images/static-media/social-impact.avif" alt="Social Impact Hero" fill className="object-cover" />
            </SubpageHeroMedia>
        </SubpageHero>
    </Section>
    <Section padding="md" className="min-h-screen">
      
    </Section>
  </div>
}
