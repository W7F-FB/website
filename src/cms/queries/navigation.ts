import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { WebsiteDocument, WebsiteDocumentDataFooterMenusItem } from "../../../prismicio-types";

/**
 * Type for footer column data
 */
export type FooterColumnData = {
  _key: string;
  heading?: string;
  links?: Array<{
    _key: string;
    text?: string;
    href?: string;
    isExternal?: boolean;
  }>;
};

/**
 * Type for site settings
 */
export type SiteSettings = {
  _id: string;
  _type: string;
  footerColumns?: FooterColumnData[];
};

/**
 * Get navigation/site settings data
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const client = createClient();
    const website = await client.getSingle("website");
    return transformWebsiteData(website);
  } catch (error) {
    // Handle both 404 and "No documents were returned" errors
    if (error instanceof Error && 
        (('status' in error && (error as { status: number }).status === 404) ||
        error.message.includes('No documents were returned'))
    ) {
      return null;
    }
    throw error;
  }
}

/**
 * Get footer data (alias for getSiteSettings for backward compatibility)
 */
export async function getFooterData(): Promise<SiteSettings | null> {
  return getSiteSettings();
}

/**
 * Transform Prismic website data to match the expected format
 */
function transformWebsiteData(website: WebsiteDocument): SiteSettings {
  const footerColumns: FooterColumnData[] = [];

  if (prismic.isFilled.group(website.data.footer_menus)) {
    website.data.footer_menus.forEach((menu: WebsiteDocumentDataFooterMenusItem, menuIndex: number) => {
      const links: FooterColumnData['links'] = [];
      
      if (prismic.isFilled.group(menu.menu_links)) {
        menu.menu_links.forEach((link, linkIndex: number) => {
          links.push({
            _key: `link-${menuIndex}-${linkIndex}`,
            text: link.link_text || undefined,
            href: link.link_url || undefined,
            isExternal: link.is_external || false
          });
        });
      }

      footerColumns.push({
        _key: `column-${menuIndex}`,
        heading: menu.menu_title || undefined,
        links: links.length > 0 ? links : undefined
      });
    });
  }

  return {
    _id: website.id,
    _type: website.type,
    footerColumns: footerColumns.length > 0 ? footerColumns : undefined
  };
}
