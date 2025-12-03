import type { Metadata } from "next";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { VideoBanner } from "@/components/blocks/video-banner/video-banner";
import { PaddingGlobal } from "@/components/website-base/padding-containers";

export const metadata: Metadata = {
  title: "Video Banner Sandbox - World Sevens Football",
  description: "Development sandbox for testing video banner components.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function SandboxPage() {
    return (
        <>
            <NavMain showBreadcrumbs />
            <main className="flex-grow min-h-[30rem]">
                <PaddingGlobal>
            <div>
            <VideoBanner
                thumbnail="/images/static-media/video-banner.avif"
                videoUrl="https://r2.vidzflow.com/source/a4c227f3-6918-4e29-8c72-b509a9cf3d5c.mp4"
                label="Recap the action"
            />
        </div>
        </PaddingGlobal>
            </main>
            <Footer />
        </>
    )
}