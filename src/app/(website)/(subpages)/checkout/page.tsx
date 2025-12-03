import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PaddingGlobal } from "@/components/website-base/padding-containers";
import CheckoutPageContent from "./page-content";

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