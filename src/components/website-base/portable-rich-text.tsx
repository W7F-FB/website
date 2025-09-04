import * as React from "react"
import {PortableText, type PortableTextComponents} from "@portabletext/react"
import Image from "next/image"
import { urlFor } from "@/sanity/client"

import { H1, H2, H3, H4, P, Blockquote, List } from "./typography"

const components: PortableTextComponents = {
  block: {
    h1: ({children}) => <H1>{children}</H1>,
    normal: ({children}) => <P>{children}</P>,
    h2: ({children}) => <H2>{children}</H2>,
    h3: ({children}) => <H3>{children}</H3>,
    h4: ({children}) => <H4>{children}</H4>,
    blockquote: ({children}) => <Blockquote>{children}</Blockquote>,
  },
  types: {
    image: ({value}) => {
      const src = urlFor(value).width(1200).fit("max").url()
      const alt = (value as { alt?: string })?.alt || ""
      return (
        <div className="my-6">
          <Image src={src} alt={alt} width={1200} height={800} className="h-auto w-full rounded" />
        </div>
      )
    },
  },
  marks: {
    strong: ({children}) => <strong className="font-semibold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    code: ({children}) => <code className="rounded bg-muted px-1 py-0.5">{children}</code>,
    underline: ({children}) => <span className="underline underline-offset-2">{children}</span>,
    'strike-through': ({children}) => <span className="line-through">{children}</span>,
    link: ({children, value}) => {
      const href = (value as { href?: string })?.href
      const isExternal = href ? /^https?:\/\//i.test(href) : false
      return (
        <a
          href={href}
          className="underline underline-offset-2"
          {...(isExternal ? {target: "_blank", rel: "noopener noreferrer"} : {})}
        >
          {children}
        </a>
      )
    },
  },
  list: {
    bullet: ({children}) => <List>{children}</List>,
    number: ({children}) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>,
  },
  listItem: {
    bullet: ({children}) => <li className="mt-2">{children}</li>,
    number: ({children}) => <li className="mt-2">{children}</li>,
  },
}

type PortableTextValue = {
  _type: string
  _key: string
  [key: string]: unknown
}

export function PortableRichText({value}: {value: PortableTextValue[] | PortableTextValue | null | undefined}) {
  if (!value) return null
  return <PortableText value={value} components={components} />
}


