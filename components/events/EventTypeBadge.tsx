import { EventType } from '@/types'
import { cn } from '@/lib/utils'

interface EventTypeBadgeProps {
  type: EventType
  className?: string
}

const eventTypeConfig = {
  [EventType.WORKSHOP]: {
    label: 'Workshop',
    className: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  [EventType.SCREENING]: {
    label: 'Screening',
    className: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  [EventType.NETWORKING]: {
    label: 'Networking',
    className: 'bg-green-100 text-green-800 border-green-200'
  },
  [EventType.MEETUP]: {
    label: 'Meetup',
    className: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  [EventType.CONFERENCE]: {
    label: 'Conference',
    className: 'bg-red-100 text-red-800 border-red-200'
  },
  [EventType.OTHER]: {
    label: 'Other',
    className: 'bg-gray-100 text-gray-800 border-gray-200'
  }
}

export function EventTypeBadge({ type, className }: EventTypeBadgeProps) {
  const config = eventTypeConfig[type]
  
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}