import { createClient } from "../../prismicio";
import type { TournamentDocument } from "../../../types.generated";

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
    if (error instanceof Error && 'status' in error && (error as any).status === 404) {
      return null;
    }
    throw error;
  }
}
