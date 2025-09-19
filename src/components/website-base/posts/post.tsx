"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { H2, H3, P} from "@/components/website-base/typography";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type BlogMetadata = {
  id: string
  title: string
  excerpt?: string
  image?: string
  category?: string
  author?: string
  date?: string
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
    <Card className={cn("overflow-hidden group rounded-none", className)}>
      {blog.image && (
        <div className="relative w-full h-64">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader>
        <div className="flex-col md:flex-row flex justify-between text-sm mb-2">
            {blog.category && (
              <Badge
                variant="secondary"
                className="text-[var(--color-emerald-400)] rounded-none uppercase text-md"
              >
                {blog.category}
              </Badge>
            )}
            {blog.date && <span className="text-white text-md">{blog.date}</span>}
        </div>
      </CardHeader>
      <CardContent>
        <H2 className="text-md font-semibold text-white md:text-2xl">{blog.title}</H2>
        {blog.excerpt && (
          <P className="text-sm text-white line-clamp-3 !mt-0 mb-4">{blog.excerpt}</P>
        )}
        <Button variant="link" className="text-[var(--color-emerald-400)] p-0 hover:underline text-xs font-light">
            Read more →
        </Button>
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
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col justify-center w-full md:w-[60%] p-6">
        <div className="flex flex-col md:flex-row justify-start text-sm mb-2 gap-4">
          {blog.category && (
            <Badge
              variant="secondary"
              className="text-[var(--color-emerald-400)] rounded-none uppercase text-sm"
            >
              {blog.category}
            </Badge>
          )}
          {blog.date && <span className="text-white text-md">{blog.date}</span>}
        </div>
        <H3 className="text-md font-semibold text-white md:text-xl">
          {blog.title}
        </H3>
        <Button
          variant="link"
          className="text-[var(--color-emerald-400)] p-0 hover:underline text-xs font-light justify-start mt-2"
        >
          Read more →
        </Button>
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
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6">
        <CardHeader className="p-0">
          <div className="flex-col md:flex-row flex justify-between text-sm mb-2">
            {blog.category && (
              <Badge
                variant="secondary"
                className="text-[var(--color-emerald-400)] rounded-none uppercase text-md"
              >
                {blog.category}
              </Badge>
            )}
            {blog.date && <span className="text-white text-md">{blog.date}</span>}
          </div>
          <H2 className="text-md font-semibold text-white md:text-2xl">{blog.title}</H2>
          {blog.excerpt && (
            <P className="text-sm text-white line-clamp-3 !mt-0 mb-4">{blog.excerpt}</P>
          )}
        </CardHeader>
        <CardFooter className="p-0 mt-4">
          <Button
            variant="link"
            className="text-[var(--color-emerald-400)] p-0 hover:underline text-xs font-light"
          >
            Read more →
          </Button>
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
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-col justify-between w-full md:w-1/2 p-6">
        <CardHeader className="p-0">
          <div className="flex-col md:flex-row flex justify-start text-sm mb-2 gap-4">
            {blog.category && (
              <Badge
                variant="secondary"
                className="text-[var(--color-emerald-400)] rounded-none uppercase text-md"
              >
                {blog.category}
              </Badge>
            )}
            {blog.date && <span className="text-white text-md">{blog.date}</span>}
          </div>
          <H2 className="text-md font-semibold text-white md:text-2xl">{blog.title}</H2>
          {blog.excerpt && (
            <P className="text-sm text-white line-clamp-3 !mt-0 mb-4">{blog.excerpt}</P>
          )}
        </CardHeader>
        <CardFooter className="p-0 mt-4">
          <Button
            variant="link"
            className="text-[var(--color-emerald-400)] p-0 hover:underline text-xs font-light"
          >
            Read more →
          </Button>
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
