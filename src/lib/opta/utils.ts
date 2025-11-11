export function normalizeOptaId(id: string): string {
  return id.startsWith('t') ? id.slice(1) : id
}

