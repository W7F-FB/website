import { createClient } from "../../prismicio";
import type { BlogDocument } from "../../../types.generated";
import * as prismic from "@prismicio/client";

/**
 * Get a single blog by UID (slug)
 */
export async function getBlogBySlug(uid: string): Promise<BlogDocument | null> {
  try {
    const client = createClient();
    return await client.getByUID("blog", uid);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as any).status === 404) {
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
