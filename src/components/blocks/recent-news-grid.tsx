import { getAllBlogs } from "@/cms/queries/blog";
import { PostGrid } from "@/components/website-base/posts/post-grid";
import { mapBlogDocumentToMetadata } from "@/app/(website)/(subpages)/news/page";
import type { BlogMetadata } from "@/components/website-base/posts/post";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function RecentNewsGrid() {
  const blogs = await getAllBlogs();

  const recentBlogs: BlogMetadata[] = blogs
    .slice(0, 4)
    .map(mapBlogDocumentToMetadata);

  return (
    <div className="space-y-8">
      <PostGrid posts={recentBlogs} />
      <div className="text-center">
        <Button asChild size="skew_lg">
          <Link href="/news">
            <span>All News</span>
          </Link>
        </Button>
      </div>
    </div>
  );
}
