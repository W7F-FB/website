import { PaddingGlobal } from "@/components/website-base/padding-containers";
import { H1, P, Subtitle } from "@/components/website-base/typography";
import { CheckoutShow } from "@/components/blocks/checkout/checkout-show";
import { SubpageHeroSecondary } from "@/components/blocks/subpage-hero";
import { Background } from "@/components/ui/background";
import { PalmtreeIcon } from "@/components/website-base/icons";
import Image from "next/image";

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
                <CheckoutShow />
                <div className="flex flex-row gap-6 items-center text-center justify-center py-4 opacity-50">
                    <p>Powered by</p>
                    <Image src="/images/decorative/CTS_logo.webp" alt="CTS Logo" width={100} height={100} className="grayscale brightness-200"/>
                </div>
            </div>
        </PaddingGlobal>
    )
}

