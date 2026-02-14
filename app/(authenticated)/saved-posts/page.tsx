'use client'

import { useQuery } from '@tanstack/react-query'
import { postsApi } from '@/lib/api/posts'
import PostCard from '@/components/feed/PostCard'
import { Loader2, Bookmark } from 'lucide-react'
import Link from 'next/link'

export default function SavedPostsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['saved-posts'],
    queryFn: () => postsApi.getSavedPosts()
  })

  const posts = data?.posts || []

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your saved posts...</p>
      </div>
    )
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-primary/10 text-primary rounded-xl">
            <Bookmark className="h-6 w-6" />
        </div>
        <div>
            <h1 className="text-2xl font-bold">Saved Posts</h1>
            <p className="text-muted-foreground">Content you've bookmarked for later</p>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {posts.map((post: any) => (
             <PostCard key={post.id} post={{ ...post, isSaved: true }} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
           <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
           <h3 className="text-lg font-semibold mb-2">No saved posts yet</h3>
           <p className="text-muted-foreground mb-6">When you save posts, they'll appear here.</p>
           <Link href="/feed" className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors">
             Go to Feed
           </Link>
        </div>
      )}
    </div>
  )
}
