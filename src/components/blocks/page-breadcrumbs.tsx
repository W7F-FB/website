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
import { CollapseIcon, CollapseReverseIcon } from "../website-base/icons";
import { Button } from "../ui/button";
import { useGamesSliderCollapse } from "./tournament/games-slider/games-slider-collapse-context";

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
  const { isCollapsed, toggleCollapse, collapsable } = useGamesSliderCollapse();

  return (
    <Breadcrumb className="relative overflow-hidden">
      <div className="absolute -z-10 mt-px">
        <LinePattern patternSize={5} className="absolute w-[200vw] h-[100vh] top-0 left-0 " />
      </div>
      <PaddingGlobal className="pt-1.5 pb-1 border-t relative border-border/50 w-full">
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
      {collapsable && (
        <div className="absolute right-0 top-px bottom-0">
          <Button variant="outline" size="icon" className="h-full border-border/50 border-y-0 border-r-0 rounded-none" onClick={toggleCollapse}>
            {isCollapsed ? <CollapseReverseIcon className="size-3" /> : <CollapseIcon className="size-3" />}
          </Button>
        </div>
      )}
    </Breadcrumb>
  );
}
