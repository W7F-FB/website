import { NavMain } from "@/components/website-base/nav/nav-main";
import { TicketOptionsGrid } from "@/components/blocks/ticket-options-grid";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers";


export default function TicketsPage() {
  return (
    <>
      <NavMain showBreadcrumbs />
      <PaddingGlobal>
      <Container>
      <Section padding="md">
        <div>
          <TicketOptionsGrid />
        </div>
      </Section>
    </Container>
    </PaddingGlobal>
    </>
  );
}
