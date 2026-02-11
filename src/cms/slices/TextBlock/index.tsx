import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/website-base/padding-containers";
import { H2, H3, H4, P } from "@/components/website-base/typography";

export type TextBlockProps = SliceComponentProps<Content.TextBlockSlice>;

const alignClasses = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

const sizeClasses = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
} as const;

const widthClasses = {
  full: "",
  large: "max-w-4xl",
  medium: "max-w-2xl",
  small: "max-w-xl",
} as const;

const marginByAlign = {
  left: "mr-auto",
  center: "mx-auto",
  right: "ml-auto",
} as const;

export default function TextBlockSlice({ slice }: TextBlockProps) {
  const paddingTop = slice.primary.padding_top !== false;
  const paddingBottom = slice.primary.padding_bottom !== false;
  const spaceAbove = slice.primary.space_above !== false;
  const spaceBelow = slice.primary.space_below !== false;
  const textAlign = slice.primary.text_align ?? "left";
  const textSize = slice.primary.text_size ?? "medium";
  const contentWidth = slice.primary.content_width ?? "full";
  const isConstrained = contentWidth !== "full";

  return (
    <Container
      maxWidth="lg"
      className={cn(
        paddingTop && "pt-8 md:pt-16",
        paddingBottom && "pb-8 md:pb-16",
        spaceAbove && "mt-8 md:mt-16",
        spaceBelow && "mb-8 md:mb-16",
      )}
    >
      <div
        className={cn(
          alignClasses[textAlign as keyof typeof alignClasses],
          sizeClasses[textSize as keyof typeof sizeClasses],
          isConstrained && widthClasses[contentWidth as keyof typeof widthClasses],
          isConstrained && marginByAlign[textAlign as keyof typeof marginByAlign],
        )}
      >
      <PrismicRichText
        field={slice.primary.heading}
        components={{
          heading2: ({ children }) => (
            <H2 className="uppercase text-4xl text-center">{children}</H2>
          ),
        }}
      />
      <PrismicRichText
        field={slice.primary.body}
        components={{
          heading2: ({ children }) => <H2 className="uppercase mt-8 mb-4">{children}</H2>,
          heading3: ({ children }) => <H3 className="uppercase mt-6 mb-3">{children}</H3>,
          heading4: ({ children }) => <H4 className="mt-4 mb-2">{children}</H4>,
          heading5: ({ children }) => <h5 className="scroll-m-20 text-base lg:text-lg font-medium font-headers mt-4 mb-2">{children}</h5>,
          heading6: ({ children }) => <h6 className="scroll-m-20 text-sm lg:text-base font-medium font-headers mt-4 mb-2">{children}</h6>,
          paragraph: ({ children }) => <P>{children}</P>,
          preformatted: ({ children }) => (
            <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-4 italic">
              {children}
            </blockquote>
          ),
          listItem: ({ children }) => <li className="mt-2">{children}</li>,
          oListItem: ({ children }) => <li className="mt-2">{children}</li>,
          hyperlink: ({ node, children }) => {
            const isExternal = node.data.link_type === "Web";
            return (
              <a
                href={node.data.url || ""}
                className="underline underline-offset-2 text-primary"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
        }}
      />
      </div>
    </Container>
  );
}
