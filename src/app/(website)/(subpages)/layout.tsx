"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/lib/utils";

export default function SubpagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  return (
    <div className="space-y-6 py-6">
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.flatMap((breadcrumb, index) => [
            <BreadcrumbItem key={breadcrumb.href}>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>,
            ...(index < breadcrumbs.length - 1 ? [<BreadcrumbSeparator key={`sep-${index}`} />] : [])
          ])}
        </BreadcrumbList>
      </Breadcrumb>
      {children}
    </div>
  );
}
