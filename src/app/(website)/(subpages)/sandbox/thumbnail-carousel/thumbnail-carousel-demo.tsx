"use client"

import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import {
  ThumbnailCarousel,
  ThumbnailCarouselContent,
  ThumbnailCarouselItem,
  ThumbnailCarouselPrevious,
  ThumbnailCarouselNext,
  useThumbnailCarousel,
} from "@/components/ui/thumbnail-carousel"
import Image from "next/image"
import { cn } from "@/lib/utils"

const images = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  src: "/images/static-media/Opengraph.jpg",
  alt: "OpenGraph Image",
  thumbnail: "/images/static-media/Opengraph.jpg",
}))


function ThumbnailItem({ image }: { image: typeof images[0] }) {
  const { selectedIndex } = useThumbnailCarousel()
  const index = images.findIndex((img) => img.id === image.id)
  const isSelected = selectedIndex === index

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-md border-2 transition-all",
        isSelected
          ? "border-primary ring-2 ring-primary/20"
          : "border-transparent opacity-60 hover:opacity-100"
      )}
    >
      <Image
        src={image.thumbnail}
        alt={image.alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 20vw, 15vw"
      />
    </div>
  )
}

export function ThumbnailCarouselDemo() {
  const [mainApi, setMainApi] = React.useState<CarouselApi>()

  return (
    <div className="space-y-4">
      <Carousel setApi={setMainApi} className="w-full">
        <CarouselContent>
          {images.map((image) => (
            <CarouselItem key={image.id}>
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <ThumbnailCarousel mainApi={mainApi} className="relative px-12">
        <ThumbnailCarouselContent>
          {images.map((image, index) => (
            <ThumbnailCarouselItem
              key={image.id}
              index={index}
              className="basis-1/5 md:basis-1/7"
            >
              <ThumbnailItem image={image} />
            </ThumbnailCarouselItem>
          ))}
        </ThumbnailCarouselContent>
        <ThumbnailCarouselPrevious />
        <ThumbnailCarouselNext />
      </ThumbnailCarousel>
    </div>
  )
}

