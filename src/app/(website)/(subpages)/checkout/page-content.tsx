import { PaddingGlobal, Container, Section } from "@/components/website-base/padding-containers";
import { H1, P, Subtitle, H3 } from "@/components/website-base/typography";
import { CheckoutShow } from "@/components/blocks/checkout/checkout-show";
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero";
import { Background } from "@/components/ui/background";
import { PalmtreeIcon, TagChevronIcon } from "@/components/website-base/icons";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

export default function CheckoutPageContent() {
    return (
        <PaddingGlobal>
            <div>
                <SubpageHeroSecondary className="max-w-none w-full">
                    <Background className="flex items-start justify-between">
                        <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 mask-b-from-0% mask-b-to-85%" />
                        <PalmtreeIcon fill="currentColor" className="opacity-3 text-foreground w-auto h-100 rotate-y-180 mask-b-from-0% mask-b-to-85%" />
                    </Background>
                    <div className="relative max-w-3xl mx-auto">
                        <Subtitle className="text-primary">Beyond Bancard Field</Subtitle>
                        <H1 className="uppercase">Purchase Tickets</H1>
                        <P className="text-lg"><span className="font-semibold">December 5-7, 2025</span><span className="ml-3 font-light text-sm">Fort Lauderdale, FL, USA</span></P>
                        <P className="max-w-4xl mx-auto mt-4">Experience a new brand of women&apos;s football as some of the world&apos;s best clubs clash in the fast-paced 7v7 format. Three days of nonstop action, December 5–7 at Beyond Bancard Stadium. Don&apos;t miss the second edition of this global showdown with $5 million up for grabs. Get your tickets now!</P>
                    </div>
                </SubpageHeroSecondary>
                <Container maxWidth="lg">
                    <Section padding="md">
                        <Card className="overflow-hidden relative bg-card/30">
                            <div className="absolute w-1 left-0 top-0 bottom-0 bg-border"></div>
                            <CardHeader className="border-b">
                                <CardTitle>
                                    <H3 className="uppercase">Ticket Purchase Guide</H3>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    <li className="flex items-start gap-2">
                                        <TagChevronIcon className="size-3 mt-1.25" />
                                        <span>Review <Link href="#tickets" className="text-primary underline underline-offset-4 hover:text-primary/80">ticket types</Link></span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <TagChevronIcon className="size-3 mt-1.25" />
                                        <span>Select session date</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <TagChevronIcon className="size-3 mt-1.25" />
                                        <span>Scroll to the map to review pricing and make your selection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <TagChevronIcon className="size-3 mt-1.25" />
                                        <span>Return back here to add other ticket types to your cart.</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </Section>
                </Container>
                <CheckoutShow />
                <div className="flex flex-col md:flex-row gap-6 items-center text-center justify-center py-4 opacity-50">
                    <p>Powered by</p>
                    <Image src="/images/decorative/CTS_logo.webp" alt="CTS Logo" width={100} height={100} className="grayscale brightness-200"/>
                </div>
            </div>
        </PaddingGlobal>
    )
}

