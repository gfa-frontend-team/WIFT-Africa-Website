'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Briefcase, MapPin } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { recommendationsApi } from '@/lib/api/recommendations'
import { Opportunity } from '@/types/recommendations'

export default function LatestOpportunitiesWidget() {
    const { t } = useTranslation()
    const [opportunities, setOpportunities] = useState<Opportunity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const response = await recommendationsApi.getLatestOpportunities(3)
                // Handle response.data or direct array depending on API structure
                const data = Array.isArray(response) ? response : response.data || []
                setOpportunities(data)
            } catch (err) {
                console.error('Failed to fetch opportunities:', err)
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchOpportunities()
    }, [])

    if (error || (!isLoading && opportunities.length === 0)) return null

    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold text-foreground text-sm">
                        {t('sidebar.latest_opportunities')}
                    </h3>
                </div>
                <Link href="/opportunities" className="text-xs text-primary hover:underline">
                    {t('sidebar.view_all')}
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
                    opportunities.map((opp) => {
                        const isJob = opp.type === 'JOB'
                        const title = isJob ? opp.title : opp.name
                        const subtitle = isJob ? opp.company : opp.fundingType
                        const location = isJob ? opp.location : opp.region

                        return (
                            <Link
                                key={opp._id}
                                href="/opportunities"
                                className="block p-3 border border-border rounded-lg hover:bg-accent transition-colors group"
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isJob ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {isJob ? 'JOB' : 'FUND'}
                                    </span>
                                </div>
                                <h4 className="font-medium text-sm text-foreground group-hover:text-primary line-clamp-1">
                                    {title}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-1">{subtitle}</p>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span className="line-clamp-1">{location}</span>
                                </div>
                            </Link>
                        )
                    })
                )}
            </div>
        </div>
    )
}
