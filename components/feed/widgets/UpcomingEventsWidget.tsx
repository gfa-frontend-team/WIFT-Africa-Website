'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { recommendationsApi } from '@/lib/api/recommendations'
import { IEvent } from '@/types/recommendations'
import { format } from 'date-fns'

export default function UpcomingEventsWidget() {
    const { t } = useTranslation()
    const [events, setEvents] = useState<IEvent[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await recommendationsApi.getUpcomingEvents(3)
                setEvents(response.data)
            } catch (err) {
                console.error('Failed to fetch upcoming events:', err)
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (error || (!isLoading && events.length === 0)) return null

    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground text-sm">
                        {t('sidebar.upcoming_events')}
                    </h3>
                </div>
                <Link href="/events" className="text-xs text-primary hover:underline">
                    {t('common.view_all')}
                </Link>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    [1, 2].map((i) => (
                        <div key={i} className="animate-pulse space-y-2">
                            <div className="h-4 bg-muted rounded w-3/4"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                    ))
                ) : (
                    events.map((event) => (
                        <Link
                            key={event._id}
                            href={`/events/${event._id}`}
                            className="block p-3 border border-border rounded-lg hover:bg-accent transition-colors group"
                        >
                            <h4 className="font-medium text-sm text-foreground group-hover:text-primary line-clamp-1 mb-1">
                                {event.title}
                            </h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{format(new Date(event.startDate), 'MMM d, h:mm a')}</span>
                                {event.chapterId && (
                                    <>
                                        <span>•</span>
                                        <span>{event.chapterId.code}</span>
                                    </>
                                )}
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
