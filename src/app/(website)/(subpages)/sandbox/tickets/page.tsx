import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { TicketOptionsGrid } from "@/components/blocks/ticket-options-grid";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers";


export default function TicketsPage() {
  return (
    <>
      <NavMain showBreadcrumbs />
      <main className="flex-grow min-h-[30rem]">
        <PaddingGlobal>
      <Container>
      <Section padding="md">
        <div>
          <TicketOptionsGrid />
        </div>
      </Section>
    </Container>
    </PaddingGlobal>
      </main>
      <Footer />
    </>
  );
}
