import { createClient } from "../../prismicio";
import type { BroadcastPartnersDocument } from "../../../prismicio-types";
import { dev } from "@/lib/dev";

export async function getAllBroadcastPartners(): Promise<BroadcastPartnersDocument[]> {
  try {
    const client = createClient();
    const partners = await client.getAllByType("broadcast_partners");
    return partners;
  } catch (error) {
    dev.log("Error fetching broadcast partners:", error);
    return [];
  }
}

