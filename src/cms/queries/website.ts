import * as prismic from "@prismicio/client";

import { createClient } from "../../prismicio";
import type { WebsiteDocument, BroadcastPartnersDocument } from "../../../prismicio-types";

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
  footerMenus?: FooterColumnData[];
};

export type NavigationSettings = {
  moreInfoMode: "Recent News" | "Where to watch" | null;
  broadcastPartners: BroadcastPartnersDocument[];
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
  const footerMenus: FooterColumnData[] = [];

  if (prismic.isFilled.group(website.data.footer_menus)) {
    website.data.footer_menus.forEach((menu, menuIndex) => {
      const links: FooterColumnData['links'] = [];
      
      if (prismic.isFilled.group(menu.menu_links)) {
        menu.menu_links.forEach((link, linkIndex) => {
          links.push({
            _key: `link-${menuIndex}-${linkIndex}`,
            text: link.link_text || undefined,
            href: link.link_url || undefined,
            isExternal: link.is_external || false
          });
        });
      }

      footerMenus.push({
        _key: `menu-${menuIndex}`,
        heading: menu.menu_title || undefined,
        links: links.length > 0 ? links : undefined
      });
    });
  }

  return {
    _id: website.id,
    _type: website.type,
    footerMenus: footerMenus.length > 0 ? footerMenus : undefined
  };
}

export async function getNavigationSettings(): Promise<NavigationSettings | null> {
  try {
    const client = createClient();
    const website = await client.getSingle("website");
    
    const partnerUids = ["dazn", "tnt", "tru-tv", "hbo-max", "univision", "espn", "disney-plus"];
    const broadcastPartners: BroadcastPartnersDocument[] = [];
    
    for (const uid of partnerUids) {
      try {
        const partner = await client.getByUID("broadcast_partners", uid);
        broadcastPartners.push(partner);
      } catch (_error) {
        continue;
      }
    }
    
    return {
      moreInfoMode: website.data.more_info_mode || null,
      broadcastPartners
    };
  } catch (error) {
    if (error instanceof Error && 
        (('status' in error && (error as { status: number }).status === 404) ||
        error.message.includes('No documents were returned'))
    ) {
      return null;
    }
    throw error;
  }
}
