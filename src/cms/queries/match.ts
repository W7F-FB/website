import { createClient } from "../../prismicio";
import type { MatchDocument } from "../../../prismicio-types";
import { normalizeOptaId } from "@/lib/opta/utils";

export async function getMatchBySlug(slug: string): Promise<MatchDocument | null> {
  try {
    const client = createClient();
    return await client.getByUID("match", slug);
  } catch (error) {
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return null;
    }
    throw error;
  }
}

export async function getMatchByOptaId(optaId: string): Promise<MatchDocument | null> {
  try {
    const client = createClient();
    const matches = await client.getAllByType("match");
    const normalizedId = normalizeOptaId(optaId);
    
    const match = matches.find(m => {
      const matchOptaId = m.data.opta_id;
      return matchOptaId && normalizeOptaId(matchOptaId) === normalizedId;
    });
    
    return match || null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return null;
    }
    throw error;
  }
}
