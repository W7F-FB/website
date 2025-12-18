import { FC } from "react";
import Link from "next/link";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";

import { InfoCard } from "@/components/blocks/info-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { H2, P, Footnote } from "@/components/website-base/typography";
import { Container, Section } from "@/components/website-base/padding-containers";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";

/**
 * Props for `InfoCards`.
 */
export type InfoCardsProps = SliceComponentProps<Content.InfoCardsSlice>;

/**
 * Component for "InfoCards" Slices.
 */
const InfoCards: FC<InfoCardsProps> = ({ slice }) => {
  const { title, content, footnote, button_link, cards_title, cards } = slice.primary;

  // Get button text from link display text
  const buttonDisplayText = isFilled.link(button_link) && button_link.text
    ? button_link.text
    : "";

  const hasButton = buttonDisplayText && isFilled.link(button_link) && button_link.url;

  // Get the link URL based on link type
  const getLinkUrl = () => {
    if (!isFilled.link(button_link)) return "#";
    if (button_link.link_type === "Web") {
      return button_link.url || "#";
    }
    return button_link.url || "#";
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container maxWidth="lg">
        <Section padding="md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            <div>
              {isFilled.keyText(title) && (
                <H2 className="uppercase mb-6">{title}</H2>
              )}
              {isFilled.richText(content) && (
                <PrismicRichTextComponent field={content} />
              )}
              {isFilled.keyText(footnote) && (
                <Footnote>{footnote}</Footnote>
              )}
              {hasButton && (
                <div className="mt-8">
                  <Button asChild size="skew">
                    <Link
                      href={getLinkUrl()}
                      {...(button_link.link_type === "Web" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      <span>{buttonDisplayText}</span>
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div>
              {isFilled.keyText(cards_title) && (
                <div className="flex mb-8 mt-3">
                  <Badge fast variant="muted" className="uppercase">
                    {cards_title}
                  </Badge>
                </div>
              )}
              {cards && cards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 auto-cols-fr gap-4 md:gap-6">
                  {cards.map((card, index) => {
                    const isLastCard = index === cards.length - 1;

                    return (
                      <InfoCard
                        key={`info-card-${index}`}
                        subtitle={card.subtitle || ""}
                        title={card.title || undefined}
                        description={card.description || undefined}
                        className={isLastCard ? "md:col-span-2" : ""}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </Section>
      </Container>
    </section>
  );
};

export default InfoCards;
