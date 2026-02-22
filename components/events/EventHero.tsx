'use client'

import { format } from 'date-fns'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { Event, LocationType } from '@/types'
import { EventTypeBadge } from './EventTypeBadge'
import { Badge } from '@/components/ui/badge'

interface EventHeroProps {
  event: Event
}

export function EventHero({ event }: EventHeroProps) {
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const isVirtual = event.location.type === LocationType.VIRTUAL

  return (
    <div className="relative bg-muted/30">
        {/* Cover Image Background (simulated) */}
        <div className="absolute inset-0 overflow-hidden">
             {event.coverImage && (
                <>
                <div className="absolute inset-0 bg-black/50 z-10" />
                <img 
                    src={event.coverImage} 
                    alt="Background" 
                    className="w-full h-full object-cover blur-sm"
                />
                </>
             )}
        </div>

      <div className="relative z-20 container mx-auto px-4 py-8 md:py-12 max-w-7xl">
        <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Main Cover Image */}
            <div className="w-full md:w-1/3 aspect-video md:aspect-[4/3] rounded-xl overflow-hidden shadow-lg bg-muted flex items-center justify-center">
                {event.coverImage ? (
                    <img 
                        src={event.coverImage} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Calendar className="h-20 w-20 text-muted-foreground/30" />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4 text-foreground md:text-foreground">
                <div className="flex flex-wrap gap-2">
                    <EventTypeBadge type={event.type} />
                    {event.status === 'CANCELLED' && <Badge variant="destructive">Cancelled</Badge>}
                    {event.status === 'DRAFT' && <Badge variant="outline">Draft</Badge>}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">{event.title}</h1>

                <div className="grid gap-3 text-sm md:text-base">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-primary shrink-0" />
                        <div className='text-white'>
                            <div className="font-semibold">
                                {format(startDate, 'EEEE, MMMM d, yyyy')}
                            </div>
                            <div className="text-white/80">
                                {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                            <div className="font-semibold text-white">
                                {isVirtual ? 'Virtual Event' : (event.location.address || 'Physical Location')}
                            </div>
                            <div className="text-white/80">
                                {isVirtual 
                                    ? 'Link provided upon registration' 
                                    : [event.location.city, event.location.country].filter(Boolean).join(', ')
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
