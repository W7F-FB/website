import { NavMain } from "@/components/website-base/nav/nav-main";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"

export default async function GameCardSandboxPage() {
  return (
    <>
      <NavMain showBreadcrumbs />
      <PaddingGlobal>
      <Container>
      <Section padding="md">
        <div className="space-y-10">
          <p className="text-muted-foreground">GameCard sandbox page</p>
        </div>
      </Section>
    </Container>
    </PaddingGlobal>
    </>
  )
}
