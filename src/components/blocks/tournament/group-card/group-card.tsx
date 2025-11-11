import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { H2 } from "@/components/website-base/typography"
import { Content } from "@prismicio/client"

interface GroupCardProps {
  group: Content.GroupDocument
}

export function GroupCard({ group }: GroupCardProps) {
    return (
    <Card>
        <CardHeader className="p-0">
            <CardTitle>
                <H2>Group {group.data.name}</H2>
            </CardTitle>
        </CardHeader>
    </Card>
    )
}

