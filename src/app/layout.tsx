import type { Metadata } from "next";
import "../styles/globals.css";
import { NavMain } from "@/components/website-base/nav/nav-main";
import { Footer } from "@/components/website-base/footer/footer-main";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";

export const metadata: Metadata = {
  title: "World Sevens Football",
  description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;
  
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background font-body min-h-dvh flex flex-col overscroll-auto lg:overscroll-none">
        {isDraftMode && <VisualEditing zIndex={1000} />}
        <NavMain />
        <main className="flex-grow min-h-[30rem]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
