import { sanityFetch } from "../client"
import type { Tournament } from "../../../studio-website/sanity.types"

export async function getNavigationTournaments(): Promise<Tournament[]> {
  return sanityFetch(`
    *[_type == "tournament" && showInNavigation.enabled == true] | order(showInNavigation.navigationOrder asc, startDate asc) {
      _id,
      _type,
      title,
      countryCode,
      startDate,
      endDate,
      showInNavigation {
        enabled,
        navigationOrder,
        navImage {
          asset,
          hotspot,
          crop,
          alt
        }
      }
    }
  `)
}

export async function getTournaments(): Promise<Tournament[]> {
  return sanityFetch(`
    *[_type == "tournament"] | order(startDate asc) {
      _id,
      _type,
      title,
      countryCode,
      startDate,
      endDate,
      showInNavigation {
        enabled,
        navigationOrder,
        navImage {
          asset,
          hotspot,
          crop,
          alt
        }
      }
    }
  `)
}
