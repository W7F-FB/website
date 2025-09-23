import { createClient } from "../../prismicio";
import type { ImageWithTextDocument } from "../../../types.generated";

/**
 * Get all ImageWithText slices / documents
 * Ordered by date (descending), then title (ascending)
 */
export async function getAllImageWithText(): Promise<ImageWithTextDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("image_with_text", {
      orderings: [
        { field: "my.image_with_text.title", direction: "desc" },
      ],
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("No documents were returned")
    ) {
      return [];
    }
    throw error;
  }
}
