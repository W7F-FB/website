"use client"

import { cn } from "@/lib/utils"
import { PostCardVert, PostCompact, type BlogMetadata } from "@/components/blocks/posts/post"
import { LinePattern } from "../line-pattern"
import { Button } from "@/components/ui/button"
import { PrismicLink } from "@prismicio/react"

type PostGridProps = {
  posts: BlogMetadata[]
  className?: string
}

function KeepReadingButton() {
  return (
    <Button size="skew_lg" variant="outline_pattern" asChild>
      <PrismicLink href="/news"><span>Keep Reading</span></PrismicLink>
    </Button>
  )
}

export function PostGrid({ posts, className }: PostGridProps) {
  if (!posts || posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      <div className="flex flex-col gap-6 w-full">
        <PostCardVert blog={featured} />
        <LinePattern className="px-8 py-8 flex flex-grow items-end justify-start lg:block hidden">
          <KeepReadingButton />
        </LinePattern>
      </div>

      <div className="flex flex-col gap-6">
        {rest.map((post) => (
          <PostCompact key={post.slug} blog={post} />
        ))}
      </div>
    </div>
  )
}
