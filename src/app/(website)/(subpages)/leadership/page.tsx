import { SubpageHero, SubpageHeroContent, SubpageHeroMedia } from "@/components/blocks/subpage-hero";
import { Section } from "@/components/website-base/padding-containers";
import { H1, P, Subtitle } from "@/components/website-base/typography";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Leadership - World Sevens Football",
    description: "Meet the leadership team behind World Sevens Football. Learn about the visionaries and executives driving the future of 7v7 soccer and elite tournament competition.",
    keywords: ["World Sevens leadership", "executive team", "football executives", "tournament organizers", "7v7 soccer leaders"],
    openGraph: {
        title: "Leadership - World Sevens Football",
        description: "Meet the leadership team behind World Sevens Football. Learn about the visionaries and executives driving the future of 7v7 soccer and elite tournament competition.",
        url: "https://worldsevensfootball.com/leadership",
        siteName: "World Sevens Football",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Leadership - World Sevens Football",
        description: "Meet the leadership team behind World Sevens Football. Learn about the visionaries and executives driving the future of 7v7 soccer and elite tournament competition.",
        creator: "@worldsevens",
    },
};

export default function LeadershipPage() {
  return <div>
    <Section padding="none">
        <SubpageHero>
            <SubpageHeroContent>
                <Subtitle>World Sevens Football</Subtitle>
                <H1 className="uppercase text-6xl">Who we are</H1>
                <P>We are a team of experienced business professionals and players leading an organization with a mission to be an undeniable force in the game of football that ignites growth and equity, delivers electrifying experiences and connects global communities.</P>
            </SubpageHeroContent>
            <SubpageHeroMedia>
                <Image src="/images/static-media/w7f-leadership.avif" alt="Leadership Hero" fill className="object-cover" />
            </SubpageHeroMedia>
        </SubpageHero>
    </Section>
    <Section padding="md" className="min-h-screen">
      
    </Section>
  </div>
}
