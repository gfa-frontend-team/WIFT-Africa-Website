import { Badge } from "@/components/ui/badge"
import { EventType } from "@/types"

const TYPE_COLORS: Record<EventType, string> = {
  [EventType.WORKSHOP]: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  [EventType.SCREENING]: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  [EventType.NETWORKING]: "bg-green-100 text-green-800 hover:bg-green-200",
  [EventType.MEETUP]: "bg-orange-100 text-orange-800 hover:bg-orange-200",
  [EventType.CONFERENCE]: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
  [EventType.OTHER]: "bg-gray-100 text-gray-800 hover:bg-gray-200",
}

interface EventTypeBadgeProps {
  type: EventType
  className?: string
}

export function EventTypeBadge({ type, className }: EventTypeBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={`${TYPE_COLORS[type] || TYPE_COLORS.OTHER} ${className}`}
    >
      {type}
    </Badge>
  )
}
