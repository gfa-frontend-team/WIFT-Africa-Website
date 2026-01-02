'use client'

import { useEffect } from 'react'
import { useSavedPosts } from './useSavedPosts'
import { useSavedPostsStore } from '../stores/savedPostsStore'

export const useSyncSavedPosts = () => {
    // Fetch a batch of saved posts to initialize the store
    // Limit to 100 to cover most recent activity. 
    // Ideally backend would provide an endpoint for "my interactions" or just IDs.
    const { data } = useSavedPosts(1, 100)
    const setSavedPostIds = useSavedPostsStore(state => state.setSavedPostIds)
    const isInitialized = useSavedPostsStore(state => state.isInitialized)

    useEffect(() => {
        if (data?.posts && !isInitialized) {
            const ids = data.posts.map(post => post.id)
            setSavedPostIds(ids)
        }
    }, [data, isInitialized, setSavedPostIds])
}
