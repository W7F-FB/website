import type { Metadata } from "next";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

import "../styles/globals.css";
import { PrismicPreview } from "@prismicio/next";
import Script from "next/script";

import { ClipPaths } from "@/components/ui/clip-paths";
import { MetallicGradients } from "@/components/website-base/icons";
import { RefCamWrapper } from "@/dolby/ref-cam-wrapper";


export const metadata: Metadata = {
  title: "World Sevens Football",
  description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
};

export const revalidate = 15

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth scroll-pt-24 overscroll-auto lg:overscroll-none" data-scroll-behavior="smooth" suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-PM4L7D3W" />
      <GoogleAnalytics gaId="G-MLFVZ11CHH" />
      <body className="w7f-v2 bg-background font-body min-h-dvh" suppressHydrationWarning>
        <Script
          async
          defer
          src="https://static.cdn.prismic.io/prismic.js?new=true&repo=world-sevens-football"
        />
        <ClipPaths />
        <MetallicGradients />
        <RefCamWrapper>
          {children}
        </RefCamWrapper>
        <PrismicPreview repositoryName="world-sevens-football" />
      </body>
    </html>
  );
}
