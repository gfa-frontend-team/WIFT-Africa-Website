'use client'

import { useQuery } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { MentorshipCard } from '@/components/mentorship/MentorshipCard'
import { Search, AlertCircle, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useState, useEffect } from 'react'
import { MentorshipFormat, DayOfWeek } from '@/types'
import { useDebounce } from '@/lib/hooks/useDebounce'

export function MentorshipsList() {
    const [search, setSearch] = useState('')
    const [format, setFormat] = useState<string>('all')
    const [day, setDay] = useState<string>('all')
    const [sortBy, setSortBy] = useState<string>('newest')

    // Debounce search to avoid too many API calls
    const debouncedSearch = useDebounce(search, 500)

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['mentorships', debouncedSearch, format, day, sortBy],
        queryFn: () => mentorshipsApi.getMentorships({
            search: debouncedSearch || undefined,
            format: format !== 'all' ? format : undefined,
            days: day !== 'all' ? day : undefined,
            sortBy: sortBy
        })
    })

    const mentorships = response?.data || []

    // Clear all filters
    const clearFilters = () => {
        setSearch('')
        setFormat('all')
        setDay('all')
        setSortBy('newest')
    }

    // Handle Loading
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm animate-pulse">
                    <div className="h-10 w-full md:w-1/3 bg-muted rounded"></div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="h-10 w-24 bg-muted rounded"></div>
                        <div className="h-10 w-24 bg-muted rounded"></div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="h-96 bg-muted/50 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        )
    }

    // Handle Error
    if (isError) {
        return (
            <div className="bg-destructive/5 p-8 rounded-lg flex flex-col items-center text-center border border-destructive/20">
                <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                <h3 className="text-lg font-semibold mb-2">Failed to load mentorships</h3>
                <p className="text-muted-foreground mb-4 max-w-md">
                    {(error as Error).message || "Something went wrong. Please check your connection and try again."}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Filters Bar */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by mentor, role, or expertise..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Filters Group */}
                    <div className="flex flex-wrap gap-2">
                        <Select value={format} onValueChange={setFormat}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Format" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Formats</SelectItem>
                                <SelectItem value={MentorshipFormat.VIRTUAL}>Virtual</SelectItem>
                                <SelectItem value={MentorshipFormat.PHYSICAL}>Physical</SelectItem>
                                <SelectItem value={MentorshipFormat.HYBRID}>Hybrid</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={day} onValueChange={setDay}>
                            <SelectTrigger className="w-[140px]">
                                <SelectValue placeholder="Day" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any Day</SelectItem>
                                {Object.values(DayOfWeek).map((d) => (
                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="popular">Most Popular</SelectItem>
                                <SelectItem value="startDate">Start Date</SelectItem>
                            </SelectContent>
                        </Select>

                        {(search || format !== 'all' || day !== 'all' || sortBy !== 'newest') && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearFilters}
                                title="Clear filters"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            {mentorships.length === 0 ? (
                <div className="bg-muted/30 border border-border rounded-xl p-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                        <Filter className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                            {debouncedSearch || format !== 'all' || day !== 'all'
                                ? 'No matching mentorships found'
                                : 'No mentorships available'}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                            {debouncedSearch || format !== 'all' || day !== 'all'
                                ? 'Try adjusting your search terms or filters to find what you looking for.'
                                : 'Check back later for new mentorship opportunities.'}
                        </p>
                        {(debouncedSearch || format !== 'all' || day !== 'all') && (
                            <Button onClick={clearFilters} variant="outline">
                                Clear Filters
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center text-sm text-muted-foreground px-1">
                        <span>Showing {mentorships.length} opportunities</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mentorships.map((mentorship) => (
                            <MentorshipCard key={mentorship._id || mentorship.id} mentorship={mentorship} />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
