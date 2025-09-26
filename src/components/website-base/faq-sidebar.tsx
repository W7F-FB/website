"use client";

import * as React from "react";
import type { ReactNode } from "react";

import { H2, H3, P } from "@/components/website-base/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import type { FAQItem } from "@/types/basic";

interface FaqSectionProps {
    title: ReactNode;           // e.g., "Competition Format"
    faqData: FAQItem[];
}

export default function FaqSection({ title, faqData }: FaqSectionProps) {
    const sectionRef = React.useRef<HTMLDivElement>(null);

    const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
        ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="grid grid-cols-12 gap-6">
            {/* LEFT SIDEBAR (sticky) */}
            <div className="col-span-3 sticky top-24 self-start space-y-4">
                <Button
                    variant="ghost"
                    className="uppercase text-left w-full justify-start"
                    onClick={() => scrollTo(sectionRef)}
                >
                    <H3>{title}</H3>
                </Button>
            </div>

            {/* RIGHT CONTENT */}
            <div className="col-span-9 space-y-10">
                <div ref={sectionRef} className="scroll-mt-24">
                    <Accordion type="single" collapsible className="w-full">
                        <H2 className="uppercase">{title}</H2>
                        {faqData.map((faq) => (
                            <AccordionItem key={faq.id} value={faq.id}>
                                <AccordionTrigger>
                                    <strong>{faq.question}</strong>
                                </AccordionTrigger>
                                <AccordionContent>
                                    {Array.isArray(faq.answer) ? (
                                        faq.answer.map((paragraph, idx) => <P key={idx}>{paragraph}</P>)
                                    ) : (
                                        <P>{faq.answer}</P>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </section>
    );
}
