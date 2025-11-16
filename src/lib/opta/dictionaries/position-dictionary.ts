export interface PositionMetadata {
  abbr: string;
  label: string;
  shortLabel: string;
}

export const OPTA_POSITIONS: Record<string, PositionMetadata> = {
  "Goalkeeper": {
    abbr: "GK",
    label: "Goalkeeper",
    shortLabel: "Goalkeeper"
  },
  "Defender": {
    abbr: "D",
    label: "Defender",
    shortLabel: "Defender"
  },
  "Midfielder": {
    abbr: "M",
    label: "Midfielder",
    shortLabel: "Midfielder"
  },
  "Striker": {
    abbr: "F",
    label: "Striker",
    shortLabel: "Forward"
  },
  "Forward": {
    abbr: "F",
    label: "Forward",
    shortLabel: "Forward"
  },
  "Substitute": {
    abbr: "SUB",
    label: "Substitute",
    shortLabel: "Sub"
  }
} as const;

export type OptaPosition = keyof typeof OPTA_POSITIONS;

export function getPositionMetadata(position: string): PositionMetadata | undefined {
  return OPTA_POSITIONS[position];
}

export function getPositionAbbr(position: string): string {
  return OPTA_POSITIONS[position]?.abbr || position;
}

