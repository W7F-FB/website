import { Content } from "@prismicio/client"
import { ClubHorizontal } from "@/components/blocks/clubs/club"

interface GroupListPrismicProps {
  prismicTeams: Content.TeamDocument[]
  groupName: "Group 1" | "Group 2"
}

export function GroupListPrismic({ prismicTeams, groupName }: GroupListPrismicProps) {
  const teamsInGroup = prismicTeams
    .filter(team => team.data.group === groupName)
    .sort((a, b) => {
      const sortA = a.data.alphabetical_sort_string || a.data.name || ''
      const sortB = b.data.alphabetical_sort_string || b.data.name || ''
      return sortA.localeCompare(sortB)
    })

  if (teamsInGroup.length === 0) {
    return null
  }

  return (
    <>
      {teamsInGroup.map((team, index) => (
        <ClubHorizontal
          key={team.id}
          team={team}
          index={index + 1}
        />
      ))}
    </>
  )
}

