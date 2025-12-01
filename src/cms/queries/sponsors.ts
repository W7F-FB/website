import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { SponsorDocument } from "../../../prismicio-types";
import { dev } from "@/lib/dev";

/**
 * Get all visible sponsors ordered by sort_order
 */
export async function getVisibleSponsors(): Promise<SponsorDocument[]> {
  try {
    const client = createClient();
    const sponsors = await client.getAllByType("sponsor", {
      filters: [
        prismic.filter.at("my.sponsor.visibility", true)
      ],
      orderings: [
        { field: "my.sponsor.sort_order", direction: "asc" }
      ]
    });
    return sponsors;
  } catch (error) {
    dev.log("Error fetching sponsors:", error);
    return [];
  }
}
