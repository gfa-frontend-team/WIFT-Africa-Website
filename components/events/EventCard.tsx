import Link from 'next/link'
import Image from 'next/image'
import { Calendar, MapPin, Users, Check, Star, XCircle } from 'lucide-react'
import { Event, LocationType, RSVPStatus, EventStatus } from '@/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EventTypeBadge } from './EventTypeBadge'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const isVirtual = event.location.type === LocationType.VIRTUAL
  const eventDate = new Date(event.startDate)
  const eventId = event.id || event._id
  
  // Status checks
  const isCancelled = event.status === EventStatus.CANCELLED || event.isCancelled
  const isCompleted = event.status === EventStatus.COMPLETED
  const myRSVP = event.myRSVP
  
  // Calculate capacity percentage
  const capacityPercentage = event.capacity 
    ? ((event.currentAttendees || 0) / event.capacity) * 100 
    : 0
  const showCapacityWarning = capacityPercentage > 50
  const isFull = event.capacity ? (event.currentAttendees || 0) >= event.capacity : false

  return (
    <Card className={cn(
      "flex flex-col h-full hover:shadow-md transition-shadow relative",
      isCancelled && "opacity-60"
    )}>
      {/* Cancelled Overlay */}
      {isCancelled && (
        <div className="absolute inset-0 bg-destructive/10 z-10 flex items-center justify-center rounded-lg">
          <div className="bg-destructive text-destructive-foreground px-4 py-2 rounded-full font-semibold text-sm">
            CANCELLED
          </div>
        </div>
      )}
      
      <div className="relative h-48 w-full bg-muted overflow-hidden rounded-t-lg">
         {/* Cover Image */}
         {event.coverImage ? (
           <Image 
             src={event.coverImage} 
             alt={event.title} 
             fill
             className="object-cover"
           />
         ) : (
           <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground">
             <Calendar className="h-12 w-12 opacity-20" />
           </div>
         )}
         
         {/* Event Type Badge */}
         <div className="absolute top-2 right-2 z-20">
            <EventTypeBadge type={event.type} />
         </div>
         
         {/* RSVP Status Badge */}
         {myRSVP && !isCancelled && (
           <div className="absolute top-2 left-2 z-20">
             {myRSVP === RSVPStatus.GOING ? (
               <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                 <Check className="h-3 w-3" />
                 Going
               </div>
             ) : (
               <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                 <Star className="h-3 w-3 fill-current" />
                 Interested
               </div>
             )}
           </div>
         )}
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
        
        {/* Chapter */}
        {event.chapter && (
          <div className="text-xs text-muted-foreground">
            {event.chapter.name}
          </div>
        )}
        
        {/* Capacity Indicator */}
        {event.capacity && showCapacityWarning && !isCancelled && (
          <div className="pt-2 border-t">
            {isFull ? (
              <div className="flex items-center gap-2 text-destructive text-sm font-medium">
                <XCircle className="h-4 w-4" />
                Event Full
              </div>
            ) : (
              <div className="flex items-center gap-2 text-orange-600 text-sm">
                <Users className="h-4 w-4" />
                {event.capacity - (event.currentAttendees || 0)} spots left
              </div>
            )}
          </div>
        )}
        
        {!event.capacity && (
          <div className="flex items-center text-sm text-muted-foreground">
              <Users className="h-4 w-4 mr-2 shrink-0" />
              <span>{event.currentAttendees || 0} Attending</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-2">
        <Button asChild className="w-full" variant="outline">
            <Link href={`/events/${eventId}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
