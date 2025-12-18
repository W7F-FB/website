import { Metadata } from "next";
import { notFound } from "next/navigation";
import { asImageSrc } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/cms/slices";
import { Section, Container, PaddingGlobal } from "@/components/website-base/padding-containers"
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";

type Params = Promise<{ slug: string }>;

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;
  const client = createClient();
  const page = await client.getByUID("page", slug).catch(() => notFound());

  return (
    <>
      <NavMain showBreadcrumbs />
      <main className="flex-grow min-h-[30rem]">
        <PaddingGlobal>
          <SliceZone slices={page.data.slices} components={components} />
        </PaddingGlobal>
      </main>
      <Footer />
    </>
  );
}

export async function generateMetadata({ params,}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const client = createClient();
  const page = await client.getByUID("page", slug).catch(() => notFound());

  return {
    title: page.data.meta_title,
    description: page.data.meta_description,
    openGraph: {
      images: [{ url: asImageSrc(page.data.meta_image) ?? "" }],
    },
  };
}

export async function generateStaticParams() {
  const client = createClient();
  const pages = await client.getAllByType("page");

  return pages.map((page) => ({ slug: page.uid }));
}