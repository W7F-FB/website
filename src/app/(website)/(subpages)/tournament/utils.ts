import type { F1MatchData } from "@/types/opta-feeds/f1-fixtures"

export function getGroupStageMatches(matches: F1MatchData[] | undefined) {
    if (!matches) return []
    return matches.filter(match => match.MatchInfo.RoundType === "Round")
}

export function groupMatchesByDate(matches: F1MatchData[] | undefined) {
    if (!matches) return new Map<string, F1MatchData[]>()
    
    const grouped = new Map<string, F1MatchData[]>()
    
    matches.forEach((match) => {
        const dateStr = match.MatchInfo.Date.split(' ')[0]
        if (!grouped.has(dateStr)) {
            grouped.set(dateStr, [])
        }
        grouped.get(dateStr)?.push(match)
    })
    
    const sorted = new Map<string, F1MatchData[]>()
    
    for (const [date, dateMatches] of grouped.entries()) {
        const sortedMatches = [...dateMatches].sort((a, b) => {
            const dateA = new Date(a.MatchInfo.Date)
            const dateB = new Date(b.MatchInfo.Date)
            return dateA.getTime() - dateB.getTime()
        })
        sorted.set(date, sortedMatches)
    }
    
    return new Map([...sorted.entries()].sort((a, b) => a[0].localeCompare(b[0])))
}

export function formatMatchDayDate(date: string) {
    const dateObj = new Date(date)
    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
    const month = dateObj.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
    const day = dateObj.getUTCDate()
    return `${weekday}, ${month} ${day}`
}

