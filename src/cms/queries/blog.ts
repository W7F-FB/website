import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { BlogDocument } from "../../../prismicio-types";

/**
 * Get a single blog by UID (slug)
 */
export async function getBlogBySlug(uid: string): Promise<BlogDocument | null> {
  try {
    const client = createClient();
    return await client.getByUID("blog", uid);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get all blogs
 * Ordered by publish date (descending), then title (ascending)
 */
export async function getAllBlogs(): Promise<BlogDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("blog", {
      orderings: [
        { field: "my.blog.date", direction: "desc" },
        { field: "my.blog.title", direction: "asc" },
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("No documents were returned")) {
      return [];
    }
    throw error;
  }
}

export async function getSocialBlogsByCategory(category: string): Promise<BlogDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("blog", {
      filters: [
        prismic.filter.at("my.blog.category", category)
      ],
      orderings: [
        { field: "my.blog.date", direction: "desc" },
        { field: "my.blog.title", direction: "asc" },
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("No documents were returned")) {
      return [];
    }
    throw error;
  }
}

export async function getSocialBlogs(): Promise<BlogDocument[]> {
  return getSocialBlogsByCategory("Social Impact");
}

export async function getBlogsByTournament(tournamentId: string): Promise<BlogDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("blog", {
      filters: [
        prismic.filter.at("my.blog.tournament", tournamentId)
      ],
      orderings: [
        { field: "my.blog.date", direction: "desc" },
        { field: "my.blog.title", direction: "asc" },
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("No documents were returned")) {
      return [];
    }
    throw error;
  }
}

export async function getMostRecentBlog(): Promise<BlogDocument | null> {
  try {
    const client = createClient();
    const results = await client.getAllByType("blog", {
      orderings: [
        { field: "my.blog.date", direction: "desc" },
      ],
      limit: 1,
    });
    return results[0] || null;
  } catch (error) {
    if (error instanceof Error && error.message.includes("No documents were returned")) {
      return null;
    }
    throw error;
  }
}

export async function getBlogsByTeam(teamId: string): Promise<BlogDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("blog", {
      filters: [
        prismic.filter.at("my.blog.teams.team", teamId)
      ],
      orderings: [
        { field: "my.blog.date", direction: "desc" },
        { field: "my.blog.title", direction: "asc" },
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("No documents were returned")) {
      return [];
    }
    throw error;
  }
}

export async function getBlogsByMatch(matchId: string): Promise<BlogDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("blog", {
      filters: [
        prismic.filter.at("my.blog.matches.match", matchId)
      ],
      orderings: [
        { field: "my.blog.date", direction: "desc" },
        { field: "my.blog.title", direction: "asc" },
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("No documents were returned")) {
      return [];
    }
    throw error;
  }
}
