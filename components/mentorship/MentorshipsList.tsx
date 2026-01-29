'use client'

import { useQuery } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { MentorshipCard } from '@/components/mentorship/MentorshipCard'
import { PlusCircle, Search, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'

export function MentorshipsList() {
    const [search, setSearch] = useState('')

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['mentorships'],
        queryFn: () => mentorshipsApi.getMentorships()
    })

    // Handle Loading
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm animate-pulse">
                    <div className="h-10 w-64 bg-gray-200 rounded"></div>
                    <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    // Handle Error
    if (isError) {
        return (
            <div className="bg-destructive/5 p-8 rounded-lg flex flex-col items-center text-center">
                <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                <h3 className="text-lg font-semibold mb-2">Failed to load mentorships</h3>
                <p className="text-muted-foreground mb-4">
                    {(error as Error).message || "Something went wrong. Please try again."}
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    const mentorships = data?.data || []

    // Client-side search filtering
    const filteredMentorships = mentorships.filter(m =>
        m.mentorName.toLowerCase().includes(search.toLowerCase()) ||
        m.mentorRole.toLowerCase().includes(search.toLowerCase()) ||
        m.areasOfExpertise.some(area => area.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Search & Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative w-full sm:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by mentor, role, or expertise..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <Button asChild className="w-full sm:w-auto">
                    <Link href="/opportunities/mentorship/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Become a Mentor
                    </Link>
                </Button>
            </div>

            {/* Grid */}
            {filteredMentorships.length === 0 ? (
                <div className="bg-muted/30 border border-border rounded-xl p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-2">
                            {search ? 'No matches found' : 'No mentorships available yet'}
                        </h3>
                        <p className="text-muted-foreground">
                            {search
                                ? 'Try adjusting your search terms.'
                                : 'Be the first to offer mentorship to our community!'}
                        </p>
                        {!search && (
                            <Button asChild className="mt-4" variant="outline">
                                <Link href="/opportunities/mentorship/create">
                                    Create Offer
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMentorships.map((mentorship) => (
                        <MentorshipCard key={mentorship.id || mentorship._id} mentorship={mentorship} />
                    ))}
                </div>
            )}
        </div>
    )
}
