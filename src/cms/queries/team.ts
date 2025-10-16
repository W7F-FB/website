import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { TeamMemberDocument, TeamDocument } from "../../../prismicio-types";

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
    console.error("Error fetching team members:", error);
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
    console.error(`Error fetching team members for department ${department}:`, error);
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
    const allTeams = await client.getAllByType("team", {
      fetchLinks: ["tournament.uid"],
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
    console.error(`Error fetching teams for tournament ${tournamentUID}:`, error);
    return [];
  }
}
