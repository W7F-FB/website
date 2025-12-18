import { FC } from "react";
import Link from "next/link";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";
import { H2 } from "@/components/website-base/typography";
import { Container, Section } from "@/components/website-base/padding-containers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CaretRightIcon } from "@/components/website-base/icons";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";

/**
 * Props for `AccordionSection`.
 */
export type AccordionSectionProps =
  SliceComponentProps<Content.AccordionSectionSlice>;

/**
 * Component for "AccordionSection" Slices.
 */
const AccordionSection: FC<AccordionSectionProps> = ({ slice }) => {
  const { title, description, items } = slice.primary;
  
  const hasItems = items && items.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Section padding="md">
        <Container maxWidth="md">
          <Card>
            <CardHeader>
              <CardTitle>
                {isFilled.keyText(title) && <H2>{title}</H2>}
              </CardTitle>
              {isFilled.keyText(description) && (
                <CardDescription className="text-base">{description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {items.map((item, index) => (
                  isFilled.keyText(item.question) && (
                    <AccordionItem 
                      key={`accordion-item-${slice.id}-${index}`} 
                      value={`accordion-item-${slice.id}-${index}`}
                    >
                      <AccordionTrigger>
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <PrismicRichTextComponent field={item.answer} />
                      </AccordionContent>
                    </AccordionItem>
                  )
                ))}
              </Accordion>
              <div className="mt-8 pl-2 w-full flex justify-end">
                <Button asChild variant="link">
                  <Link href="/faqs">
                    <span>Read More</span>
                    <CaretRightIcon
                      className="size-3 mt-0.5"
                    />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>
    </section>
  );
};

export default AccordionSection;
