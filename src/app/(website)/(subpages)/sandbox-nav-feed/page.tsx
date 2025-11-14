import { NavMain } from "@/components/website-base/nav/nav-main";
import TournamentNavFeed from "@/components/blocks/tournament/nav-feed/tournament-nav-feed";
import { PaddingGlobal } from "@/components/website-base/padding-containers";

export default function SandboxNavFeedPage() {
  const competitionId = "1303";
  const seasonId = "2025";

  return (
    <>
      <NavMain showBreadcrumbs />
      <PaddingGlobal>
    <div className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-lg p-6 shadow">
          <h1 className="mb-2 text-3xl font-bold">Tournament Nav Feed Sandbox</h1>
          <p className="text-gray-600">Testing the tournament nav feed component with auto-cycling F1 fixture data</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">Auto-Cycling Match Feed</h2>
            <p className="mb-4 text-sm text-gray-600">Fetches and cycles through matches every 3 seconds</p>
            <TournamentNavFeed 
              competitionId={competitionId} 
              seasonId={seasonId} 
              cycleInterval={3000} 
            />
          </div>

          <div className="rounded-lg p-4 shadow">
            <h3 className="mb-2 text-lg font-semibold">Configuration</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Competition ID:</strong> {competitionId}</p>
              <p><strong>Season ID:</strong> {seasonId}</p>
              <p><strong>Cycle Interval:</strong> 3000ms</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </PaddingGlobal>
    </>
  );
}

