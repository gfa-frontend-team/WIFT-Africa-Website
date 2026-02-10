'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { TrendingUp, MessageSquare, Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { recommendationsApi } from '@/lib/api/recommendations'
import type { Post } from '@/lib/api/posts'

export default function TrendingPostsWidget() {
    const { t } = useTranslation()
    const [posts, setPosts] = useState<Post[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(false)

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await recommendationsApi.getTrendingPosts(3)
                // Ensure response is treated as an array
                const data = Array.isArray(response) ? response : (response as { data?: Post[] }).data || []
                setPosts(data)
            } catch (err) {
                console.error('Failed to fetch trending posts:', err)
                setError(true)
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [])

    if (error || (!isLoading && posts.length === 0)) return null

    return (
        <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <h3 className="font-semibold text-foreground text-sm">
                    {t('sidebar.trending_posts')}
                </h3>
            </div>

            <div className="space-y-3">
                {isLoading ? (
                    [1, 2].map((i) => (
                        <div key={i} className="animate-pulse space-y-2">
                            <div className="h-4 bg-muted rounded w-full"></div>
                            <div className="h-4 bg-muted rounded w-2/3"></div>
                        </div>
                    ))
                ) : (
                    posts.map((post) => (
                        <Link
                            key={post.id}
                            href="/feed"
                            className="block p-3 border border-border rounded-lg hover:bg-accent transition-colors group"
                        >
                            <p className="text-sm text-foreground line-clamp-2 mb-2 group-hover:text-primary">
                                {post.content}
                            </p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span className="font-medium">
                                    {post.author.firstName} {post.author.lastName}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <Heart className="h-3 w-3" /> {post.likesCount}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="h-3 w-3" /> {post.commentsCount}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}
