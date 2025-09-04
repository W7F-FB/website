import { sanityFetch } from "../client"

type SiteSettings = {
  _id: string
  _type: string
  footerColumns?: Array<{
    _key: string
    heading?: string
    links?: Array<{
      _key: string
      text?: string
      href?: string
      isExternal?: boolean
    }>
  }>
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return sanityFetch(
    `*[_type == "navigation" && _id == "navigation"][0]{
      _id,
      _type,
      footerColumns[] {
        _key,
        heading,
        links[] {
          _key,
          text,
          href,
          isExternal
        }
      }
    }`
  )
}

export async function getFooterData(): Promise<SiteSettings | null> {
  return sanityFetch(
    `*[_type == "navigation" && _id == "navigation"][0]{
      _id,
      _type,
      footerColumns[] {
        _key,
        heading,
        links[] {
          _key,
          text,
          href,
          isExternal
        }
      }
    }`
  )
}
