import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/cms/slices";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PaddingGlobal } from "@/components/website-base/padding-containers";

type Params = { uid: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { uid } = await params;
  const client = createClient();

  try {
    const page = await client.getByUID("page", uid);

    return {
      title: page.data.meta_title || `${uid} - World Sevens Football`,
      description: page.data.meta_description || undefined,
      openGraph: {
        title: page.data.meta_title || `${uid} - World Sevens Football`,
        description: page.data.meta_description || undefined,
        url: `https://worldsevensfootball.com/${uid}`,
        siteName: "World Sevens Football",
        type: "website",
        images: page.data.meta_image?.url
          ? [
              {
                url: page.data.meta_image.url,
                width: page.data.meta_image.dimensions?.width ?? 1200,
                height: page.data.meta_image.dimensions?.height ?? 630,
                alt: page.data.meta_image.alt || "World Sevens Football",
              },
            ]
          : [
              {
                url: "https://worldsevensfootball.com/images/static-media/Opengraph.jpg",
                width: 1200,
                height: 630,
                alt: "World Sevens Football",
              },
            ],
      },
      twitter: {
        card: "summary_large_image",
        title: page.data.meta_title || `${uid} - World Sevens Football`,
        description: page.data.meta_description || undefined,
        creator: "@worldsevens",
      },
    };
  } catch {
    return {};
  }
}

export default async function PrismicPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { uid } = await params;
  const client = createClient();

  let page;
  try {
    page = await client.getByUID("page", uid);
  } catch {
    notFound();
  }

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
