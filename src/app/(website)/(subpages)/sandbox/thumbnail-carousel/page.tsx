import type { Metadata } from "next";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"

export const metadata: Metadata = {
  title: "Thumbnail Carousel Sandbox - World Sevens Football",
  description: "Development sandbox for testing thumbnail carousel components.",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function ThumbnailCarouselSandboxPage() {
  return (
    <>
      <NavMain showBreadcrumbs />
      <main className="flex-grow min-h-[30rem]">
        <PaddingGlobal>
      <Container>
      <Section padding="md">
        <div className="space-y-10">
          <p className="text-muted-foreground">Thumbnail Carousel sandbox page</p>
        </div>
      </Section>
    </Container>
    </PaddingGlobal>
      </main>
      <Footer />
    </>
  )
}
