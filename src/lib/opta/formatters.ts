const STATUS_DISPLAY_MAP: Record<string, string> = {
  PreMatch: "vs",
  FirstHalf: "HT",
  SecondHalf: "2H",
  FullTime: "FT",
  PostMatch: "FT",
};

export function formatMatchStatus(status: string): string {
  return STATUS_DISPLAY_MAP[status] || status;
}

export function isPreMatch(status: string): boolean {
  return status === "PreMatch";
}

export function formatScore(score: number | null | undefined, status: string): string {
  if (isPreMatch(status)) {
    return "";
  }
  return score !== null && score !== undefined ? String(score) : "-";
}

