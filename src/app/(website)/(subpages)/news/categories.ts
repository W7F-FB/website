export const NEWS_CATEGORIES = [
  "Announcements",
  "Tournament Recap",
  "Match Recap",
  "Social Impact",
  "Match Day Preview",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const ALL_NEWS_TAB = "all" as const;
export const PRESS_RELEASES_TAB = "press-releases" as const;

export type FilterTab = typeof ALL_NEWS_TAB | typeof PRESS_RELEASES_TAB | NewsCategory;
