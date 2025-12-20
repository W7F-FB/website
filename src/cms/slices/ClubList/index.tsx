import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";

import { Container, Section } from "@/components/website-base/padding-containers";
import { ClubList as ClubListComponent } from "@/components/blocks/clubs/club-list";
import { createClient } from "@/prismicio";
import type { TournamentDocument } from "../../../../prismicio-types";

/**
 * Props for `ClubList`.
 */
export type ClubListProps = SliceComponentProps<Content.ClubListSlice>;

/**
 * Component for "ClubList" Slices.
 */
const ClubList: FC<ClubListProps> = async ({ slice }) => {
  const { tournament } = slice.primary;

  let tournamentDoc: TournamentDocument | null = null;

  if (isFilled.contentRelationship(tournament) && tournament.id) {
    try {
      const client = createClient();
      tournamentDoc = await client.getByID<TournamentDocument>(
        tournament.id,
        {
          fetchLinks: [
            "tournament.title",
            "tournament.status",
            "tournament.number_of_teams",
            "tournament.opta_competition_id"
          ]
        }
      );
    } catch (error) {
    }
  }

  if (!tournamentDoc) {
    return null;
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
      <Container>
        <Section padding="sm">
          <ClubListComponent tournament={tournamentDoc} />
        </Section>
      </Container>
    </section>
  );
};

export default ClubList;
