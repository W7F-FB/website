"use client"

import { PostGrid } from "@/components/blocks/posts/post-grid";
import type { BlogMetadata } from "@/components/blocks/posts/post";

type RecentNewsGridClientProps = {
  posts: BlogMetadata[];
}

export function RecentNewsGridClient({ posts }: RecentNewsGridClientProps) {
  return (
    <div className="space-y-8">
      <PostGrid posts={posts} />
    </div>
  );
}
