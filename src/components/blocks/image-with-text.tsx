"use client"

import * as React from "react"
import Image from "next/image"
import { PrismicRichText } from "@prismicio/react";
import type * as prismic from "@prismicio/client";

import { cn } from "@/lib/utils"
import { H3, P, Subtitle } from "@/components/website-base/typography"

export type ImageWithTextContent = {
  image: string
  alt: string
  heading?: string
  title: string
  description: prismic.RichTextField
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
      {content.image && (
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
            className="object-cover"
          />
        </div>
      )}

      {/* Text */}
      <div
        className={cn(
          "flex flex-col justify-center py-0 md:py-8",
          isImageLeft ? "order-2" : "order-1"
        )}
      >
        {content.heading && (
          <Subtitle className="uppercase text-sm mb-2">
            {content.heading}
          </Subtitle>
        )}
        <H3 className="mb-4 mt-4 uppercase text-2xl lg:text-3xl">{content.title}</H3>

        <div className="text-muted-foreground">
          <PrismicRichText
            field={content.description}
            components={{
              paragraph: ({ children }) => <P>{children}</P>,
              hyperlink: ({ node, children }) => {
                const isExternal = node.data.link_type === "Web"
                return (
                  <a
                    href={node.data.url || ""}
                    className="underline underline-offset-2 text-primary"
                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {children}
                  </a>
                )
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
