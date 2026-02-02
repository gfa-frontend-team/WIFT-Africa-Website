import { useQuery } from '@tanstack/react-query'
import { postsApi } from '../api/posts'

export function usePostLikes(postId: string, isOpen: boolean) {
    return useQuery({
        queryKey: ['post-likes', postId],
        queryFn: () => postsApi.getPostLikes(postId),
        enabled: isOpen, // Only fetch when modal is open
        staleTime: 1000 * 30, // 30 seconds
    })
}
