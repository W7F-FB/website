import { Section, Container } from "@/components/website-base/padding-containers";
import { H2, P, Footnote } from "@/components/website-base/typography";
import { Badge } from "@/components/ui/badge";
import { InfoCard } from "@/components/blocks/info-card";

const infoData = [
  {
    id: "item-1",
    subtitle: "Ages",
    title: "Girls U9, U10, U11, U12",
  },
  {
    id: "item-2",
    subtitle: "Registration Fee",
    title: "$650.00",
    description: "(includes referee fees)",
  },
  {
    id: "item-3",
    subtitle: "Deadline",
    title: "Friday, November 28, 2025",
  },
  {
    id: "item-4",
    subtitle: "Venue",
    title: "Dolphin Field (NSU)",
    description: "Davie, Florida",
  },
  {
    id: "item-5",
    subtitle: "Format",
    title: "7v7",
    description:
      "2x15 min games, 3 group games, plus semi-finals, 3rd place, and Finals",
  },
  {
    id: "item-6",
    subtitle: "Awards",
    description:
      "Rising Sevens Youth Tournament by W7F medals and trophies for Champions & Finalists. The winning teams of each age group will be recognized on the professional tournament's stadium field.",
  },
  {
    id: "item-7",
    subtitle: "W7F",
    description:
      "All participating players will receive a W7F t-shirt, plus a free ticket to one session of W7F professional matches. Plus, Rising Sevens by W7F players will get to meet W7F's Player Advisory Council members and current players participating in the W7F professional tournament.",
  },
];

export function RisingInfoGridSection() {
  return (
    <Container maxWidth="lg">
      <Section padding="md" className="text-center">
        <Container maxWidth="md">
          <H2
            variant="h1"
            className="uppercase text-2xl md:text-5xl py-6 md:py-12"
          >
            Rising Sevens Youth Tournament by W7F
          </H2>
          <P noSpace>December 6-7, 2025</P>
          <P noSpace>Beyond Bancard Field & Dolphin Field at NSU</P>
          <P noSpace>Fort Lauderdale, Florida</P>
        </Container>
      </Section>
      <Section padding="md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
          <div>
            <H2 className="uppercase mb-6">About Rising Sevens</H2>
            <P>
              World Sevens Football proudly introduces Rising Sevens, a youth
              version of the W7F experience — giving the next generation of
              elite players the opportunity to be part of this groundbreaking
              global series. Rising Sevens will take place at Dolphin Field on
              the campus of Nova Southeastern University (NSU) in Davie, Florida
              — adjacent to Beyond Bancard Stadium, the site of the professional
              tournament.
            </P>
            <P>
              The youth event is open to girls' teams in the U9 through U12 age
              groups. All four age groups will compete on Saturday, December 6
              and Sunday, December 7.
            </P>
            <Footnote>
              Rising Sevens is not affiliated with FYSA or US Club Soccer and is
              open to all clubs, coaches, and teams. Whether you're a club
              coach, trainer, or team parent, you can organize a team and take
              part in this exciting new addition to the World Sevens Football
              series.
            </Footnote>
          </div>
          <div>
            <div className="flex mb-8 mt-3">
              <Badge fast variant="muted" className="uppercase">
                Tournament Info
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 auto-cols-fr gap-4 md:gap-6">
              {infoData.map((info, index) => (
                <InfoCard
                  key={info.id}
                  subtitle={info.subtitle}
                  title={info.title}
                  description={info.description}
                  className={
                    index === infoData.length - 1 ? "md:col-span-2" : ""
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </Section>
    </Container>
  );
}
