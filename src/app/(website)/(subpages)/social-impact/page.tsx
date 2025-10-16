import Image from "next/image";
import type { Metadata } from "next";

import { SubpageHero, SubpageHeroContent, SubpageHeroMedia } from "@/components/blocks/subpage-hero";
import { Section, Container } from "@/components/website-base/padding-containers";
import { H1, H2, P, Subtitle } from "@/components/website-base/typography";
import { getAllImageWithText } from "@/cms/queries/social-contents"
import { ImageWithText } from "@/components/blocks/image-with-text"
import { getSocialBlogs } from "@/cms/queries/blog"
import { PostCompact } from "@/components/website-base/posts/post"
import { Separator } from "@/components/ui/separator";

import { mapBlogDocumentToMetadata } from "../news/page"


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

async function BlogsShow() {
  const blogs = await getSocialBlogs();
  if (!blogs?.length) return null;

  return (
      <div className="flex flex-col gap-6">
        {blogs.map((p) => (
          <PostCompact
            key={p.uid}
            blog={mapBlogDocumentToMetadata(p)}
          />
        ))}
      </div>
  );
}

async function BlocksShow() {
  const sections = await getAllImageWithText();
  if (!sections?.length) return null;

  return (
    <>
      {sections.map((section, idx) => (
        <Section key={section.id}  className="gap-16 pt-16 pb-0">
          <ImageWithText
            content={{
              image: section.data.image.url ?? "",
              alt: section.data.image.alt ?? "Section image",
              heading: section.data.heading ?? "",
              title: section.data.title ?? "",
              description: section.data.description ?? "",
            }}
            imagePosition={idx % 2 === 0 ? "left" : "right"} // alternate left/right
          />

          {idx < sections.length - 1 && (
            <Separator className="mt-16 opacity-50" />
          )}
        </Section>
      ))}
    </>
  );
}

const championship = [
    '68306970b8959b05c822e2a4_Benficia Foundation.svg',
    '68306970b76752371213b8c6_Camada.svg',
    '68306970d05914ebb11087af_Girlsforgirls.svg'
]


export default function SocialImpactPage() {
  return <Container maxWidth="lg">
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
        <H2 className="uppercase py-16 text-4xl text-center">Our Initiatives</H2>
        <BlocksShow/>
    </Section>

    <Section padding="md" className="grid grid-cols-1 md:grid-cols-3 gap-16" id="player-advisory-council">
        <P>For our inaugural tournament in Estoril, Portugal, our three Community Champions include CAIS, Benfica Foundation, and Girls for Girls Portugal:</P>
        <div className="col-span-2 grid grid-cols-3 gap-5">
            {championship.map((i) => (
                <div key={i} className="relative w-5/8 aspect-square">
                    <Image
                    src={`/images/champions/${i}`}
                    alt="champion"
                    fill
                    className="object-fit" 
                    />
                </div>
            ))}
        </div>
    </Section>

    <Section padding="md" className="grid grid-cols-1 md:grid-cols-3 gap-16" >
        <H2 className="uppercase text-3xl">Keep Reading</H2>

        <div className="col-span-2 grid grid-cols-1 gap-5">
            <BlogsShow />
        </div>
    </Section>

  </Container>
}
