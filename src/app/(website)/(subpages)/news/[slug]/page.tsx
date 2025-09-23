import { notFound } from "next/navigation"
import Image from "next/image"
import { Section } from "@/components/website-base/padding-containers"
import { formatDate } from "@/lib/utils"
import { getBlogBySlug } from "@/cms/queries/blog"
import { mapBlogDocumentToMetadata } from "../page"
import { PrismicRichText } from "@prismicio/react"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { H2, P} from "@/components/website-base/typography";
import { cn } from "@/lib/utils"
import { getAllBlogs } from "@/cms/queries/blog"
import { PostStandard } from "@/components/website-base/posts/post"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const blogDoc = await getBlogBySlug(slug)

  if (!blogDoc) return notFound()

  const blog = mapBlogDocumentToMetadata(blogDoc)
  const allBlogs = await getAllBlogs()
  const relatedBlogs = allBlogs
    .filter((b) => b.uid !== slug)
    .slice(0, 3) 

  return (
    <>
        <Section padding="none" className="prose prose-invert prose-p:mb-2 mt-16">
            <Card className={cn("flex flex-col md:flex-row overflow-hidden group rounded-none p-0")}>
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
                        <H2 className="text-md font-semibold text-white md:text-3xl">{blog.title}</H2>
                        {blog.excerpt && (
                            <P className="text-sm text-white line-clamp-3 !mt-0 mb-4">{blog.excerpt}</P>
                        )}
                    </CardHeader>
                </div>

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
            </Card>
        
        <div className="max-w-3xl mx-auto mt-16">
            {blogDoc.data.content && (
                <PrismicRichText
                    field={blogDoc.data.content}
                    components={{
                        paragraph: ({ children }) => <p className="mb-6">{children}</p>,
                    }}
                />

            )}

            <div className="border-b border-gray-200 dark:border-gray-700 mt-16" />

        </div>
        </Section>

        {relatedBlogs.length > 0 && (
            <Section padding="none" className="max-w-5xl mx-auto mt-10">
                <h2 className="text-xl md:text-3xl font-bold mb-6">Keep Reading</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relatedBlogs.map((b) => (
                        <PostStandard
                        key={b.uid}
                        blog={mapBlogDocumentToMetadata(b)}
                        />
                    ))}
                </div>
            </Section>
        )}
    </>
  )
}
