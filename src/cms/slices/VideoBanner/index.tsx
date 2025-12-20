import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";

import { Container, Section } from "@/components/website-base/padding-containers";
import { VideoBanner as VideoBannerComponent } from "@/components/blocks/video-banner/video-banner";

/**
 * Props for `VideoBanner`.
 */
export type VideoBannerProps = SliceComponentProps<Content.VideoBannerSlice>;

/**
 * Component for "VideoBanner" Slices.
 */
const VideoBanner: FC<VideoBannerProps> = ({ slice }) => {
  const { thumbnail, video, label, size } = slice.primary;

  const getVideoUrl = () => {
    if (!isFilled.link(video)) return null;
    return video.url || null;
  };

  const videoUrl = getVideoUrl();
  const thumbnailUrl = isFilled.image(thumbnail) ? thumbnail.url || "" : "";
  const hasLabel = isFilled.keyText(label);
  const bannerSize = (isFilled.select(size) ? size : "lg") as "sm" | "lg";

  if (!videoUrl) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <Section padding="md">
          <VideoBannerComponent
            thumbnail={thumbnailUrl}
            videoUrl={videoUrl}
            label={hasLabel ? label : undefined}
            size={bannerSize}
          />
        </Section>
      </Container>
    </section>
  );
};

export default VideoBanner;
