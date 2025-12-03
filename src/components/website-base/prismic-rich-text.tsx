import * as React from "react"
import { PrismicRichText, PrismicRichTextProps } from "@prismicio/react"
import Image from "next/image"
import * as prismic from "@prismicio/client"

import { H1, H2, H3, H4, P, Blockquote, List } from "./typography"

const components: PrismicRichTextProps["components"] = {
  heading1: ({ children }) => <H1>{children}</H1>,
  heading2: ({ children }) => <H2>{children}</H2>,
  heading3: ({ children }) => <H3>{children}</H3>,
  heading4: ({ children }) => <H4>{children}</H4>,
  paragraph: ({ children }) => <P>{children}</P>,
  preformatted: ({ children }) => <Blockquote>{children}</Blockquote>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  listItem: ({ children }) => <li>{children}</li>,
  oListItem: ({ children }) => <li>{children}</li>,
  list: ({ children }) => <List>{children}</List>,
  oList: ({ children }) => <ol className="list-decimal list-inside space-y-2">{children}</ol>,
  hyperlink: ({ node, children }) => {
    const isExternal = node.data.link_type === "Web"
    return (
      <a
        href={node.data.url || ""}
        className="underline underline-offset-2 text-primary"
        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    )
  },
  image: ({ node }) => {
    if (!prismic.isFilled.image(node)) return null
    
    return (
      <div className="my-6">
        <Image
          src={node.url}
          alt={node.alt || ""}
          width={node.dimensions?.width || 1200}
          height={node.dimensions?.height || 800}
          className="h-auto w-full rounded"
        />
      </div>
    )
  },
}

interface PrismicRichTextComponentProps {
  field: prismic.RichTextField | null | undefined
}

export function PrismicRichTextComponent({ field }: PrismicRichTextComponentProps) {
  if (!field) return null
  return <PrismicRichText field={field} components={components} />
}
