'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { MentorshipCard } from '@/components/mentorship/MentorshipCard'
import { Button } from '@/components/ui/button'
import { AlertCircle, Bookmark } from 'lucide-react'
import Link from 'next/link'
import { SavedMentorship } from '@/types'

export default function SavedMentorshipsPage() {
    const queryClient = useQueryClient()

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['saved-mentorships'],
        queryFn: () => mentorshipsApi.getSavedMentorships()
    })

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
                <h1 className="text-2xl font-bold mb-6">Saved Mentorships</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-muted animate-pulse rounded-xl"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="bg-destructive/5 p-8 rounded-lg flex flex-col items-center text-center border border-destructive/20">
                    <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Failed to load saved mentorships</h3>
                    <p className="text-muted-foreground mb-4">
                        {(error as Error).message || "Something went wrong. Please try again."}
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
                </div>
            </div>
        )
    }

    const savedItems = response?.data || []

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Bookmark className="h-6 w-6 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Saved Opportunities</h1>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/opportunities/mentorship">
                        Browse All
                    </Link>
                </Button>
            </div>

            {savedItems.length === 0 ? (
                <div className="bg-muted/30 border border-border rounded-xl p-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                        <Bookmark className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No saved mentorships yet</h3>
                        <p className="text-muted-foreground mb-6">
                            Save mentorship opportunities you're interested in to view them later here.
                        </p>
                        <Button asChild>
                            <Link href="/opportunities/mentorship">
                                Explore Opportunities
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedItems.map((item: SavedMentorship) => {
                        const mentorship = typeof item.mentorshipId === 'object' ? item.mentorshipId : null

                        if (!mentorship) {
                            return null
                        }

                        const mentorshipWithSavedStatus = { ...mentorship, isSaved: true }

                        return (
                            <MentorshipCard
                                key={item._id}
                                mentorship={mentorshipWithSavedStatus}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}
