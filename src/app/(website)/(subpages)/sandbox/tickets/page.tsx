import { TicketOptionsGrid } from "@/components/blocks/ticket-options-grid";
import { Section, Container } from "@/components/website-base/padding-containers";


export default function TicketsPage() {
  return (
    <Container>
      <Section padding="md">
        <div>
          <TicketOptionsGrid />
        </div>
      </Section>
    </Container>
  );
}
