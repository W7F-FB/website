import * as prismic from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/website-base/padding-containers";
import { ImageWithText } from "@/components/blocks/image-with-text";

export type ImageWithTextProps =
  SliceComponentProps<prismic.Content.ImageWithTextSlice>;

export default function ImageWithTextSlice({ slice }: ImageWithTextProps) {
  const titleText = prismic.asText(slice.primary.title);
  const imagePosition = slice.primary.image_position === "right" ? "right" : "left";
  const paddingTop = slice.primary.padding_top !== false;
  const paddingBottom = slice.primary.padding_bottom !== false;
  const spaceAbove = slice.primary.space_above !== false;
  const spaceBelow = slice.primary.space_below !== false;

  return (
    <Container maxWidth="lg" className={cn(paddingTop && "pt-8 md:pt-16", paddingBottom && "pb-8 md:pb-16", spaceAbove && "mt-8 md:mt-16", spaceBelow && "mb-8 md:mb-16")}>
      <ImageWithText
        content={{
          image: slice.primary.image.url ?? "",
          alt: slice.primary.image.alt ?? "Section image",
          heading: slice.primary.eyebrow ?? "",
          title: titleText ?? "",
          description: slice.primary.description,
        }}
        imagePosition={imagePosition}
      />
    </Container>
  );
}
