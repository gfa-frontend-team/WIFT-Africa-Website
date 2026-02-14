'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { MentorshipFormat } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Video, MapPin, Calendar, Clock, User, CheckCircle, Star, Share2 } from 'lucide-react'
import { format } from 'date-fns'
import { MentorshipApplicationModal } from '@/components/mentorship/MentorshipApplicationModal'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function MentorshipDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string
    const queryClient = useQueryClient()

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['mentorship', id],
        queryFn: () => mentorshipsApi.getMentorship(id),
        enabled: !!id
    })

    const mentorship = response?.data

    const { mutate: toggleSave, isPending: isSaving } = useMutation({
        mutationFn: async () => {
            if (!mentorship) return
            if (mentorship.isSaved) {
                return mentorshipsApi.unsaveMentorship(mentorship._id!)
            } else {
                return mentorshipsApi.saveMentorship(mentorship._id!)
            }
        },
        onSuccess: () => {
            toast.success(mentorship?.isSaved ? 'Mentorship removed from saved' : 'Mentorship saved')
            queryClient.invalidateQueries({ queryKey: ['mentorship', id] })
            queryClient.invalidateQueries({ queryKey: ['saved-mentorships'] })
        },
        onError: () => {
            toast.error('Failed to update saved status')
        }
    })

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
                <div className="h-6 w-32 bg-muted animate-pulse rounded"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
                        <div className="h-32 bg-muted animate-pulse rounded-xl"></div>
                    </div>
                    <div className="md:col-span-1">
                        <div className="h-64 bg-muted animate-pulse rounded-xl"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (isError || !mentorship) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center max-w-md">
                <div className="bg-destructive/10 p-4 rounded-full mb-4">
                    <Video className="h-8 w-8 text-destructive" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Offer not found</h2>
                <p className="text-muted-foreground mb-6">
                    {(error as Error)?.message || "This mentorship offer may have been removed or closed."}
                </p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const isVirtual = mentorship.mentorshipFormat === MentorshipFormat.VIRTUAL

    // Format dates and schedule
    // Handle cases where dates might be invalid or missing during migration
    let dateRange = 'Date not available'
    try {
        if (mentorship.startPeriod && mentorship.endPeriod) {
            const startDate = new Date(mentorship.startPeriod)
            const endDate = new Date(mentorship.endPeriod)
            dateRange = `${format(startDate, 'MMM d, yyyy')} - ${format(endDate, 'MMM d, yyyy')}`
        }
    } catch (e) {
        console.error('Date parsing error', e)
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-8">

                    {/* Header Card */}
                    <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex gap-2">
                                <Badge variant={isVirtual ? "secondary" : "outline"} className="px-3 py-1">
                                    {isVirtual ? <Video className="w-3.5 h-3.5 mr-1.5" /> : <MapPin className="w-3.5 h-3.5 mr-1.5" />}
                                    {mentorship.mentorshipFormat}
                                </Badge>
                                {mentorship.hasApplied && (
                                    <Badge variant="default" className="bg-green-600">Applied</Badge>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => toggleSave()}
                                    disabled={isSaving}
                                    title={mentorship.isSaved ? "Unsave" : "Save"}
                                >
                                    <Star className={cn("h-4 w-4", mentorship.isSaved && "fill-yellow-500 text-yellow-500")} />
                                </Button>
                                {/* Share button placeholder */}
                                <Button variant="outline" size="icon">
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <h1 className="text-3xl font-bold mb-2">{mentorship.mentorName}</h1>
                        <p className="text-xl text-primary font-medium mb-6">{mentorship.mentorRole}</p>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {mentorship.areasOfExpertise.map((area) => (
                                <span key={area} className="text-sm bg-muted px-3 py-1 rounded-full text-foreground/80 font-medium">
                                    {area}
                                </span>
                            ))}
                        </div>

                        <div className="text-xs text-muted-foreground pt-4 border-t">
                            Posted {format(new Date(mentorship.createdAt), 'MMMM d, yyyy')}
                        </div>
                    </div>

                    {/* Description */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">About the Mentorship</h3>
                        <div className="bg-card border border-border rounded-xl p-8 shadow-sm prose prose-blue max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
                            {mentorship.description}
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
                        <h3 className="font-bold mb-4 border-b pb-4 text-lg">Program Details</h3>

                        <div className="space-y-5 mb-8">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">Duration</span>
                                    <span className="text-foreground font-medium">{dateRange}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">Schedule</span>
                                    <div className="text-foreground font-medium">
                                        <div className="mb-0.5">{mentorship.days?.join(', ') || 'TBD'}</div>
                                        <div className="text-sm text-muted-foreground">{mentorship.timeFrame || 'TBD'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium text-sm text-muted-foreground uppercase tracking-wide mb-1">Status</span>
                                    <Badge variant={mentorship.status === 'Open' ? 'default' : 'secondary'} className="mt-0.5">
                                        {mentorship.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Eligibility Box */}
                        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-lg p-4 mb-6">
                            <div className="flex gap-3 mb-2">
                                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0" />
                                <span className="font-semibold text-sm text-blue-900 dark:text-blue-100">Eligibility</span>
                            </div>
                            <p className="text-sm text-foreground/80 pl-8">{mentorship.eligibility || "Open to all members"}</p>
                        </div>

                        {mentorship.hasApplied ? (
                            <Button className="w-full text-lg py-6" disabled variant="outline">
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Application Submitted
                            </Button>
                        ) : (
                            <MentorshipApplicationModal
                                mentorshipId={mentorship._id || mentorship.id || ''}
                                mentorName={mentorship.mentorName}
                                trigger={
                                    <Button className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all" size="lg">
                                        Apply Now
                                    </Button>
                                }
                            />
                        )}

                        <p className="text-xs text-center text-muted-foreground mt-3">
                            Applications are reviewed by the mentor.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
