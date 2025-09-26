import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { PolicyDocument } from "../../../prismicio-types";

/**
 * Get a policy by its UID (slug)
 */
export async function getPolicyBySlug(uid: string): Promise<PolicyDocument | null> {
  try {
    const client = createClient();
    return await client.getByUID("policy", uid);
  } catch (error) {
    if (error instanceof Error && 'status' in error && (error as { status: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get policies for navigation (not hidden, ordered by order field then name)
 */
export async function getPoliciesForNav(): Promise<Array<{
  name: string;
  slug: string;
  order: number;
  pdfUrl?: string;
}>> {
  try {
    const client = createClient();
    const policies = await client.getAllByType("policy", {
      orderings: [
        { field: "my.policy.order", direction: "asc" },
        { field: "my.policy.name", direction: "asc" }
      ]
    });

    // Filter out hidden policies and transform to the expected format
    return policies
      .filter(policy => !policy.data.hide_from_nav)
      .map(policy => ({
        name: policy.data.name || "Untitled Policy",
        slug: policy.uid,
        order: policy.data.order || 9999,
        pdfUrl: prismic.isFilled.link(policy.data.pdf) && policy.data.pdf.link_type === "Media" 
          ? policy.data.pdf.url 
          : undefined
      }));
  } catch (error) {
    // Return empty array if no policies exist yet
    if (error instanceof Error && error.message.includes('No documents were returned')) {
      return [];
    }
    throw error;
  }
}
