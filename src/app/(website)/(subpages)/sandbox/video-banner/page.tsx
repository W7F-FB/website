import { NavMain } from "@/components/website-base/nav/nav-main";
import { VideoBanner } from "@/components/blocks/video-banner/video-banner";
import { PaddingGlobal } from "@/components/website-base/padding-containers";

export default function SandboxPage() {
    return (
        <>
            <NavMain showBreadcrumbs />
            <PaddingGlobal>
            <div>
            <VideoBanner
                thumbnail="/images/static-media/video-banner.avif"
                videoUrl="https://r2.vidzflow.com/source/a4c227f3-6918-4e29-8c72-b509a9cf3d5c.mp4"
                label="Recap the action"
            />
        </div>
        </PaddingGlobal>
        </>
    )
}