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

export async function getBroadcastPartnerByUid(uid: string): Promise<BroadcastPartnersDocument | null> {
  try {
    const client = createClient();
    const partner = await client.getByUID("broadcast_partners", uid);
    return partner;
  } catch (error) {
    dev.log(`Error fetching broadcast partner ${uid}:`, error);
    return null;
  }
}

