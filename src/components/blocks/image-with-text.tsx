"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { H3, P } from "@/components/website-base/typography"
import { PrismicRichText } from "@prismicio/react";

export type ImageWithTextContent = {
  image: string
  alt: string
  heading?: string
  title: string
  description: any
}

interface ImageWithTextProps
  extends Omit<React.ComponentProps<"div">, "content"> {
  content: ImageWithTextContent
  imagePosition?: "left" | "right"
}

export function ImageWithText({
  content,
  imagePosition = "left",
  className,
  ...props
}: ImageWithTextProps) {
  const isImageLeft = imagePosition === "left"

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-16 items-center",
        className
      )}
      {...props}
    >
      {/* Image */}
      <div
        className={cn(
          "relative w-full h-64 md:h-full",
          isImageLeft ? "order-1" : "order-2"
        )}
      >
        <Image
          src={content.image}
          alt={content.alt}
          fill
          className="object-cover rounded-lg"
        />
      </div>

      {/* Text */}
      <div
        className={cn(
          "flex flex-col justify-center",
          isImageLeft ? "order-2" : "order-1"
        )}
      >
        {content.heading && (
          <P className="uppercase text-sm text-muted-foreground mb-2">
            {content.heading}
          </P>
        )}
        <H3 className="mb-4 mt-4 uppercase">{content.title}</H3>

        <PrismicRichText field={content.description} />
      </div>
    </div>
  )
}
