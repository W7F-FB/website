import { NavMain } from "@/components/website-base/nav/nav-main"
import { Footer } from "@/components/website-base/footer/footer-main"
import ContactPageContent from "./page-content"

export default function ContactPage() {
    return (
        <>
            <NavMain showBreadcrumbs />
            <main className="flex-grow min-h-[30rem]">
                <ContactPageContent />
            </main>
            <Footer />
        </>
    )
}
