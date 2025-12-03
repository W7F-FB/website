import type { Metadata } from "next";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PaddingGlobal } from "@/components/website-base/padding-containers";
import CheckoutPageContent from "./page-content";

export const metadata: Metadata = {
    title: "Checkout - World Sevens Football",
    description: "Complete your ticket purchase for World Sevens Football tournaments.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Checkout - World Sevens Football",
        description: "Complete your ticket purchase for World Sevens Football tournaments.",
        url: "https://worldsevensfootball.com/checkout",
        siteName: "World Sevens Football",
        type: "website",
        images: [
            {
                url: "https://worldsevensfootball.com/images/static-media/Opengraph.jpg",
                width: 1200,
                height: 630,
                alt: "World Sevens Football",
            }
        ],
    },
}

export default function CheckoutPage() {
    return (
        <>
            <NavMain showBreadcrumbs />
            <main className="flex-grow min-h-[30rem]">
                <div>
                    <PaddingGlobal>
                        <CheckoutPageContent />
                    </PaddingGlobal>
                </div>
            </main>
            <Footer />
        </>
    )
}