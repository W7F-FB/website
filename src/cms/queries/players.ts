import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { PlayerDocument } from "../../../prismicio-types";
import { dev } from "@/lib/dev";
import { normalizeOptaId } from "@/lib/opta/utils";

export async function getPlayerByOptaId(optaId: string): Promise<PlayerDocument | null> {
  try {
    const client = createClient();
    const normalizedId = normalizeOptaId(optaId);
    const players = await client.getAllByType("player", {
      filters: [
        prismic.filter.at("my.player.opta_id", normalizedId)
      ],
      limit: 1
    });
    
    return players.length > 0 ? players[0] : null;
  } catch (error) {
    dev.log(`Error fetching player with Opta ID ${optaId}:`, error);
    return null;
  }
}

export async function getPlayersByOptaIds(optaIds: string[]): Promise<PlayerDocument[]> {
  try {
    if (optaIds.length === 0) return [];
    
    const client = createClient();
    const normalizedIds = optaIds.map(normalizeOptaId);
    const players = await client.getAllByType("player", {
      filters: [
        prismic.filter.any("my.player.opta_id", normalizedIds)
      ]
    });
    
    return players;
  } catch (error) {
    dev.log(`Error fetching players with Opta IDs:`, error);
    return [];
  }
}

