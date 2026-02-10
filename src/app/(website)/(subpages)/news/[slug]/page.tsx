import { notFound } from "next/navigation"
import Image from "next/image"
import { PrismicRichText } from "@prismicio/react"
import * as prismic from "@prismicio/client"

import { getBlogBySlug } from "@/cms/queries/blog"
import { formatDate } from "@/lib/utils"
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { H1, H2, H3, H4, P, Blockquote, List } from "@/components/website-base/typography";
import { cn } from "@/lib/utils"
import { getAllBlogs, getBlogsByCategory } from "@/cms/queries/blog"
import { PostCardVert } from "@/components/blocks/posts/post"
import { PressReleaseCard } from "@/components/blocks/posts/press-release"
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { Separator } from "@/components/ui/separator";

import { mapBlogDocumentToMetadata } from "@/lib/utils"

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const blogDoc = await getBlogBySlug(slug)

  if (!blogDoc) {
    return {
      title: "News - World Sevens Football",
      description: "Latest news and updates from World Sevens Football.",
    }
  }

  const blog = mapBlogDocumentToMetadata(blogDoc)
  const title = `${blog.title} - World Sevens Football`
  const description = blog.excerpt || "Latest news and updates from World Sevens Football."

  const ogImage = blog.image
    ? {
        url: blog.image,
        width: 1200,
        height: 630,
        alt: blog.title,
      }
    : {
        url: "https://worldsevensfootball.com/images/static-media/Opengraph.jpg",
        width: 1200,
        height: 630,
        alt: "World Sevens Football",
      }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://worldsevensfootball.com/news/${slug}`,
      siteName: "World Sevens Football",
      type: "article",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@worldsevens",
    },
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const blogDoc = await getBlogBySlug(slug)

  if (!blogDoc) return notFound()

  const blog = mapBlogDocumentToMetadata(blogDoc)
  const isPressRelease = blog.category === "Press Releases"

  const relatedSource = isPressRelease
    ? await getBlogsByCategory("Press Releases")
    : await getAllBlogs()
  const relatedBlogs = relatedSource
    .filter((b) => b.uid !== slug)
    .slice(0, isPressRelease ? 3 : 2)

  return (
    <>
        <NavMain showBreadcrumbs />
        <main className="flex-grow min-h-[30rem]">
            <div>
                <PaddingGlobal>
        <Container maxWidth="lg">
        <Section padding="none" className="prose prose-invert prose-p:mb-2 mt-16">
            <Card className={cn("flex flex-col overflow-hidden group rounded-none p-0 bg-transparent border-0", blog.image ? "md:flex-row gap-16" : "items-center text-center gap-6")}>
                <div className={cn("flex flex-col justify-between w-full px-0 py-6 md:mt-6", blog.image ? "md:w-1/2" : "max-w-5xl mx-auto")}>
                    <CardHeader className="p-0">
                        <div className={cn("flex items-center text-sm mb-2 gap-4", blog.image ? "flex-row justify-between" : "flex-col items-center gap-2")}>
                            {blog.category && (
                                <Badge
                                    variant="outline"
                                    className="text-accent-foreground rounded-none uppercase text-md"
                                >
                                    {blog.category}
                                </Badge>
                            )}
                            {blog.date && <span className="text-muted-foreground text-lg whitespace-nowrap">{formatDate(blog.date)}</span>}
                        </div>
                        <H2 className="text-2xl font-semibold text-white md:text-3xl">{blog.title}</H2>
                        {blog.excerpt && (
                            <P noSpace className="text-base md:text-lg line-clamp-3 mb-4">{blog.excerpt}</P>
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
                        heading1: ({ children }) => <H1 className="mt-8 mb-4">{children}</H1>,
                        heading2: ({ children }) => <H2 className="mt-8 mb-4">{children}</H2>,
                        heading3: ({ children }) => <H3 className="mt-6 mb-3">{children}</H3>,
                        heading4: ({ children }) => <H4 className="mt-6 mb-3">{children}</H4>,
                        paragraph: ({ children }) => <P className="mb-6">{children}</P>,
                        preformatted: ({ children }) => <Blockquote className="my-6">{children}</Blockquote>,
                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        listItem: ({ children }) => <li className="mb-2">{children}</li>,
                        oListItem: ({ children }) => <li className="mb-2">{children}</li>,
                        list: ({ children }) => <List className="my-6">{children}</List>,
                        oList: ({ children }) => <ol className="my-6 ml-6 list-decimal space-y-2">{children}</ol>,
                        hyperlink: ({ node, children }) => {
                            const isExternal = node.data.link_type === "Web"
                            return (
                                <a
                                    href={node.data.url || ""}
                                    className="underline underline-offset-2 text-primary hover:text-primary/80"
                                    {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                                >
                                    {children}
                                </a>
                            )
                        },
                        image: ({ node }) => {
                            if (!prismic.isFilled.image(node)) return null
                            
                            return (
                                <div className="my-8">
                                    <Image
                                        src={node.url}
                                        alt={node.alt || ""}
                                        width={node.dimensions?.width || 1200}
                                        height={node.dimensions?.height || 800}
                                        className="h-auto w-full"
                                    />
                                </div>
                            )
                        },
                    }}
                />
            )}

            <Separator className="mt-16" />
        </div>
        </Section>

        {relatedBlogs.length > 0 && (
            <Section padding="none" className="mx-auto mt-16">
                <H2 className="mb-16">Keep Reading</H2>
                {isPressRelease ? (
                    <div className="grid gap-6">
                        {relatedBlogs.map((b) => (
                            <PressReleaseCard
                                key={b.uid}
                                blog={mapBlogDocumentToMetadata(b)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
                        {relatedBlogs.map((b) => (
                            <PostCardVert
                                key={b.uid}
                                blog={mapBlogDocumentToMetadata(b)}
                                className="h-full"
                            />
                        ))}
                    </div>
                )}
            </Section>
        )}
    </Container>
    </PaddingGlobal>
            </div>
        </main>
        <Footer />
    </>
  )
}
