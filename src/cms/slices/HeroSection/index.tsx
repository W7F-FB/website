import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";
import * as prismic from "@prismicio/client";

import {
  SubpageHero,
  SubpageHeroContent,
  SubpageHeroMedia,
  SubpageHeroSecondary,
} from "@/components/blocks/subpage-hero";
import { H1, Subtitle } from "@/components/website-base/typography";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";

/**
 * Props for `HeroSection`.
 */
export type HeroSectionProps = SliceComponentProps<Content.HeroSectionSlice>;

/**
 * Component for "HeroSection" Slices.
 */
const HeroSection: FC<HeroSectionProps> = ({ slice }) => {
  const { subtitle, title, description, image, variant } = slice.primary;
  const isSecondary = variant === "secondary";

  // Secondary variant (simple centered hero)
  if (isSecondary) {
    return (
      <section
        data-slice-type={slice.slice_type}
        data-slice-variation={slice.variation}
      >
        <SubpageHeroSecondary>
          {title && <H1 className="">{title}</H1>}
          {description && <PrismicRichTextComponent field={description} />}
        </SubpageHeroSecondary>
      </section>
    );
  }

  // Default variant (hero with image)
  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <SubpageHero>
        <SubpageHeroContent>
          {subtitle && <Subtitle>{subtitle}</Subtitle>}
          {title && <H1 className="">{title}</H1>}
          {description && <PrismicRichTextComponent field={description} />}
        </SubpageHeroContent>
        {prismic.isFilled.image(image) && (
          <SubpageHeroMedia>
            <PrismicNextImage
              field={image}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </SubpageHeroMedia>
        )}
      </SubpageHero>
    </section>
  );
};

export default HeroSection;
