import type { Metadata } from "next"
import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"
import { PaddingGlobal } from "@/components/website-base/padding-containers"
import ContactPageContent from "./page-content"

export const metadata: Metadata = {
    title: "Contact Us - World Sevens Football",
    description: "Get in touch with World Sevens Football. Contact us for inquiries about tournaments, partnerships, media requests, or general information about 7v7 elite soccer.",
    openGraph: {
        title: "Contact Us - World Sevens Football",
        description: "Get in touch with World Sevens Football. Contact us for inquiries about tournaments, partnerships, media requests, or general information about 7v7 elite soccer.",
        url: "https://worldsevensfootball.com/contact",
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
    twitter: {
        card: "summary_large_image",
        title: "Contact Us - World Sevens Football",
        description: "Get in touch with World Sevens Football. Contact us for inquiries about tournaments, partnerships, media requests, or general information about 7v7 elite soccer.",
        creator: "@worldsevens",
    },
}

export default function ContactPage() {
    return (
        <>
            <NavMain showBreadcrumbs />
            <main className="flex-grow min-h-[30rem]">
                <div>
                    <PaddingGlobal>
                        <ContactPageContent />
                    </PaddingGlobal>
                </div>
            </main>
            <Footer />
        </>
    )
}
