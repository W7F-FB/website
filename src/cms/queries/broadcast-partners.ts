import { createClient } from "../../prismicio";
import type { BroadcastPartnersDocument } from "../../../prismicio-types";

export async function getAllBroadcastPartners(): Promise<BroadcastPartnersDocument[]> {
  try {
    const client = createClient();
    const partners = await client.getAllByType("broadcast_partners");
    return partners;
  } catch (error) {
    console.error("Error fetching broadcast partners:", error);
    return [];
  }
}

