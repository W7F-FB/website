import { client } from "./client"
import type { Tournament } from "../../studio-website/sanity.types"

export async function getNavigationTournaments(): Promise<Tournament[]> {
  return client.fetch(`
    *[_type == "tournament" && showInNavigation == true] | order(navigationOrder asc, startDate asc) {
      _id,
      _type,
      title,
      navImage,
      countryCode,
      startDate,
      endDate,
      showInNavigation,
      navigationOrder
    }
  `)
}

export async function getTournaments(): Promise<Tournament[]> {
  return client.fetch(`
    *[_type == "tournament"] | order(startDate asc) {
      _id,
      _type,
      title,
      navImage,
      countryCode,
      startDate,
      endDate,
      showInNavigation,
      navigationOrder
    }
  `)
}
