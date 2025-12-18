import { FC } from "react";
import * as prismic from "@prismicio/client";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";

import { Section } from "@/components/website-base/padding-containers";
import { H2, P } from "@/components/website-base/typography";
import { GradientBanner } from "@/components/ui/gradient-banner";
import { LeadershipCard } from "@/components/blocks/leadership-card";
import { EmptyMessage } from "@/components/ui/empty-message";
import { GridCellScrollLink } from "@/components/blocks/grid-cell-scroll-link";
import { PrismicRichTextComponent } from "@/components/website-base/prismic-rich-text";
import { createClient } from "@/prismicio";
import type { TeamMemberDocument } from "../../../../prismicio-types";

/**
 * Props for `LeadershipGrid`.
 */
export type LeadershipGridProps =
  SliceComponentProps<Content.LeadershipGridSlice>;

/**
 * Component for "LeadershipGrid" Slices.
 */
const LeadershipGrid: FC<LeadershipGridProps> = async ({ slice }) => {
  const { title, content, members } = slice.primary;

  const section_id = (slice.primary as typeof slice.primary & { section_id?: string }).section_id;
  const scroll_link_raw = (slice.primary as typeof slice.primary & { scroll_link?: string }).scroll_link;
  
  const scroll_link = scroll_link_raw 
    ? scroll_link_raw.startsWith('#') 
      ? scroll_link_raw 
      : `#${scroll_link_raw}`
    : undefined;

  const resolvedMembers: TeamMemberDocument[] = [];
  
  if (members && members.length > 0) {
    const client = createClient();
    
    for (const memberItem of members) {
      if (isFilled.contentRelationship(memberItem.member) && memberItem.member.id) {
        try {
          const memberDoc = await client.getByID<TeamMemberDocument>(
            memberItem.member.id,
            {
              fetchLinks: ["team_member.name", "team_member.role", "team_member.headshot", "team_member.department"]
            }
          );
          resolvedMembers.push(memberDoc);
        } catch (error) {
          continue;
        }
      }
    }
  }

  resolvedMembers.sort((a, b) => {
    const orderA = a.data.display_order ?? 999;
    const orderB = b.data.display_order ?? 999;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return (a.data.name || "").localeCompare(b.data.name || "");
  });

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      id={isFilled.keyText(section_id) ? section_id : undefined}
    >
      <Section padding="md" className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
        <GradientBanner className="">
          {isFilled.keyText(title) && <H2>{title}</H2>}
          {isFilled.richText(content) && (
            <PrismicRichTextComponent field={content} />
          )}
        </GradientBanner>
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {resolvedMembers.length > 0 ? (
            resolvedMembers.map((member) => (
              <LeadershipCard
                key={member.id}
                team={{
                  name: member.data.name || "Unknown",
                  role: member.data.role || "Unknown",
                  headshot: prismic.isFilled.image(member.data.headshot)
                    ? member.data.headshot.url || ""
                    : "",
                  department: (member.data.department as 'Player Advisor' | 'Co-Founder' | 'Leadership Team') || 'Leadership Team'
                }}
              />
            ))
          ) : (
            <EmptyMessage className="col-span-full md:col-span-2 lg:col-span-3 self-start">
              <P>Our team is being assembled. Check back soon to meet the members who will help shape the future of World Sevens Football.</P>
            </EmptyMessage>
          )}
          {isFilled.keyText(scroll_link) && (
            <GridCellScrollLink 
              href={scroll_link} 
              className="col-span-full md:col-span-2 lg:col-span-3" 
            />
          )}
        </div>
      </Section>
    </section>
  );
};

export default LeadershipGrid;
