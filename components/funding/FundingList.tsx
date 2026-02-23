'use client'

import { useFundingOpportunities } from '@/lib/hooks/useFunding'
import { FundingCard } from '@/components/funding/FundingCard'
import { FundingFilters } from '@/components/funding/FundingFilters'
import { AlertCircle, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { TargetRole } from '@/types'

export function FundingList() {
    const [search, setSearch] = useState('')
    const [selectedRole, setSelectedRole] = useState<TargetRole | undefined>()

    const { data, isLoading, isError, error } = useFundingOpportunities({
        targetRole: selectedRole
    })

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
        (op.description && op.description.toLowerCase().includes(search.toLowerCase())) ||
        (op.targetRoles && op.targetRoles.some(role => role.toLowerCase().includes(search.toLowerCase()))) ||
        (op.customRoles && op.customRoles.some(role => role.toLowerCase().includes(search.toLowerCase())))
    )

    // Separate open and closed opportunities
    const openOpportunities = filteredOpportunities.filter(opp => opp.status === 'Open')
    const closedOpportunities = filteredOpportunities.filter(opp => opp.status === 'Closed')

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Filters */}
            <FundingFilters
                selectedRole={selectedRole}
                onRoleChange={setSelectedRole}
            />

            {/* Search Bar */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search grants by name, type, role, or description..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Open Opportunities Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Open Opportunities ({openOpportunities.length})</h2>
                
                {openOpportunities.length === 0 ? (
                    <div className="bg-muted/30 border border-border rounded-xl p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-lg font-semibold mb-2">
                                {search || selectedRole ? 'No matches found' : 'No open opportunities available yet'}
                            </h3>
                            <p className="text-muted-foreground">
                                {search || selectedRole
                                    ? 'Try adjusting your search terms or filters.'
                                    : 'We are actively sourcing new grants and funding opportunities. Check back soon!'}
                            </p>
                            {(search || selectedRole) && (
                                <Button 
                                    onClick={() => {
                                        setSearch('')
                                        setSelectedRole(undefined)
                                    }}
                                    className="mt-4"
                                    variant="outline"
                                >
                                    Clear filters
                                </Button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {openOpportunities.map((opportunity) => (
                            <FundingCard key={opportunity.id || opportunity._id} opportunity={opportunity} />
                        ))}
                    </div>
                )}
            </section>

            {/* Closed Opportunities Section */}
            {closedOpportunities.length > 0 && (
                <section className="mt-12">
                    <h2 className="text-xl font-semibold mb-4 text-muted-foreground">
                        Closed Opportunities ({closedOpportunities.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60">
                        {closedOpportunities.map((opportunity) => (
                            <FundingCard key={opportunity.id || opportunity._id} opportunity={opportunity} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
