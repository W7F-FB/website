import * as prismic from "@prismicio/client";

import { createClient } from "../prismicio";

/**
 * Create Prismic client instance
 */
export const client = createClient();

/**
 * Get image URL from Prismic image field
 */
export function getImageUrl(image: prismic.ImageField | null | undefined): string | null {
  if (!image?.url) return null;
  return image.url;
}

/**
 * Get image alt text from Prismic image field
 */
export function getImageAlt(image: prismic.ImageField | null | undefined): string {
  return image?.alt || "";
}

/**
 * Convert Prismic date to JavaScript Date
 */
export function parseDate(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  return new Date(dateString);
}
