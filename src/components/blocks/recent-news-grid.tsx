import { getAllNews } from "@/cms/queries/blog";
import { PostGrid } from "@/components/blocks/posts/post-grid";
import { mapBlogDocumentToMetadata } from "@/lib/utils";
import type { BlogMetadata } from "@/components/blocks/posts/post";

export async function RecentNewsGrid() {
  const blogs = await getAllNews();

  const recentBlogs: BlogMetadata[] = blogs
    .slice(0, 4)
    .map(mapBlogDocumentToMetadata);

  return (
    <div className="space-y-8">
      <PostGrid posts={recentBlogs} />
    </div>
  );
}
