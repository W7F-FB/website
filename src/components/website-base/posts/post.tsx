"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { H2, H3, P} from "@/components/website-base/typography";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { formatDate } from "@/lib/utils";

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
    <Card className={cn("overflow-hidden group rounded-none py-0", className)}>
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
      <CardHeader>
        <div className="flex-col md:flex-row flex justify-between text-sm mb-2">
            {blog.category && (
              <Badge
                variant="secondary"
                className="text-accent-foreground rounded-none uppercase text-md"
              >
                {blog.category}
              </Badge>
            )}
            {blog.date && <span className="text-white text-md">{formatDate(blog.date)}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <H2 className="text-md font-semibold text-white md:text-2xl">{blog.title}</H2>
        {blog.excerpt && (
          <P className="text-sm text-white line-clamp-3 !mt-0 mb-4">{blog.excerpt}</P>
        )}
        <Link href={`/news/${blog.slug}`} passHref>
          <Button variant="link" className="text-accent-foreground p-0 hover:underline text-xs font-light">
              Read more →
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
}

function PostCompact({ blog, className }: PostProps) {
  return (
    <div className={cn("flex flex-col md:flex-row overflow-hidden group", className)}>
      {blog.image && (
        <div className="relative w-full md:w-[40%] aspect-[4/3] flex-shrink-0">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col justify-center w-full md:w-[60%] p-6">
        <div className="flex flex-col md:flex-row justify-start text-sm mb-2 gap-4">
          {blog.category && (
            <Badge
              variant="secondary"
              className="text-accent-foreground rounded-none uppercase text-sm"
            >
              {blog.category}
            </Badge>
          )}
          {blog.date && <span className="text-white text-md">{formatDate(blog.date)}</span>}
        </div>
        <H3 className="text-md font-semibold text-white md:text-xl">
          {blog.title}
        </H3>
        <Link href={`/news/${blog.slug}`} passHref>
          <Button
            variant="link"
            className="text-accent-foreground p-0 hover:underline text-xs font-light justify-start mt-2"
          >
            Read more →
          </Button>
        </Link>
      </div>
    </div>
  )
}

function PostCardHoriz({ blog, className }: PostProps) {
  return (
    <Card className={cn("flex flex-col md:flex-row overflow-hidden group rounded-none p-0", className)}>
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
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6">
        <CardHeader className="p-0">
          <div className="flex-col md:flex-row flex justify-between text-sm mb-2">
            {blog.category && (
              <Badge
                variant="secondary"
                className="text-accent-foreground rounded-none uppercase text-md"
              >
                {blog.category}
              </Badge>
            )}
            {blog.date && <span className="text-white text-md">{formatDate(blog.date)}</span>}
          </div>
          <H2 className="text-md font-semibold text-white md:text-2xl">{blog.title}</H2>
          {blog.excerpt && (
            <P className="text-sm text-white line-clamp-3 !mt-0 mb-4">{blog.excerpt}</P>
          )}
        </CardHeader>
        <CardFooter className="p-0 mt-4">
          <Link href={`/news/${blog.slug}`} passHref>
            <Button
              variant="link"
              className="text-accent-foreground p-0 hover:underline text-xs font-light"
            >
              Read more →
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  )
}

function PostCardVert({ blog, className }: PostProps) {
  return (
     <Card className={cn("flex flex-col md:flex-row overflow-hidden group rounded-none p-0", className)}>
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
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6">
        <CardHeader className="p-0">
          <div className="flex-col md:flex-row flex justify-start text-sm mb-2 gap-4">
            {blog.category && (
              <Badge
                variant="secondary"
                className="text-accent-foreground rounded-none uppercase text-md"
              >
                {blog.category}
              </Badge>
            )}
            {blog.date && <span className="text-white text-md">{formatDate(blog.date)}</span>}
          </div>
          <H2 className="text-md font-semibold text-white md:text-2xl">{blog.title}</H2>
          {blog.excerpt && (
            <P className="text-sm text-white line-clamp-3 !mt-0 mb-4">{blog.excerpt}</P>
          )}
        </CardHeader>
        <CardFooter className="p-0 mt-4">
          <Link href={`/news/${blog.slug}`} passHref>
            <Button
              variant="link"
              className="text-accent-foreground p-0 hover:underline text-xs font-light"
            >
              Read more →
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  )
}

export {
  PostStandard,
  PostCompact,
  PostCardHoriz,
  PostCardVert,
}
