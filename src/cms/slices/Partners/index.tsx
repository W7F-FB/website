import { FC } from "react";
import Image from "next/image";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";
import { H2, P } from "@/components/website-base/typography";
import { Container, Section } from "@/components/website-base/padding-containers";

/**
 * Props for `Partners`.
 */
export type PartnersProps = SliceComponentProps<Content.PartnersSlice>;

/**
 * Component for "Partners" Slices.
 */
const Partners: FC<PartnersProps> = ({ slice }) => {
  const { title, content, columns, logos } = slice.primary;
  const columnsValue = columns || "3";
  const gridColsClass = {
    "2": "grid-cols-2",
    "3": "grid-cols-3",
    "4": "grid-cols-4",
    "6": "grid-cols-6",
  }[columnsValue] || "grid-cols-3";

  if (!logos || logos.length === 0) {
    return null;
  }

  const hasContent = isFilled.richText(content);
  const hasTitle = isFilled.keyText(title);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container maxWidth="lg">
        <Section padding="md" className="flex flex-col gap-8">
          {hasTitle && (
            <H2 className="uppercase text-4xl text-center">{title}</H2>
          )}

          {hasContent ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="prose prose-invert max-w-none">
                <PrismicRichTextComponent field={content} />
              </div>
              <div className={`col-span-2 grid ${gridColsClass} gap-5`}>
                {logos.map((logoItem, index) => {
                  if (!isFilled.image(logoItem.logo)) return null;

                  return (
                    <div key={index} className="relative w-5/8 aspect-square">
                      <Image
                        src={logoItem.logo.url}
                        alt={logoItem.logo.alt || "Partner logo"}
                        fill
                        className="object-fit"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={`grid ${gridColsClass} gap-5`}>
              {logos.map((logoItem, index) => {
                if (!isFilled.image(logoItem.logo)) return null;

                return (
                  <div key={index} className="relative w-5/8 aspect-square">
                    <Image
                      src={logoItem.logo.url}
                      alt={logoItem.logo.alt || "Partner logo"}
                      fill
                      className="object-fit"
                    />
                  </div>
                );
              })}
            </div>
          )}
        </Section>
      </Container>
    </section>
  );
};

export default Partners;
