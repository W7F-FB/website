import type { Metadata } from "next";

import "../styles/globals.css";
import { PrismicPreview } from "@prismicio/next";
import Script from "next/script";

import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { PaddingGlobal } from "@/components/website-base/padding-containers";
import { ClipPaths } from "@/components/ui/clip-paths";


export const metadata: Metadata = {
  title: "World Sevens Football",
  description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth scroll-pt-24 overscroll-auto lg:overscroll-none" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased bg-background font-body min-h-dvh flex flex-col" suppressHydrationWarning>
        <Script
          async
          defer
          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=world-sevens-football"
        />
        <ClipPaths />
        <NavMain />
        <main className="flex-grow min-h-[30rem]">
          <PaddingGlobal>
            {children}
          </PaddingGlobal>
        </main>
        <Footer />
        <PrismicPreview repositoryName="world-sevens-football" />
      </body>
    </html>
  );
}
