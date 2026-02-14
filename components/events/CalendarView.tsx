'use client'

import React from 'react'
import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    format,
    isToday
} from 'date-fns'
import { Event } from '@/types'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface CalendarViewProps {
    events: Event[]
    currentMonth: Date
}

export function CalendarView({ events, currentMonth }: CalendarViewProps) {
    const router = useRouter()

    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    })

    // Group events by date string (YYYY-MM-DD) for easier lookup
    const eventsByDate = events.reduce((acc, event) => {
        const dateKey = format(new Date(event.startDate), 'yyyy-MM-dd')
        if (!acc[dateKey]) {
            acc[dateKey] = []
        }
        acc[dateKey].push(event)
        return acc
    }, {} as Record<string, Event[]>)

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            {/* Days Header */}
            <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                {weekDays.map((day) => (
                    <div key={day} className="py-3 text-center text-sm font-semibold text-muted-foreground">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 auto-rows-fr bg-border gap-px">
                {calendarDays.map((day) => {
                    const dateKey = format(day, 'yyyy-MM-dd')
                    const dayEvents = eventsByDate[dateKey] || []
                    const isCurrentMonth = isSameMonth(day, monthStart)

                    return (
                        <div
                            key={day.toString()}
                            className={cn(
                                "min-h-[120px] bg-card p-2 transition-colors hover:bg-muted/5",
                                !isCurrentMonth && "bg-muted/10 text-muted-foreground"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span
                                    className={cn(
                                        "tnum text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full",
                                        isToday(day) && "bg-primary text-primary-foreground"
                                    )}
                                >
                                    {format(day, 'd')}
                                </span>
                                {dayEvents.length > 0 && (
                                    <span className="text-xs text-muted-foreground font-medium md:hidden">
                                        {dayEvents.length}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-1 mt-1">
                                {dayEvents.slice(0, 3).map((event) => (
                                    <div
                                        key={event.id || (event as any)._id}
                                        onClick={() => router.push(`/events/${event.id || (event as any)._id}`)}
                                        className="cursor-pointer text-xs truncate px-1.5 py-1 rounded-sm bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary-foreground transition-colors border border-primary/10"
                                        title={event.title}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 3 && (
                                    <div className="text-[10px] text-muted-foreground pl-1 font-medium">
                                        + {dayEvents.length - 3} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
