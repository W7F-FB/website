import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";

import { cn } from "@/lib/utils";
import { Container } from "@/components/website-base/padding-containers";
import { Separator } from "@/components/ui/separator";

export type DividerProps = SliceComponentProps<Content.DividerSlice>;

export default function DividerSlice({ slice }: DividerProps) {
  const spaceAbove = slice.primary.space_above !== false;
  const spaceBelow = slice.primary.space_below !== false;

  return (
    <Container maxWidth="lg" className={cn(spaceAbove && "mt-8 md:mt-16", spaceBelow && "mb-8 md:mb-16")}>
      <Separator />
    </Container>
  );
}
