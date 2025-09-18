import { notFound } from "next/navigation"
import { getPolicyBySlug } from "@/cms/queries/policies"
import { PaddingGlobal, Section, Container } from "@/components/website-base/padding-containers"
import { H1 } from "@/components/website-base/typography"
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text"

type Params = Promise<{ slug: string }>

export default async function PolicyPage(props: { params: Params }) {
  const { slug } = await props.params
  const policy = await getPolicyBySlug(slug)
  if (!policy) return notFound()

  return (
    <PaddingGlobal>
      <Container maxWidth="5xl">
        <Section padding="lg">
          <H1>{policy.data.name}</H1>
          {policy.last_publication_date ? (
            <p className="text-lg text-muted-foreground mt-4">
              Last updated: {new Date(policy.last_publication_date).toLocaleDateString('en-US', {year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'})}
            </p>
          ) : null}
        </Section>
        <Section padding="sm" className="mb-64">
          <PrismicRichTextComponent field={policy.data.body} />
        </Section>
      </Container>
    </PaddingGlobal>
  )
}


