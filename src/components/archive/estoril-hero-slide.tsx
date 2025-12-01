import Image from "next/image";
import Link from "next/link";

import { HeroSliderSlide, HeroSliderSlideBackground, HeroSliderSlideContent } from "@/components/blocks/hero-slider";
import { H1, P, Subtitle, TextProtect } from "@/components/website-base/typography";
import { Button } from "@/components/ui/button";

export function EstorilHeroSlide() {
    return (
        <HeroSliderSlide className="grid grid-cols-2">
            <HeroSliderSlideBackground>
                <Image src="/images/static-media/estoril-champs.avif" alt="Hero Slider 1" fill className="object-cover object-bottom" />
                <div className="absolute bottom-0 left-0 right-0 h-full bg-gradient-to-r from-background/95 to-transparent" />
            </HeroSliderSlideBackground>
            <HeroSliderSlideContent className="max-w-3xl justify-self-start pr-48 flex items-end grid justify-items-start">
                <TextProtect className="relative z-10 space-y-5">
                    <Subtitle className="text-primary text-xl">Recap</Subtitle>
                    <H1 className="font-proxima uppercase font-black text-6xl">Estoril,<br />Portugal</H1>
                    <P noSpace className="text-xl text-balance font-headers font-medium mt-3">Bayern take home the title and prize pool in an action packed event.</P>
                </TextProtect>
                <div className="mt-10 flex gap-4">
                    <Button asChild size="skew_lg" variant="secondary"><Link href="/tournament/estoril-portugal"><span>View Recap</span></Link></Button>
                </div>
            </HeroSliderSlideContent>
        </HeroSliderSlide>
    );
}

