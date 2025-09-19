"use client"

import { cn } from "@/lib/utils"
import { PostCardVert, PostCompact, PostStandard, PostCardHoriz, type BlogMetadata } from "@/components/website-base/posts/post"

type PostGridProps = {
  posts: BlogMetadata[]
  className?: string
}

export function PostGrid({ posts, className }: PostGridProps) {
  if (!posts || posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-6", className)}>
      <div className="space-y-6">
        <PostStandard blog={featured} />
      </div>

      <div className="flex flex-col gap-6">
        {rest.map((post) => (
          <PostCompact key={post.id} blog={post} />
        ))}
      </div>
    </div>
  )
}
