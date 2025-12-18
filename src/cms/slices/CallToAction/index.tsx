import { FC } from "react";
import Link from "next/link";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { H2, P } from "@/components/website-base/typography";
import { Container, Section } from "@/components/website-base/padding-containers";
import { Button } from "@/components/ui/button";

/**
 * Props for `CallToAction`.
 */
export type CallToActionProps = SliceComponentProps<Content.CallToActionSlice>;

/**
 * Component for "CallToAction" Slices.
 */
const CallToAction: FC<CallToActionProps> = ({ slice }) => {
  const { title, description, button_link, alignment } = slice.primary;
  
  const alignmentClass = {
    "Left": "text-left",
    "Center": "text-center",
    "Right": "text-right",
  }[alignment || "Center"] || "text-center";

  // Get button text from link display text
  const buttonDisplayText = (isFilled.link(button_link) && button_link.text) 
    ? button_link.text 
    : "";

  const hasButton = buttonDisplayText && isFilled.link(button_link) && button_link.url;
  const hasDescription = description && description.length > 0;
  
  // Get the link URL based on link type
  const getLinkUrl = () => {
    if (!isFilled.link(button_link)) return "#";
    if (button_link.link_type === "Web") {
      return button_link.url || "#";
    }
    // For document links, use the url field
    return button_link.url || "#";
  };

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container maxWidth="lg">
        <Section padding="md" className={alignmentClass}>
          <Container maxWidth="md">
            {isFilled.keyText(title) && (
              <H2 variant="h1" className="uppercase text-2xl md:text-5xl py-6 md:py-12">
                {title}
              </H2>
            )}
            
            {hasDescription && (
              <>
                {description.map((item, index) => (
                  isFilled.keyText(item.text) && (
                    <P key={index} noSpace>
                      {item.text}
                    </P>
                  )
                ))}
              </>
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
          </Container>
        </Section>
      </Container>
    </section>
  );
};

export default CallToAction;
