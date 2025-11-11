import { Section, Container } from "@/components/website-base/padding-containers";
import { RosterCard } from "@/components/blocks/roster-card";
import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";

interface TeamPageProps {
  params: {
    uid: string;
  };
}

export default async function TeamPage({ params }: TeamPageProps) {
  const { uid } = params;
  
  const client = createClient();
  const team = await client.getByUID("team", uid).catch(() => null);
  
  if (!team) {
    notFound();
  }
  
  return (
    <Container>
      <Section padding="md">
        <div>
            <RosterCard/>
        </div>
      </Section>
    </Container>
  );
}

