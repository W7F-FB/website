import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { notFound } from "next/navigation"

import { getPolicyBySlug } from "@/cms/queries/policies"
import { PaddingGlobal, Section, Container } from "@/components/website-base/padding-containers"
import { H1 } from "@/components/website-base/typography"
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text"
import { formatDate } from "@/lib/utils"

type Params = Promise<{ slug: string }>

export default async function PolicyPage(props: { params: Params }) {
  const { slug } = await props.params
  const policy = await getPolicyBySlug(slug)
  if (!policy) return notFound()

  return (
    <>
      <NavMain showBreadcrumbs />
      <main className="flex-grow min-h-[30rem]">
        <div>
            <PaddingGlobal>
      <Container maxWidth="md">
        <Section padding="lg">
          <H1>{policy.data.name}</H1>
          {policy.last_publication_date ? (
            <p className="text-lg text-muted-foreground mt-4">
              Last updated: {formatDate(policy.last_publication_date)}
            </p>
          ) : null}
        </Section>
        <Section padding="sm" className="mb-64">
          <PrismicRichTextComponent field={policy.data.body} />
        </Section>
      </Container>
    </PaddingGlobal>
        </div>
      </main>
      <Footer />
    </>
  )
}


