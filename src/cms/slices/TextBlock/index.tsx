import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { cn } from "@/lib/utils";

import { Container, Section } from "@/components/website-base/padding-containers";
import { H2 } from "@/components/website-base/typography";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";

/**
 * Props for `TextBlock`.
 */
export type TextBlockProps = SliceComponentProps<Content.TextBlockSlice>;

/**
 * Component for "TextBlock" Slices.
 */
const TextBlock: FC<TextBlockProps> = ({ slice }) => {
  const { title, content, alignment, max_width } = slice.primary;

  // Convert alignment to lowercase for className
  const alignmentClass =
    alignment?.toLowerCase() === "center"
      ? "text-center"
      : alignment?.toLowerCase() === "right"
      ? "text-right"
      : "text-left";

  // Map max_width to Container maxWidth prop
  const containerMaxWidth = max_width === "full" 
    ? undefined 
    : (max_width as "sm" | "md" | "lg" | undefined);

  const contentWrapper = (
    <div className={cn("w-full", alignmentClass)}>
      {title && <H2 className="uppercase">{title}</H2>}
      {content && <PrismicRichTextComponent field={content} />}
    </div>
  );

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      {max_width === "full" ? (
        <Section padding="md">{contentWrapper}</Section>
      ) : (
        <Container maxWidth={containerMaxWidth}>
          <Section padding="md">{contentWrapper}</Section>
        </Container>
      )}
    </section>
  );
};

export default TextBlock;
