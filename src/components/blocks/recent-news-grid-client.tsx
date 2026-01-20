"use client"

import { PostGrid } from "@/components/blocks/posts/post-grid";
import type { BlogMetadata } from "@/components/blocks/posts/post";

type RecentNewsGridClientProps = {
  posts: BlogMetadata[];
}

export function RecentNewsGridClient({ posts }: RecentNewsGridClientProps) {
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;
    
    if (!dateA && !dateB) {
      const createdA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
      const createdB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
      if (createdB !== createdA) return createdB - createdA;
      return (a.slug || "").localeCompare(b.slug || "");
    }
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    const dateATime = new Date(dateA).setHours(0, 0, 0, 0);
    const dateBTime = new Date(dateB).setHours(0, 0, 0, 0);
    const dateCompare = dateBTime - dateATime;
    
    if (dateCompare !== 0) {
      return dateCompare;
    }
    
    const createdA = a.createdDate ? new Date(a.createdDate).getTime() : 0;
    const createdB = b.createdDate ? new Date(b.createdDate).getTime() : 0;
    if (createdB !== createdA) return createdB - createdA;
    return (a.slug || "").localeCompare(b.slug || "");
  });

  return (
    <div className="space-y-8">
      <PostGrid posts={sortedPosts} />
    </div>
  );
}
