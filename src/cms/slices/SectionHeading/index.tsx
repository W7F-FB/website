import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";

import { Container, Section } from "@/components/website-base/padding-containers";
import { SectionHeading as SectionHeadingComponent, SectionHeadingHeading, SectionHeadingSubtitle, SectionHeadingText } from "@/components/sections/section-heading";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";

/**
 * Props for `SectionHeading`.
 */
export type SectionHeadingProps =
  SliceComponentProps<Content.SectionHeadingSlice>;

/**
 * Component for "SectionHeading" Slices.
 */
const SectionHeading: FC<SectionHeadingProps> = ({ slice }) => {
  const { subtitle, heading, content } = slice.primary;

  const hasSubtitle = isFilled.keyText(subtitle);
  const hasHeading = isFilled.keyText(heading);
  const hasContent = isFilled.richText(content);
  const hasAnyContent = hasSubtitle || hasHeading || hasContent;

  if (!hasAnyContent) {
    return null;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <Section padding="sm">
          <SectionHeadingComponent variant="split">
            {hasSubtitle && (
              <SectionHeadingSubtitle>
                {subtitle}
              </SectionHeadingSubtitle>
            )}
            {hasHeading && (
              <SectionHeadingHeading>
                {heading}
              </SectionHeadingHeading>
            )}
            {hasContent && (
              <SectionHeadingText variant="lg">
                <PrismicRichTextComponent field={content} />
              </SectionHeadingText>
            )}
          </SectionHeadingComponent>
        </Section>
      </Container>
    </section>
  );
};

export default SectionHeading;
