import type { Metadata } from "next";
import "../styles/globals.css";
import { NavMain } from "@/components/website-base/nav-main";

export const metadata: Metadata = {
  title: "World Sevens Football",
  description: "The global 7v7 series reimagining the game. Elite clubs, star players, high-stakes matches, and a $5M prize pool per tournament.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background">
        <NavMain />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
