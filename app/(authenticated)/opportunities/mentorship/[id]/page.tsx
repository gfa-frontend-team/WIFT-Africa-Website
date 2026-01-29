'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { MentorshipFormat } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Video, MapPin, Calendar, Clock, User, Briefcase, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

export default function MentorshipDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['mentorship', id],
        queryFn: () => mentorshipsApi.getMentorship(id),
        enabled: !!id
    })

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="h-6 w-32 bg-muted animate-pulse rounded mb-8"></div>
                <div className="h-64 w-full bg-muted animate-pulse rounded-xl"></div>
            </div>
        )
    }

    if (isError || !data?.data) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center max-w-md">
                <h2 className="text-xl font-semibold mb-2">Offer not found</h2>
                <p className="text-muted-foreground mb-6">
                    {(error as Error)?.message || "This mentorship offer may have been removed or closed."}
                </p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const mentorship = data.data
    const isVirtual = mentorship.mentorshipFormat === MentorshipFormat.VIRTUAL

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
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant={isVirtual ? "secondary" : "outline"}>
                                {isVirtual ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                                {mentorship.mentorshipFormat}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                                Posted {format(new Date(mentorship.createdAt), 'MMM d, yyyy')}
                            </span>
                        </div>

                        <h1 className="text-3xl font-bold mb-2">{mentorship.mentorName}</h1>
                        <p className="text-xl text-primary font-medium mb-6">{mentorship.mentorRole}</p>

                        <div className="flex flex-wrap gap-2">
                            {mentorship.areasOfExpertise.map((area) => (
                                <span key={area} className="text-sm bg-muted px-3 py-1 rounded-full text-foreground/80">
                                    {area}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">About the Mentorship</h3>
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap">
                            {mentorship.description}
                        </div>
                    </section>

                    {/* Eligibility */}
                    <section>
                        <h3 className="text-xl font-bold mb-4">Eligibility Criteria</h3>
                        <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 rounded-xl p-6 flex gap-4">
                            <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 shrink-0" />
                            <p className="text-foreground/90">{mentorship.eligibility}</p>
                        </div>
                    </section>
                </div>

                {/* Sidebar */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-24">
                        <h3 className="font-bold mb-4 border-b pb-2">Program Details</h3>

                        <div className="space-y-4 mb-6">
                            <div className="flex items-start gap-3 text-sm">
                                <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium">Duration</span>
                                    <span className="text-muted-foreground">{mentorship.duration}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium">Availability</span>
                                    <span className="text-muted-foreground">{mentorship.availability}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 text-sm">
                                <User className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                <div>
                                    <span className="block font-medium">Status</span>
                                    <Badge variant={mentorship.status === 'Open' ? 'default' : 'secondary'}>
                                        {mentorship.status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <Button className="w-full text-lg py-6 shadow-lg hover:shadow-xl transition-all">
                            Apply Now
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-3">
                            Application requires a complete profile.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
