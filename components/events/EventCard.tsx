import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import { Event, LocationType } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EventTypeBadge } from './EventTypeBadge'
import { format } from 'date-fns'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const isVirtual = event.location.type === LocationType.VIRTUAL
  const eventDate = new Date(event.startDate)
  const eventId = event.id || event._id

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="relative h-48 w-full bg-muted overflow-hidden rounded-t-lg">
         {/* Placeholder for Cover Image - In real app use Next/Image */}
         {event.coverImage ? (
           <img 
             src={event.coverImage} 
             alt={event.title} 
             className="w-full h-full object-cover"
           />
         ) : (
           <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
             <Calendar className="h-12 w-12 opacity-20" />
           </div>
         )}
         <div className="absolute top-2 right-2">
            <EventTypeBadge type={event.type} />
         </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="text-sm text-muted-foreground mb-1">
            {format(eventDate, 'EEE, MMMM d • h:mm a')}
        </div>
        <Link href={`/events/${eventId}`} className="hover:underline">
          <h3 className="text-xl font-semibold leading-tight line-clamp-2">{event.title}</h3>
        </Link>
      </CardHeader>
      
      <CardContent className="flex-grow space-y-2 pb-2">
        <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2 shrink-0" />
            <span className="truncate">
                {isVirtual ? 'Virtual Event' : event.location.city || event.location.address || 'Physical Location'}
            </span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-2 shrink-0" />
            <span>{event.currentAttendees || 0} Attending</span>
        </div>
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild className="w-full" variant="outline">
            <Link href={`/events/${eventId}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
