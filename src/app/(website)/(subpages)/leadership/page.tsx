import { SubpageHero, SubpageHeroContent, SubpageHeroMedia } from "@/components/blocks/subpage-hero";
import { Section } from "@/components/website-base/padding-containers";
import { H1, H2, P, Subtitle } from "@/components/website-base/typography";
import { TeamCard } from "@/components/blocks/team-card";
import { GridCellScrollLink } from "@/components/blocks/grid-cell-scroll-link";
import { GradientBanner } from "@/components/ui/gradient-banner";
import { EmptyMessage } from "@/components/ui/empty-message";
import { getPlayerAdvisoryCouncil, getCoFounders, getLeadershipTeam } from "@/cms/queries/team";
import Image from "next/image";
import type { Metadata } from "next";
import * as prismic from "@prismicio/client";
import { Separator } from "@/components/ui/separator";

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

export default async function LeadershipPage() {
    const playerAdvisoryCouncil = await getPlayerAdvisoryCouncil();
    const coFounders = await getCoFounders();
    const leadershipTeam = await getLeadershipTeam();

    return <div>
        <Section padding="none">
            <SubpageHero>
                <SubpageHeroContent>
                    <Subtitle>World Sevens Football</Subtitle>
                    <H1 className="uppercase text-6xl">Leadership</H1>
                    <P>We are a team of experienced business professionals and players leading an organization with a mission to be an undeniable force in the game of football that ignites growth and equity, delivers electrifying experiences and connects global communities.</P>
                </SubpageHeroContent>
                <SubpageHeroMedia>
                    <Image src="/images/static-media/w7f-leadership.avif" alt="Leadership Hero" fill className="object-cover" sizes="1500" />
                </SubpageHeroMedia>
            </SubpageHero>
        </Section>
        <Section padding="md" className="grid grid-cols-3 gap-16" id="player-advisory-council">
            <GradientBanner className="">
                <H2>Player Advisory Council</H2>
                <P>World Sevens Football is putting players at the heart of the game by developing a Player Advisory Council. This elite group will play a critical role in shaping player care and welfare, competition strategy, and the positive long-term impact on players and clubs.</P>
            </GradientBanner>
            <div className="col-span-2 grid grid-cols-3 gap-8">
                {playerAdvisoryCouncil.length > 0 ? (
                    playerAdvisoryCouncil.map((member) => (
                        <TeamCard
                            key={member.id}
                            team={{
                                name: member.data.name || "Unknown",
                                role: member.data.role || "Unknown",
                                headshot: prismic.isFilled.image(member.data.headshot)
                                    ? member.data.headshot.url || ""
                                    : "",
                                department: member.data.department as 'Player Advisor' | 'Co-Founder' | 'Leadership Team'
                            }}
                        />
                    ))
                ) : (
                    <EmptyMessage className="col-span-3 self-start">
                        <P>Our Player Advisory Council is being assembled. Check back soon to meet the elite players who will help shape the future of World Sevens Football.</P>
                    </EmptyMessage>
                )}
                <GridCellScrollLink href="#co-founders" />
            </div>
        </Section>
        <Separator className="my-16 opacity-50" variant="skewDash" />
        <Section padding="md" className="grid grid-cols-3 gap-16" id="co-founders">
            <GradientBanner className="">
                <H2>Co-Founders</H2>
                <P>Meet the visionary co-founders who established World Sevens Football with a mission to revolutionize 7v7 soccer and create unparalleled tournament experiences for players worldwide.</P>
            </GradientBanner>
            <div className="col-span-2 grid grid-cols-3 gap-8">
                {coFounders.length > 0 ? (
                    coFounders.map((member) => (
                        <TeamCard
                            key={member.id}
                            team={{
                                name: member.data.name || "Unknown",
                                role: member.data.role || "Unknown",
                                headshot: prismic.isFilled.image(member.data.headshot)
                                    ? member.data.headshot.url || ""
                                    : "",
                                department: member.data.department as 'Player Advisor' | 'Co-Founder' | 'Leadership Team'
                            }}
                        />
                    ))
                ) : (
                    <EmptyMessage className="col-span-3 self-start">
                        <P>Meet the visionary minds behind World Sevens Football. Co-founder profiles coming soon.</P>
                    </EmptyMessage>
                )}
                <GridCellScrollLink href="#leadership-team" />
            </div>
        </Section>
        <Separator className="my-16 opacity-50" />
        <Section padding="md" className="grid grid-cols-3 gap-16" id="leadership-team">
            <GradientBanner className="">
                <H2>Leadership Team</H2>
                <P>Our experienced leadership team brings together diverse expertise in sports management, business development, and tournament operations to drive World Sevens Football&apos;s strategic vision forward.</P>
            </GradientBanner>
            <div className="col-span-2 grid grid-cols-3 gap-8">
                {leadershipTeam.length > 0 ? (
                    leadershipTeam.map((member) => (
                        <TeamCard
                            key={member.id}
                            team={{
                                name: member.data.name || "Unknown",
                                role: member.data.role || "Unknown",
                                headshot: prismic.isFilled.image(member.data.headshot)
                                    ? member.data.headshot.url || ""
                                    : "",
                                department: member.data.department as 'Player Advisor' | 'Co-Founder' | 'Leadership Team'
                            }}
                        />
                    ))
                ) : (
                    <EmptyMessage className="col-span-3 self-start">
                        <P>Our experienced leadership team is driving World Sevens Football forward. Team member profiles will be available here soon.</P>
                    </EmptyMessage>
                )}
            </div>
        </Section>
    </div>
}
