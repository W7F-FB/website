import { Section, Container } from "@/components/website-base/padding-containers";
import { GameCardRow } from "@/components/blocks/game/game-card-row";
import { getAllTeams } from "@/cms/queries/team";

export default async function GameCardSandboxPage() {
  const teams = await getAllTeams();

  const fixtures = [
    {
      id: "1",
      startTime: "2025-10-24T19:30:00Z",
      status: "Scheduled",
      home: { id: "100", score: null },
      away: { id: "200", score: null },
      homeTeam: teams[0] || null,
      awayTeam: teams[1] || null,
    },
    {
      id: "2",
      startTime: "2025-10-25T19:30:00Z",
      status: "In Progress",
      home: { id: "101", score: 0 },
      away: { id: "201", score: 2 },
      homeTeam: teams[2] || null,
      awayTeam: teams[3] || null,
    },
    {
      id: "3",
      startTime: "2025-10-26T20:00:00Z",
      status: "Played",
      home: { id: "102", score: 3 },
      away: { id: "202", score: 2 },
      homeTeam: teams[4] || null,
      awayTeam: teams[5] || null,
    },
    {
      id: "4",
      startTime: "2025-10-26T20:00:00Z",
      status: "Postponed",
      home: { id: "103", score: 1 },
      away: { id: "203", score: 1 },
      homeTeam: teams[6] || null,
      awayTeam: teams[7] || null,
    },
  ];

  return (
    <Container>
      <Section padding="md">
        <div className="space-y-10">
          <GameCardRow 
            fixtures={fixtures} 
            title="Test Fixtures" 
            showDate 
          />
        </div>
      </Section>
    </Container>
  );
}