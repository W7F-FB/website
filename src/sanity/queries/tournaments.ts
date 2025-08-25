import { client } from "../client"
import type { Tournament } from "../../../studio-website/sanity.types"

export async function getNavigationTournaments(): Promise<Tournament[]> {
  return client.fetch(`
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
  return client.fetch(`
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
