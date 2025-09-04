'use client'

import * as React from "react"
import { createDataAttribute, useOptimistic } from '@sanity/visual-editing'
import { stegaClean } from '@sanity/client/stega'
import {
  FooterColumn,
  FooterList,
  FooterListHeading,
  FooterLink,
} from "./footer"

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
  documentId: string
  documentType: string
  columns: FooterColumnData[] | undefined
  projectId: string
  dataset: string
  baseUrl: string
}

export function FooterColumns({
  documentId,
  documentType,
  columns: initialColumns,
  projectId,
  dataset,
  baseUrl,
}: FooterColumnsProps) {
  const columns = useOptimistic<FooterColumnData[] | undefined>(
    initialColumns,
    (currentColumns, action) => {
      if (action.id !== documentId) {
        return currentColumns
      }

      const footerColumns = action.document?.footerColumns
      if (footerColumns && Array.isArray(footerColumns)) {
        return footerColumns as FooterColumnData[]
      }

      return currentColumns
    }
  )

  if (!columns || columns.length === 0) {
    return null
  }

  return (
    <>
      {columns.map((column) => (
        <FooterColumn
          key={column._key}
          data-sanity={createDataAttribute({
            projectId,
            dataset,
            baseUrl,
            id: documentId,
            type: documentType,
            path: `footerColumns[_key=="${column._key}"]`,
          }).toString()}
        >
          {column.heading && (
            <FooterListHeading>{stegaClean(column.heading)}</FooterListHeading>
          )}
          {column.links && column.links.length > 0 && (
            <FooterList>
              {column.links.map((link) => {
                if (!link.text || !link.href) return null
                
                return (
                  <div
                    key={link._key}
                    data-sanity={createDataAttribute({
                      projectId,
                      dataset,
                      baseUrl,
                      id: documentId,
                      type: documentType,
                      path: `footerColumns[_key=="${column._key}"].links[_key=="${link._key}"]`,
                    }).toString()}
                  >
                    <FooterLink href={stegaClean(link.href) || '/'}>
                      {stegaClean(link.text)}
                    </FooterLink>
                  </div>
                )
              })}
            </FooterList>
          )}
        </FooterColumn>
      ))}
    </>
  )
}
