import { createClient } from "../client";
import type { FaqSectionDocument } from "../../../prismicio-types";

/**
 * Get all FAQ sections ordered by section_order
 */
export async function getAllFaqSections(): Promise<FaqSectionDocument[]> {
  try {
    const client = createClient();
    return await client.getAllByType("faq_section", {
      orderings: [
        { field: "my.faq_section.section_order", direction: "asc" },
      ],
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("No documents were returned")) {
      return [];
    }
    throw error;
  }
}

/**
 * Get a single FAQ section by UID
 */
export async function getFaqSectionByUid(uid: string): Promise<FaqSectionDocument | null> {
  try {
    const client = createClient();
    return await client.getByUID("faq_section", uid);
  } catch (error) {
    if (error instanceof Error && "status" in error && (error as { status: number }).status === 404) {
      return null;
    }
    throw error;
  }
}

/**
 * Get FAQ section by UID with default fallback
 * Helper function for specific sections
 */
async function getFaqSectionByUidSafe(uid: string): Promise<FaqSectionDocument | null> {
  return await getFaqSectionByUid(uid);
}

/**
 * Get Ticketing FAQ section
 */
export async function getTicketingFaqSection(): Promise<FaqSectionDocument | null> {
  return await getFaqSectionByUidSafe("ticketing");
}

/**
 * Get Competition Format FAQ section
 */
export async function getCompetitionFormatFaqSection(): Promise<FaqSectionDocument | null> {
  return await getFaqSectionByUidSafe("competition-format");
}

/**
 * Get Event FAQ section
 */
export async function getEventFaqSection(): Promise<FaqSectionDocument | null> {
  return await getFaqSectionByUidSafe("event");
}

/**
 * Get Upcoming Tournament FAQ section
 */
export async function getUpcomingTournamentFaqSection(): Promise<FaqSectionDocument | null> {
  return await getFaqSectionByUidSafe("upcoming-tournament");
}

/**
 * Get Rising Sevens FAQ section
 */
export async function getRisingSevensFaqSection(): Promise<FaqSectionDocument | null> {
  return await getFaqSectionByUidSafe("rising-sevens");
}

/**
 * Get Home page FAQ section
 */
export async function getHomeFaqSection(): Promise<FaqSectionDocument | null> {
  return await getFaqSectionByUidSafe("home");
}

