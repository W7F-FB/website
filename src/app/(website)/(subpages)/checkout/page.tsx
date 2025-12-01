import { NavMain } from "@/components/website-base/nav/nav-main";
import CheckoutPageContent from "./page-content";

export default function CheckoutPage() {
    return (
        <>
            <NavMain showBreadcrumbs />
            <CheckoutPageContent />
        </>
    )
}