import { FC } from "react";
import { Content } from "@prismicio/client";
import { SliceComponentProps } from "@prismicio/react";
import { isFilled } from "@prismicio/client";

import { Section } from "@/components/website-base/padding-containers";
import { TuneInBanner } from "@/components/blocks/tune-in-banner";
import { createClient } from "@/prismicio";
import type { BroadcastPartnersDocument } from "../../../../prismicio-types";

/**
 * Props for `BroadcastPartners`.
 */
export type BroadcastPartnersProps =
  SliceComponentProps<Content.BroadcastPartnersSlice>;

/**
 * Component for "BroadcastPartners" Slices.
 */
const BroadcastPartners: FC<BroadcastPartnersProps> = async ({ slice }) => {
  const primary = slice.primary as any;
  const partners = [
    { key: 'dazn', field: primary?.dazn },
    { key: 'tnt', field: primary?.tnt },
    { key: 'truTV', field: primary?.truTV },
    { key: 'hboMax', field: primary?.hboMax },
    { key: 'univision', field: primary?.univision },
    { key: 'espn', field: primary?.espn },
    { key: 'disneyPlus', field: primary?.disneyPlus },
  ];

  const client = createClient();
  const resolvedPartners = await Promise.all(
    partners.map(async ({ key, field }) => {
      if (isFilled.contentRelationship(field) && field.id) {
        try {
          return { key, partner: await client.getByID<BroadcastPartnersDocument>(field.id) };
        } catch (error) {
          return { key, partner: null };
        }
      }
      return { key, partner: null };
    })
  );

  const partnersMap = resolvedPartners.reduce((acc, { key, partner }) => {
    acc[key] = partner;
    return acc;
  }, {} as Record<string, BroadcastPartnersDocument | null>);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
    >
        <div className="mt-4" id="tune-in">
          <TuneInBanner
            dazn={partnersMap.dazn}
            tnt={partnersMap.tnt}
            truTV={partnersMap.truTV}
            hboMax={partnersMap.hboMax}
            univision={partnersMap.univision}
            espn={partnersMap.espn}
            disneyPlus={partnersMap.disneyPlus}
          />
        </div>
    </section>
  );
};

export default BroadcastPartners;
