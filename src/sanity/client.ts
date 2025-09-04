import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
  projectId: "439zkmb5",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  stega: {
    enabled: process.env.NODE_ENV === 'development',
    studioUrl: '/studio',
  },
});

// Server-side fetch function that handles draft mode
export async function sanityFetch<T = unknown>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  // Only import draftMode on the server side
  if (typeof window === 'undefined') {
    const { draftMode } = await import('next/headers');
    const isDraftMode = (await draftMode()).isEnabled;
    return client.fetch(query, params, {
      perspective: isDraftMode ? 'previewDrafts' : 'published',
      stega: isDraftMode,
    });
  }
  
  // Client-side fallback - just use regular client
  return client.fetch(query, params);
}

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
