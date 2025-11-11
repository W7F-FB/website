"use client"

import * as React from "react"
import Image from "next/image"
import { PrismicLink } from "@prismicio/react"

import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { H3, P } from "@/components/website-base/typography";
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils";
import { ReadMoreButton } from "@/components/ui/read-more-button";

export type BlogMetadata = {
  title: string
  slug: string
  excerpt?: string | null
  image?: string
  category?: string | null
  author?: string | null
  date?: string | null
}

export type Blog = {
  metadata: BlogMetadata
  content: string // full blog body (Markdown/HTML/etc.)
}

export type PostProps = {
  blog: BlogMetadata
  className?: string
}

function PostStandard({ blog, className }: PostProps) {
  return (
    <PrismicLink href={`/news/${blog.slug}`}>
      <Card className={cn("overflow-hidden group rounded-none pt-0", className)}>
        {blog.image && (
          <div className="relative w-full h-64">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between">
          <CardHeader className="">
            <div className="flex-col md:flex-row flex justify-between text-sm mb-6">
              {blog.category && (
                <Badge
                  variant="outline"
                >
                  {blog.category}
                </Badge>
              )}
              {blog.date && <span className="text-muted-foreground text-md">{formatDate(blog.date)}</span>}
            </div>
            <H3 className="text-md font-semibold text-white md:text-2xl mb-2">{blog.title}</H3>
            {blog.excerpt && (
              <P noSpace className="text-muted-foreground line-clamp-3 mb-4">{blog.excerpt}</P>
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

function PostCompact({ blog, className }: PostProps) {
  return (
    <PrismicLink href={`/news/${blog.slug}`}>
      <Card className={cn("flex flex-col md:flex-row overflow-hidden group rounded-none p-0 gap-0 bg-card/35 border-border/40", className)}>
        {blog.image && (
          <div className="relative w-full md:w-[40%] aspect-square flex-shrink-0">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between w-full md:w-[60%] py-6 gap-8">
          <CardHeader className="gap-4">
            <div className="flex flex-col md:flex-row items-center justify-between text-sm gap-4">
              {blog.category && (
                <Badge
                  variant="outline"
                  size="sm"
                >
                  {blog.category}
                </Badge>
              )}
              {blog.date && <span className="text-muted-foreground">{formatDate(blog.date)}</span>}
            </div>
            <H3 className="text-md font-semibold text-white md:text-lg !leading-[1.5]">
              {blog.title}
            </H3>
          </CardHeader>
          <CardFooter className="pt-0">
            <ReadMoreButton />
          </CardFooter>
        </div>
      </Card>
    </PrismicLink>
  )
}

function PostCardHoriz({ blog, className }: PostProps) {
  return (
    <PrismicLink href={`/news/${blog.slug}`}>
      <Card className={cn("flex flex-col md:flex-row overflow-hidden group rounded-none p-0 gap-0 bg-card/35 border-border/40", className)}>
        {blog.image && (
          <div className="relative w-full md:w-1/2 aspect-[4/3] flex-shrink-0">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between w-full md:w-1/2 py-8">
          <CardHeader>
            <div className="flex-col md:flex-row flex justify-between text-sm mb-6 items-center">
              {blog.category && (
                <Badge
                  variant="outline"
                >
                  {blog.category}
                </Badge>

              )}
              {blog.date && <span className="text-muted-foreground text-base">{formatDate(blog.date)}</span>}
            </div>
            <H3 className="text-md font-semibold text-white md:text-3xl mb-2">{blog.title}</H3>
            {blog.excerpt && (
              <P noSpace className="text-lg text-muted-foreground line-clamp-3 mb-4">{blog.excerpt}</P>
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

function PostCardVert({ blog, className }: PostProps) {
  return (
    <PrismicLink href={`/news/${blog.slug}`}>
      <Card className={cn("overflow-hidden group rounded-none pt-0 bg-card/35 border-border/40", className)}>
        {blog.image && (
          <div className="relative w-full aspect-video">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between">
          <CardHeader className="">
            <div className="flex-col md:flex-row flex justify-between text-sm mb-6">
              {blog.category && (
                <Badge
                  variant="outline"
                >
                  {blog.category}
                </Badge>
              )}
              {blog.date && <span className="text-muted-foreground">{formatDate(blog.date)}</span>}
            </div>
            <H3 className="text-md font-semibold text-white md:text-2xl mb-2">{blog.title}</H3>
            {blog.excerpt && (
              <P noSpace className="text-muted-foreground line-clamp-3 mb-4">{blog.excerpt}</P>
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

function PostBanner({ blog, className }: PostProps) {
  return (
    <PrismicLink href={`/news/${blog.slug}`}>
      <div className={cn("flex flex-col md:flex-row overflow-hidden group rounded-none bg-card/35 border border-border/40", className)}>
        {blog.image && (
          <div className="relative w-full md:w-[280px] aspect-[4/3] md:aspect-auto md:h-auto flex-shrink-0">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col justify-between flex-1 py-8 px-10 gap-6">
          <div className="flex flex-col gap-4">
            <H3 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-white !leading-[1.2]">
              {blog.title}
            </H3>
            {blog.excerpt && (
              <P noSpace className="text-base md:text-lg text-muted-foreground line-clamp-2">
                {blog.excerpt}
              </P>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {blog.date && (
              <span className="text-base text-muted-foreground">
                {formatDate(blog.date)}
              </span>
            )}
            <ReadMoreButton />
          </div>
        </div>
      </div>
    </PrismicLink>
  )
}

export {
  PostStandard,
  PostCompact,
  PostCardHoriz,
  PostCardVert,
  PostBanner,
}
