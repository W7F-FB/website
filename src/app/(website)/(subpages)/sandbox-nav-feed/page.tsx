import TournamentNavFeed from "@/components/blocks/tournament/nav-feed/tournament-nav-feed";
import { getGameData } from "@/lib/data/get-game-data";

export default async function SandboxNavFeedPage() {
  const competitionId = "1303";
  const seasonId = "2025";

  const gameData = await getGameData(competitionId, seasonId);

  const recentMatches = gameData
    .filter(match => match.homeTeam && match.awayTeam)
    .slice(0, 5);

  return (
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg p-6 shadow">
          <h1 className="mb-2 text-3xl font-bold">Tournament Nav Feed Sandbox</h1>
          <p className="text-gray-600">Testing the tournament nav feed component with auto-cycling F1 fixture data</p>
        </div>

        {recentMatches.length > 0 ? (
          <div className="space-y-4">
            <div className="rounded-lg p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">Auto-Cycling Match Feed</h2>
              <p className="mb-4 text-sm text-gray-600">Cycles through {recentMatches.length} matches every 3 seconds</p>
              <TournamentNavFeed matches={recentMatches} cycleInterval={3000} />
            </div>

            <div className="rounded-lg p-4 shadow">
              <h3 className="mb-2 text-lg font-semibold">Matches in Feed</h3>
              <div className="space-y-2">
                {recentMatches.map((match, index) => (
                  <div key={match.id} className="border-b pb-2 text-sm text-gray-600 last:border-b-0">
                    <p>
                      <strong>#{index + 1}:</strong> {match.homeTeam?.data?.name || "Unknown"} vs {match.awayTeam?.data?.name || "Unknown"} - {match.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-6 shadow">
            <p className="text-gray-600">No matches found</p>
          </div>
        )}

        <div className="rounded-lg p-4 shadow">
          <h3 className="mb-2 text-lg font-semibold">Total Matches Available</h3>
          <p className="text-gray-600">{gameData.length} matches loaded from F1 feed</p>
        </div>
      </div>
    </div>
  );
}

