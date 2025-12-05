import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Footer } from "@/components/website-base/footer/footer-main";

export default function NotFound() {
  return (
    <>
      <main className="flex-grow min-h-[30rem]">
        <div className="min-h-screen font-body flex items-center justify-center bg-background -mb-24">
          <div className="text-center space-y-8 px-4">
            <div className="space-y-4">
              <h1 className="text-8xl font-bold text-transparent text-stroke-[1px]/primary font-headers">404</h1>
              <h2 className="text-3xl font-semibold text-foreground font-headers">
                Page Not Found
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
            </div>

            <div className="space-y-4">
              <Button asChild size="skew_lg" variant="default">
                <Link href="/">
                  <span>
                    Return Home
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
