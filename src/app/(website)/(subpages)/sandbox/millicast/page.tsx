import type { Metadata } from "next";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers";

export const metadata: Metadata = {
  title: "Dolby Ref Cam - World Sevens Football",
  description: "Dolby Ref Cam stream viewer.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function MillicastSandboxPage() {
  return (
    <>
      <NavMain showBreadcrumbs />
      <main className="flex-grow min-h-[30rem]">
        <PaddingGlobal>
          <Container>
            <Section padding="md">
              <div className="space-y-10">
                <h1 className="text-2xl font-bold">Dolby Ref Cam Stream</h1>
                <div className="w-full aspect-video max-w-4xl">
                  <iframe 
                    src="https://viewer.millicast.com/?streamId=FBb77b/Ref_Cam_Stream&token=48b2e9f09e96b1f82b920b1bf8032282b6ec917e332c8801805f968d032ca93f" 
                    allowFullScreen 
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            </Section>
          </Container>
        </PaddingGlobal>
      </main>
      <Footer />
    </>
  )
}

