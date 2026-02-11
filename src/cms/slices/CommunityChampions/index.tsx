import { Content, isFilled } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

import { cn } from "@/lib/utils";
import { Section, Container } from "@/components/website-base/padding-containers";
import { H2, P } from "@/components/website-base/typography";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

type LogoItem = Content.CommunityChampionsSliceDefaultPrimaryLogosItem;

interface LogoGroup {
  label: string;
  logos: LogoItem[];
}

function groupLogos(items: LogoItem[]): LogoGroup[] {
  const groupMap = new Map<string, LogoItem[]>();
  const groupOrder: string[] = [];

  for (const item of items) {
    const tournament = item.tournament;
    const label =
      isFilled.contentRelationship(tournament) && tournament.data
        ? (tournament.data as { title?: string }).title || "Other"
        : "Other";
    if (!groupMap.has(label)) {
      groupMap.set(label, []);
      groupOrder.push(label);
    }
    groupMap.get(label)!.push(item);
  }

  return groupOrder.map((label) => ({
    label,
    logos: groupMap.get(label)!,
  }));
}

export type CommunityChampionsProps =
  SliceComponentProps<Content.CommunityChampionsSlice>;

export default function CommunityChampionsSlice({
  slice,
}: CommunityChampionsProps) {
  const spaceAbove = slice.primary.space_above !== false;
  const spaceBelow = slice.primary.space_below !== false;
  const groups = groupLogos(slice.primary.logos);

  return (
    <Container
      maxWidth="lg"
      className={cn(spaceAbove && "mt-8 md:mt-16", spaceBelow && "mb-8 md:mb-16")}
    >
      <Section padding="md">
        {(isFilled.richText(slice.primary.heading) ||
          isFilled.richText(slice.primary.description)) && (
          <div className="mb-12 max-w-3xl">
            <PrismicRichText
              field={slice.primary.heading}
              components={{
                heading2: ({ children }) => (
                  <H2 className="uppercase">{children}</H2>
                ),
              }}
            />
            <PrismicRichText
              field={slice.primary.description}
              components={{
                paragraph: ({ children }) => <P>{children}</P>,
              }}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <Card key={group.label} banner>
              <CardHeader>
                <CardTitle>{group.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 py-2">
                  {group.logos.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-center p-2"
                    >
                      <PrismicNextImage
                        field={item.logo}
                        className="max-w-32 max-h-20 w-auto h-auto object-contain"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>
    </Container>
  );
}
