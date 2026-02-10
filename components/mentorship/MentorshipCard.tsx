'use client'

import { Mentorship, MentorshipFormat } from '@/types'
import { Video, MapPin, Clock, Calendar, Star, Eye } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface MentorshipCardProps {
    mentorship: Mentorship
}

export function MentorshipCard({ mentorship }: MentorshipCardProps) {
    const queryClient = useQueryClient()
    const isVirtual = mentorship.mentorshipFormat === MentorshipFormat.VIRTUAL

    // Format dates
    const startDate = new Date(mentorship.startPeriod)
    const endDate = new Date(mentorship.endPeriod)
    const dateRange = `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`

    const { mutate: toggleSave, isPending: isSaving } = useMutation({
        mutationFn: async () => {
            if (mentorship.isSaved) {
                return mentorshipsApi.unsaveMentorship(mentorship._id!)
            } else {
                return mentorshipsApi.saveMentorship(mentorship._id!)
            }
        },
        onSuccess: () => {
            toast.success(mentorship.isSaved ? 'Mentorship removed from saved' : 'Mentorship saved')
            queryClient.invalidateQueries({ queryKey: ['mentorships'] })
            queryClient.invalidateQueries({ queryKey: ['saved-mentorships'] })
        },
        onError: () => {
            toast.error('Failed to update saved status')
        }
    })

    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        toggleSave()
    }

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow relative group">
            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="mr-8">
                        <h3 className="text-lg font-bold text-foreground line-clamp-1">{mentorship.mentorName}</h3>
                        <p className="text-sm text-primary font-medium">{mentorship.mentorRole}</p>
                    </div>

                    {/* Save Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 text-muted-foreground hover:text-yellow-500"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        <Star className={cn("h-5 w-5", mentorship.isSaved && "fill-yellow-500 text-yellow-500")} />
                        <span className="sr-only">Save</span>
                    </Button>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant={isVirtual ? "secondary" : "outline"} className="shrink-0">
                        {isVirtual ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                        {mentorship.mentorshipFormat}
                    </Badge>

                    {mentorship.hasApplied && (
                        <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            Applied
                        </Badge>
                    )}

                    {mentorship.status === 'Closed' && (
                        <Badge variant="destructive">Closed</Badge>
                    )}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 gap-2 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 shrink-0" />
                        <span>{dateRange}</span>
                    </div>
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 shrink-0" />
                        <span className="truncate">
                            {mentorship.days.join(', ')} • {mentorship.timeFrame}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                    {mentorship.description}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {mentorship.areasOfExpertise.slice(0, 2).map((area) => (
                        <span key={area} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                            {area}
                        </span>
                    ))}
                    {mentorship.areasOfExpertise.length > 2 && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                            +{mentorship.areasOfExpertise.length - 2}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-auto flex items-center justify-between gap-4">
                    {mentorship.viewCount !== undefined && (
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Eye className="w-3 h-3 mr-1" />
                            {mentorship.viewCount} views
                        </div>
                    )}

                    <Button asChild className="w-full ml-auto" variant={mentorship.hasApplied ? "outline" : "default"}>
                        <Link href={`/opportunities/mentorship/${mentorship._id || mentorship.id}`}>
                            {mentorship.hasApplied ? 'View Application' : 'View Details'}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
