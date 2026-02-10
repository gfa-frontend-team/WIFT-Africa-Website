'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { recommendationsApi } from '@/lib/api/recommendations'
import { RecommendedUser } from '@/types/recommendations'
import Avatar from '@/components/ui/Avatar'
import { getProfileUrl } from '@/lib/utils/routes'

export default function SuggestedConnectionsWidget() {
    const { t } = useTranslation()
    const [users, setUsers] = useState<RecommendedUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await recommendationsApi.getSuggestedConnections(3)
                const data = Array.isArray(response) ? response : response.data || []
                setUsers(data)
            } catch (err) {
                console.error('Failed to fetch suggestions:', err)
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchSuggestions()
    }, [])

    if (error || (!isLoading && users.length === 0)) return null

    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground text-sm">
                    {t('sidebar.suggested_connections')}
                </h3>
                <Link href="/connections" className="text-xs text-primary hover:underline">
                    {t('sidebar.view_all')}
                </Link>
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    [1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 animate-pulse">
                            <div className="w-10 h-10 bg-muted rounded-full"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-3 bg-muted rounded w-3/4"></div>
                                <div className="h-2 bg-muted rounded w-1/2"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="flex items-start gap-3">
                            <Link href={getProfileUrl(user)}>
                                <Avatar
                                    src={user.profilePhoto}
                                    name={`${user.firstName} ${user.lastName}`}
                                    size="sm"
                                />
                            </Link>
                            <div className="flex-1 min-w-0">
                                <Link
                                    href={getProfileUrl(user)}
                                    className="font-medium text-sm text-foreground hover:underline truncate block"
                                >
                                    {user.firstName} {user.lastName}
                                </Link>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user.headline || user.primaryRole || 'Member'}
                                </p>
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                    {user.recommendationReason}
                                </p>
                            </div>
                            <button
                                className="p-1.5 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                title="Connect"
                            >
                                <UserPlus className="h-4 w-4" />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
