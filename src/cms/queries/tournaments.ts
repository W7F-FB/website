import { createClient } from "../../prismicio";
import * as prismic from "@prismicio/client";
import type { TournamentDocument } from "../../../prismicio-types";

/**
 * Get tournaments that should show in navigation, ordered by navigation order and start date
 */
export async function getNavigationTournaments(): Promise<TournamentDocument[]> {
  try {
    const client = createClient();
    const tournaments = await client.getAllByType("tournament", {
      orderings: [
        { field: "my.tournament.navigation_order", direction: "asc" },
        { field: "my.tournament.start_date", direction: "asc" }
      ]
    });

    // Filter for tournaments that should show in navigation
    return tournaments.filter(tournament => tournament.data.show_in_navigation === true);
  } catch (error) {
    // Return empty array if no tournaments exist yet
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return [];
    }
    throw error;
  }
}

/**
 * Get all tournaments ordered by start date
 */
export async function getTournaments(): Promise<TournamentDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("tournament", {
      orderings: [
        { field: "my.tournament.start_date", direction: "asc" }
      ]
    });
  } catch (error) {
    // Return empty array if no tournaments exist yet
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return [];
    }
    throw error;
  }
}

/**
 * Get a tournament by its UID
 */
export async function getTournamentByUid(uid: string): Promise<TournamentDocument | null> {
  try {
    const client = createClient();
    return await client.getByUID("tournament", uid);
  } catch (error) {
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return null;
    }
    throw error;
  }
}

/**
 * Get a tournament by Opta competition ID and optionally season ID
 */
export async function getTournamentByOptaCompetitionId(
  competitionId: string,
  seasonId?: string
): Promise<TournamentDocument | null> {
  try {
    const client = createClient();
    const tournaments = await client.getAllByType("tournament");
    
    const tournament = tournaments.find(t => {
      const matchesCompetition = t.data.opta_competition_id === competitionId;
      if (seasonId) {
        return matchesCompetition && t.data.opta_season_id === seasonId;
      }
      return matchesCompetition;
    });
    
    return tournament || null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return null;
    }
    throw error;
  }
}

/**
 * Get the tournament with Live status
 */
export async function getLiveTournament(): Promise<TournamentDocument | null> {
  try {
    const client = createClient();
    const tournaments = await client.getAllByType("tournament", {
      filters: [
        prismic.filter.at("my.tournament.status", "Live")
      ],
      orderings: [
        { field: "my.tournament.start_date", direction: "desc" }
      ]
    });
    
    return tournaments.length > 0 ? tournaments[0] : null;
  } catch (error) {
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return null;
    }
    throw error;
  }
}
