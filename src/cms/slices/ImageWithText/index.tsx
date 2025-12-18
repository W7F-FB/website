import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import * as prismic from "@prismicio/client";

import { ImageWithText as ImageWithTextComponent } from "@/components/blocks/image-with-text";
import { Container, Section } from "@/components/website-base/padding-containers";
import { Separator } from "@/components/ui/separator";
/**
 * Props for `ImageWithText`.
 */
export type ImageWithTextProps = SliceComponentProps<Content.ImageWithTextSlice> & {
  index?: number;
  slices?: Content.ImageWithTextSlice[];
};

/**
 * Component for "ImageWithText" Slices.
 */
const ImageWithText: FC<ImageWithTextProps> = ({ slice, index, slices }) => {
  const { image, heading, title, description, image_position } = slice.primary;

  // Convert image_position from "Left"/"Right" to "left"/"right"
  const imagePosition =
    image_position?.toLowerCase() === "right" ? "right" : "left";

  if (!prismic.isFilled.image(image) || !title) {
    return null;
  }

  // Check if this is not the last slice
  const isLastSlice = index !== undefined && slices && index === slices.length - 1;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container maxWidth="lg">
        <Section padding="md" className="gap-16 pt-16 pb-0">
          <ImageWithTextComponent
            content={{
              image: image.url ?? "",
              alt: image.alt ?? "Section image",
              heading: heading ?? undefined,
              title: title,
              description: description ?? [],
            }}
            imagePosition={imagePosition}
          />
          {!isLastSlice && (
            <Separator className="mt-16" />
          )}
        </Section>
      </Container>
    </section>
  );
};

export default ImageWithText;
