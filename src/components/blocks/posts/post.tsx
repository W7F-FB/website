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
  publicationDate?: string | null
  createdDate?: string | null
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
      <Card className={cn("overflow-hidden group/post rounded-none pt-0", className)}>
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
            <div className="flex flex-row gap-4 md:justify-between text-sm mb-6">
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
      <Card className={cn("flex flex-col md:flex-row overflow-hidden group/post rounded-none p-0 gap-0 bg-card/35 border-border/40", className)}>
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
            <div className="flex flex-row items-center gap-3 md:gap-4 justify-between text-sm flex-wrap">
              {blog.category && (
                <Badge
                  variant="outline"
                  size="sm"
                  className="w-fit shrink-0"
                >
                  {blog.category}
                </Badge>
              )}
              {blog.date && <span className="text-muted-foreground whitespace-nowrap shrink-0">{formatDate(blog.date)}</span>}
            </div>
            <H3 className="lg:text-lg !leading-[1.5]">
              {blog.title}
            </H3>
            {blog.excerpt && (
              <P noSpace className="text-muted-foreground text-sm line-clamp-2">{blog.excerpt}</P>
            )}
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
      <Card className={cn("flex flex-col md:flex-row overflow-hidden group/post rounded-none p-0 gap-0 bg-card/35 border-border/40", className)}>
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
            <div className="flex flex-row items-center gap-3 md:gap-4 justify-between text-sm mb-6 flex-wrap">
              {blog.category && (
                <Badge
                  variant="outline"
                  className="w-fit shrink-0"
                >
                  {blog.category}
                </Badge>
              )}
              {blog.date && <span className="text-muted-foreground text-base whitespace-nowrap shrink-0">{formatDate(blog.date)}</span>}
            </div>
            <H3 className=" text-white lg:text-3xl mb-2">{blog.title}</H3>
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
      <Card className={cn("overflow-hidden group/post rounded-none pt-0 bg-card/35 border-border/40", className)}>
        {blog.image && (
          <div className="relative w-full aspect-[12/8]">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="flex flex-col h-full justify-between">
          <CardHeader className="">
            <div className="flex flex-row items-center gap-3 md:gap-4 justify-between text-sm mb-6 flex-wrap">
              {blog.category && (
                <Badge
                  variant="outline"
                  className="w-fit shrink-0"
                >
                  {blog.category}
                </Badge>
              )}
              {blog.date && <span className="text-muted-foreground whitespace-nowrap shrink-0">{formatDate(blog.date)}</span>}
            </div>
            <H3 className="text-md text-white md:text-2xl mb-2">{blog.title}</H3>
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
      <div className={cn("flex flex-col md:flex-row overflow-hidden group/post rounded-none bg-card/35 border border-border/40", className)}>
        {blog.image && (
          <div className="relative w-full md:w-48  flex-shrink-0">
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
            <H3 className="lg:text-xl text-lg font-semibold text-foreground !leading-[1.2]">
              {blog.title}
            </H3>
            {blog.excerpt && (
              <P noSpace className="text-base text-muted-foreground line-clamp-2">
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

function PostMini({ blog, className }: PostProps) {
  return (
    <PrismicLink href={`/news/${blog.slug}`} className="group/post p-3 bg-gradient-to-r from-muted/30 to-muted/10 self-start">
      <div className={cn("flex flex-col", className)}>
        <H3 className="lg:text-xs text-xs font-semibold text-foreground line-clamp-2 mb-3">
          {blog.title}
        </H3>
        <div className="flex items-center justify-between">
          {blog.date && (
            <span className="text-sm text-muted-foreground">
              {formatDate(blog.date)}
            </span>
          )}
          <ReadMoreButton size="sm" />
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
  PostMini,
}
