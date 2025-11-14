import { NavMain } from "@/components/website-base/nav/nav-main";
import { Container, Section, PaddingGlobal } from "@/components/website-base/padding-containers";
import { H1, P } from "@/components/website-base/typography";
import { CheckoutShow } from "@/components/blocks/checkout/checkout-show";
import Image from "next/image";

export default function CheckoutPage() {

    return (
        <>
            <NavMain showBreadcrumbs />
            <PaddingGlobal>
            <Container maxWidth="lg">
            <Section padding="sm">
                <div className="flex flex-col items-center justify-center text-center">
                    <H1 className="uppercase text-2xl md:text-6xl text-center md:my-4">Purchase Tickets</H1>
                    <P noSpace>Beyond Bancard Field</P>
                    <P noSpace>Fort Lauderdale, FL, USA</P>
                    <P noSpace>December 5-7, 2025</P>
                    <P className="max-w-4xl mx-auto py-8">Experience a new brand of women&apos;s football as some of the world&apos;s best clubs clash in the fast-paced 7v7 format. Three days of nonstop action, December 5–7 at Beyond Bancard Stadium. Don&apos;t miss the second edition of this global showdown with $5 million up for grabs. Get your tickets now!</P>
                </div>
            </Section>
            <CheckoutShow />
            <div className="flex flex-row gap-6 items-center text-center justify-center py-4 opacity-50">
                <p>Powered by</p>
                <Image src="/images/decorative/CTS_logo.webp" alt="CTS Logo" width={100} height={100} className="grayscale brightness-200"/>
            </div>
        </Container>
        </PaddingGlobal>
        </>
    )
}