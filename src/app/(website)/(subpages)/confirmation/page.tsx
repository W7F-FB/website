import { NavMain } from "@/components/website-base/nav/nav-main";
import { Container, Section, PaddingGlobal } from "@/components/website-base/padding-containers";
import { Card, CardContent } from "@/components/ui/card";
import { H1, P } from "@/components/website-base/typography";
import Link from "next/link";
import Image from "next/image";


export default function ConfirmationPage() {

    return (
        <>
            <NavMain showBreadcrumbs />
            <PaddingGlobal>
            <Container maxWidth="lg">
            <Section padding="sm">
                <div className="flex flex-col items-center justify-center text-center">
                    <H1 className="uppercase text-2xl md:text-6xl text-center md:my-8">Thank you for your purchase</H1>
                    <P noSpace>Fort Lauderdale, FL, USA</P>
                    <P noSpace>December 5-7, 2025</P>
                </div>
            </Section>
            <Section padding="sm">
                <Card>
                    <CardContent>
                        <div className="space-y-6 flex flex-col items-center justify-center text-center">
                            <P className="max-w-4xl mx-auto">Your tickets have been emailed to you. If you happen to misplace them, no worries – you can also access them in the My Tickets section after logging in at <Link href="https://www.squadup.com" target="_blank">www.squadup.com</Link> or via the SquadUP app on iOS.</P>
                            <Link href="https://apps.apple.com/us/app/squadup/id891449226" target="_blank">
                                <Image src="/images/decorative/app_store_download.svg" alt="SquadUp" width={150} height={150} />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </Section>
        </Container>
        </PaddingGlobal>
        </>
    )
}