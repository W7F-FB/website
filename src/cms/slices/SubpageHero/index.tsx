import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { cn } from "@/lib/utils";
import {
  SubpageHero,
  SubpageHeroContent,
  SubpageHeroMedia,
} from "@/components/blocks/subpage-hero";
import { H1, P, Subtitle } from "@/components/website-base/typography";

export type SubpageHeroProps = SliceComponentProps<Content.SubpageHeroSlice>;

export default function SubpageHeroSlice({ slice }: SubpageHeroProps) {
  const spaceAbove = slice.primary.space_above !== false;
  const spaceBelow = slice.primary.space_below !== false;

  return (
    <SubpageHero className={cn(spaceAbove && "mt-8 md:mt-16", spaceBelow && "mb-8 md:mb-16")}>
      <SubpageHeroContent>
        {slice.primary.subtitle && (
          <Subtitle>{slice.primary.subtitle}</Subtitle>
        )}
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            heading1: ({ children }) => <H1>{children}</H1>,
          }}
        />
        <PrismicRichText
          field={slice.primary.description}
          components={{
            paragraph: ({ children }) => <P>{children}</P>,
          }}
        />
      </SubpageHeroContent>
      <SubpageHeroMedia>
        <PrismicNextImage
          field={slice.primary.image}
          fill
          className="object-cover"
        />
      </SubpageHeroMedia>
    </SubpageHero>
  );
}
