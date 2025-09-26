import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { TeamMemberDocument } from "../../../prismicio-types";

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
