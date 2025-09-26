import * as React from "react"

import {
  FooterColumn,
  FooterList,
  FooterListHeading,
  FooterLink,
} from "../../ui/footer"

type FooterColumnData = {
  _key: string
  heading?: string
  links?: Array<{
    _key: string
    text?: string
    href?: string
    isExternal?: boolean
  }>
}

interface FooterColumnsProps {
  columns: FooterColumnData[] | undefined
}

export function FooterColumns({ columns }: FooterColumnsProps) {
  if (!columns || columns.length === 0) {
    return null
  }

  return (
    <>
      {columns.map((column) => (
        <FooterColumn key={column._key}>
          {column.heading && (
            <FooterListHeading>{column.heading}</FooterListHeading>
          )}
          {column.links && column.links.length > 0 && (
            <FooterList>
              {column.links.map((link) => {
                if (!link.text || !link.href) return null
                
                return (
                  <FooterLink 
                    key={link._key} 
                    href={link.href}
                  >
                    {link.text}
                  </FooterLink>
                )
              })}
            </FooterList>
          )}
        </FooterColumn>
      ))}
    </>
  )
}