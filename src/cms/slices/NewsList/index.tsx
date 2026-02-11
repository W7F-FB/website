import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";

import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/website-base/padding-containers";
import { H2 } from "@/components/website-base/typography";
import { PostCompact } from "@/components/blocks/posts/post";
import { getBlogsByCategory, getAllBlogs } from "@/cms/queries/blog";
import { createClient } from "@/prismicio";
import { mapBlogDocumentToMetadata } from "@/lib/utils";

export type NewsListProps = SliceComponentProps<Content.NewsListSlice>;

export default async function NewsListSlice({ slice }: NewsListProps) {
  const manualPosts = slice.primary.posts?.filter(
    (item) => isFilled.contentRelationship(item.post)
  ) ?? [];

  let blogs;
  if (manualPosts.length > 0) {
    const client = createClient();
    const ids = manualPosts
      .map((item) => isFilled.contentRelationship(item.post) ? item.post.id : null)
      .filter(Boolean) as string[];
    const docs = await client.getByIDs<Content.BlogDocument>(ids);
    // Preserve the manual ordering
    blogs = ids
      .map((id) => docs.results.find((d) => d.id === id))
      .filter((d): d is Content.BlogDocument => d != null);
  } else {
    const category = slice.primary.category;
    blogs = category && category !== "All"
      ? await getBlogsByCategory(category)
      : await getAllBlogs();
  }

  if (!blogs?.length) return null;

  const spaceAbove = slice.primary.space_above !== false;
  const spaceBelow = slice.primary.space_below !== false;

  return (
    <Container maxWidth="lg" className={cn(spaceAbove && "mt-8 md:mt-16", spaceBelow && "mb-8 md:mb-16")}>
      <Section
        padding="md"
        className="grid grid-cols-1 md:grid-cols-3 gap-16"
      >
        <PrismicRichText
          field={slice.primary.heading}
          components={{
            heading2: ({ children }) => (
              <H2 className="uppercase text-3xl">{children}</H2>
            ),
          }}
        />
        <div className="col-span-2 grid grid-cols-1 gap-5">
          <div className="flex flex-col gap-6">
            {blogs.map((p) => (
              <PostCompact
                key={p.uid}
                blog={mapBlogDocumentToMetadata(p)}
              />
            ))}
          </div>
        </div>
      </Section>
    </Container>
  );
}
