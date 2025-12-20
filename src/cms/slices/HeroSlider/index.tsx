import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { PrismicNextImage } from "@prismicio/next";

import { Section } from "@/components/website-base/padding-containers";
import { HeroSlider as HeroSliderComponent, HeroSliderSlide, HeroSliderSlideBackground, HeroSliderSlideContent } from "@/components/blocks/hero-slider";
import { H1, P, Subtitle, TextProtect } from "@/components/website-base/typography";
import { Button } from "@/components/ui/button";

/**
 * Props for `HeroSlider`.
 */
export type HeroSliderProps = SliceComponentProps<Content.HeroSliderSlice>;

/**
 * Component for "HeroSlider" Slices.
 */
const HeroSlider: FC<HeroSliderProps> = ({ slice }) => {
  const { slides } = slice.primary;

  if (!isFilled.group(slides) || slides.length === 0) {
    return null;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Section padding="sm">
        <HeroSliderComponent autoplay={true}>
          {slides.map((slide, index) => {
            const backgroundImage = slide.background_image;
            const backgroundColor = slide.background_color;
            const subtitle = slide.subtitle;
            const headline = slide.headline;
            const description = slide.description;
            const ctaPrimary = slide.cta_primary;
            const ctaSecondary = slide.cta_secondary;

            const getLinkUrl = (link: typeof ctaPrimary) => {
              if (!isFilled.link(link)) return "#";
              return link.url || "#";
            };

            return (
              <HeroSliderSlide key={index} className="grid grid-cols-1 lg:grid-cols-[auto_1fr]">
                {isFilled.image(backgroundImage) && (
                  <HeroSliderSlideBackground className="h-[25rem] top-auto lg:top-0 lg:h-full">
                    <PrismicNextImage
                      field={backgroundImage}
                      fill
                      className="object-cover object-bottom-right lg:object-center"
                    />
                  </HeroSliderSlideBackground>
                )}
                <HeroSliderSlideContent className="w-full lg:max-w-3xl justify-self-start px-8 pb-24 lg:pr-48 flex flex-col items-start justify-end">
                  {isFilled.image(backgroundColor) ? (
                    <PrismicNextImage field={backgroundColor} fill className="object-cover clip-watercolor-mask" alt="" />
                  ) : (
                    <Image src="/images/static-media/watercolor-bg.jpg" alt="" fill className="object-cover clip-watercolor-mask" />
                  )}
                  <TextProtect className="relative z-10 block space-y-3 lg:space-y-5">
                    {isFilled.keyText(subtitle) && (
                      <Subtitle className="text-lg lg:text-xl text-primary">{subtitle}</Subtitle>
                    )}
                    {isFilled.keyText(headline) && (
                      <H1 className="font-proxima uppercase font-black text-3xl lg:text-6xl">{headline}</H1>
                    )}
                    {isFilled.keyText(description) && (
                      <P noSpace className="text-xl lg:text-3xl text-balance font-headers font-medium text-foreground">{description}</P>
                    )}
                  </TextProtect>
                  {(isFilled.link(ctaPrimary) || isFilled.link(ctaSecondary)) && (
                    <div className="mt-6 w-full lg:mt-10 flex flex-col lg:flex-row gap-3 lg:gap-4">
                      {isFilled.link(ctaPrimary) && (
                        <Button asChild size="skew_lg">
                          <Link
                            href={getLinkUrl(ctaPrimary)}
                            {...(ctaPrimary.link_type === "Web" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            <span>{ctaPrimary.text || "Learn More"}</span>
                          </Link>
                        </Button>
                      )}
                      {isFilled.link(ctaSecondary) && (
                        <Button asChild size="skew_lg" variant="accent">
                          <Link
                            href={getLinkUrl(ctaSecondary)}
                            {...(ctaSecondary.link_type === "Web" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          >
                            <span>{ctaSecondary.text || "Learn More"}</span>
                          </Link>
                        </Button>
                      )}
                    </div>
                  )}
                </HeroSliderSlideContent>
              </HeroSliderSlide>
            );
          })}
        </HeroSliderComponent>
      </Section>
    </section>
  );
};

export default HeroSlider;
