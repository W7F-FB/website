import { client } from "../client"
import type { Policy } from "../../../studio-website/sanity.types"

export async function getPolicyBySlug(slug: string): Promise<Policy | null> {
  return client.fetch(
    `*[_type == "policy" && slug.current == $slug][0]{
      _id,
      _type,
      name,
      slug,
      body
    }`,
    {slug}
  )
}

export async function getPoliciesForNav(): Promise<Array<{name: string; slug: string; order: number; pdfUrl?: string}>> {
  return client.fetch(
    `*[_type == "policy" && (hideFromNav != true)] | order(order asc, name asc) {
      name,
      "slug": slug.current,
      "order": coalesce(order, 9999),
      "pdfUrl": pdf.asset->url
    }`
  )
}
