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
import { PaddingGlobal } from "../website-base/padding-containers";
import { LinePattern } from "./line-pattern";

type BreadcrumbItem = {
  label: string | React.ReactNode;
  href: string;
};

type PageBreadcrumbsProps = {
  pathname?: string;
  customBreadcrumbs?: BreadcrumbItem[];
};

export function PageBreadcrumbs({ pathname, customBreadcrumbs }: PageBreadcrumbsProps) {
  const clientPathname = usePathname();
  const currentPathname = pathname ?? clientPathname;
  const breadcrumbs = customBreadcrumbs ?? generateBreadcrumbs(currentPathname);

  return (
    <Breadcrumb className="relative overflow-hidden">
      <div className="absolute -z-10 mt-px">
        <LinePattern patternSize={5} className="absolute w-[200vw] h-[100vh] top-0left-0 " />
      </div>
      <PaddingGlobal className="pt-1.5 pb-1 border-t border-border/50">
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
      </PaddingGlobal>
    </Breadcrumb>
  );
}

