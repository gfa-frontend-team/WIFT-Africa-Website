'use client'

import { useQuery } from '@tanstack/react-query'
import { fundingApi } from '@/lib/api/funding'
import { FundingCard } from '@/components/funding/FundingCard'
import { AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function FundingList() {
    const [search, setSearch] = useState('')

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['funding-opportunities'],
        queryFn: () => fundingApi.getFundingOpportunities()
    })
    console.log(data,"data");
    

    // Handle Loading
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-12 w-full max-w-md bg-gray-100 rounded animate-pulse"></div>
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
                <h3 className="text-lg font-semibold mb-2">Failed to load funding opportunities</h3>
                <p className="text-muted-foreground mb-4">
                    {(error as Error).message || "Something went wrong. Please try again."}
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    const opportunities = data?.data || []

    // Client-side search filtering
    const filteredOpportunities = opportunities.filter(op =>
        op.name.toLowerCase().includes(search.toLowerCase()) ||
        op.fundingType.toLowerCase().includes(search.toLowerCase()) ||
        (op.description && op.description.toLowerCase().includes(search.toLowerCase()))
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Search Bar */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search grants by name, type, or description..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            {filteredOpportunities.length === 0 ? (
                <div className="bg-muted/30 border border-border rounded-xl p-12 text-center">
                    <div className="max-w-md mx-auto">
                        <h3 className="text-lg font-semibold mb-2">
                            {search ? 'No matches found' : 'No funding opportunities available yet'}
                        </h3>
                        <p className="text-muted-foreground">
                            {search
                                ? 'Try adjusting your search terms.'
                                : 'We are actively sourcing new grants and funding opportunities. Check back soon!'}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOpportunities.map((opportunity) => (
                        <FundingCard key={opportunity.id || opportunity._id} opportunity={opportunity} />
                    ))}
                </div>
            )}
        </div>
    )
}
