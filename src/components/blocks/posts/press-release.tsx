"use client"

import * as React from "react"
import { PrismicLink } from "@prismicio/react"

import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { H3, P } from "@/components/website-base/typography"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"
import { ReadMoreButton } from "@/components/ui/read-more-button"
import type { PostProps } from "./post"

export function PressReleaseCard({ blog, className }: PostProps) {
  return (
    <PrismicLink href={`/news/${blog.slug}`}>
      <Card
        className={cn(
          "flex flex-col overflow-hidden group/post rounded-none p-0 bg-card/35 border-border/40",
          className
        )}
      >
        <div className="flex flex-col justify-between w-full py-8">
          <CardHeader>
            <div className="flex flex-row items-center gap-3 md:gap-4 justify-between text-sm mb-4 flex-wrap">
              <Badge variant="outline" className="w-fit shrink-0">
                Press Release
              </Badge>
              {blog.date && (
                <span className="text-muted-foreground text-base whitespace-nowrap shrink-0">
                  {formatDate(blog.date)}
                </span>
              )}
            </div>
            <H3 className="text-white lg:text-2xl mb-2">{blog.title}</H3>
            {blog.excerpt && (
              <P noSpace className="text-muted-foreground line-clamp-3 mb-4">
                {blog.excerpt}
              </P>
            )}
          </CardHeader>
          <CardFooter className="pt-6">
            <ReadMoreButton />
          </CardFooter>
        </div>
      </Card>
    </PrismicLink>
  )
}
