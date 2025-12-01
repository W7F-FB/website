import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { TeamMemberDocument, TeamDocument } from "../../../prismicio-types";
import { dev } from "@/lib/dev";

/**
 * Get all team members
 */
export async function getAllTeamMembers(): Promise<TeamMemberDocument[]> {
  try {
    const client = createClient();
    const teamMembers = await client.getAllByType("team_member", {
      orderings: [
        { field: "my.team_member.display_order", direction: "asc" },
        { field: "my.team_member.name", direction: "asc" }
      ]
    });
    return teamMembers;
  } catch (error) {
    dev.log("Error fetching team members:", error);
    return [];
  }
}

/**
 * Get team members by department
 */
export async function getTeamMembersByDepartment(department: string): Promise<TeamMemberDocument[]> {
  try {
    const client = createClient();
    const teamMembers = await client.getAllByType("team_member", {
      filters: [
        prismic.filter.at("my.team_member.department", department)
      ],
      orderings: [
        { field: "my.team_member.display_order", direction: "asc" },
        { field: "my.team_member.name", direction: "asc" }
      ]
    });
    return teamMembers;
  } catch (error) {
    dev.log(`Error fetching team members for department ${department}:`, error);
    return [];
  }
}

/**
 * Get Player Advisory Council members
 */
export async function getPlayerAdvisoryCouncil(): Promise<TeamMemberDocument[]> {
  return getTeamMembersByDepartment("Player Advisor");
}

/**
 * Get Co-Founders
 */
export async function getCoFounders(): Promise<TeamMemberDocument[]> {
  return getTeamMembersByDepartment("Co-Founder");
}

/**
 * Get Leadership Team members
 */
export async function getLeadershipTeam(): Promise<TeamMemberDocument[]> {
  return getTeamMembersByDepartment("Leadership Team");
}

/**
 * Get teams that participate in a specific tournament
 */
export async function getTeamsByTournament(tournamentUID: string): Promise<TeamDocument[]> {
  try {
    const client = createClient();

    // Get all teams first, then filter by tournament participation
    // Fetch tournament fields including opta_enabled to check if team has Opta-enabled tournament
    const allTeams = await client.getAllByType("team", {
      fetchLinks: [
        "tournament.uid",
        "tournament.opta_enabled",
        "tournament.title",
        "tournament.country_code",
        "tournament.start_date",
        "tournament.end_date",
        "tournament.opta_competition_id",
        "tournament.opta_season_id",
        "tournament.featured",
        "tournament.nickname"
      ],
      orderings: [
        { field: "my.team.alphabetical_sort_string", direction: "asc" }
      ]
    });

    // Filter teams that have the specified tournament in their tournaments group
    const filteredTeams = allTeams.filter(team => {
      return team.data.tournaments.some(tournamentItem => {
        if (prismic.isFilled.contentRelationship(tournamentItem.tournament)) {
          return tournamentItem.tournament.uid === tournamentUID;
        }
        return false;
      });
    });

    return filteredTeams;
  } catch (error) {
    dev.log(`Error fetching teams for tournament ${tournamentUID}:`, error);
    return [];
  }
}

/**
 * Get a team by its Opta ID
 */
export async function getTeamByOptaId(optaId: string): Promise<TeamDocument | null> {
  try {
    const client = createClient();
    const teams = await client.getAllByType("team", {
      filters: [
        prismic.filter.at("my.team.opta_id", optaId)
      ],
      limit: 1
    });
    
    return teams.length > 0 ? teams[0] : null;
  } catch (error) {
    dev.log(`Error fetching team with Opta ID ${optaId}:`, error);
    return null;
  }
}

/**
 * Get multiple teams by their Opta IDs
 */
export async function getTeamsByOptaIds(optaIds: string[]): Promise<TeamDocument[]> {
  try {
    const client = createClient();
    const teams = await client.getAllByType("team", {
      filters: [
        prismic.filter.any("my.team.opta_id", optaIds)
      ]
    });
    
    return teams;
  } catch (error) {
    dev.log(`Error fetching teams with Opta IDs:`, error);
    return [];
  }
}

/**
 * Get a team by its UID (slug)
 */
export async function getTeamByUid(uid: string): Promise<TeamDocument | null> {
  try {
    const client = createClient();
    return await client.getByUID("team", uid);
  } catch (error) {
    if (error instanceof Error && 'status' in error && (error as { status: number }).status === 404) {
      return null;
    }
    dev.log(`Error fetching team with UID ${uid}:`, error);
    throw error;
  }
}

