'use client'

import { useEffect, useState } from 'react'

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { postsApi, type Post } from '@/lib/api/posts'
import PostCard from '@/components/feed/PostCard'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default function SinglePostPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = params?.id as string
  const showComments = searchParams.get('comments') === 'true'

  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchPost = async () => {
      try {
        setIsLoading(true)
        const response = await postsApi.getPost(id)
        setPost(response.post)
      } catch (err: any) {
        console.error('Failed to fetch post:', err)
        setError(err.message || 'Failed to load post')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading post...</p>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6 inline-flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error || 'Post not found'}</span>
        </div>
        <div>
            <Link 
                href="/feed" 
                className="text-primary hover:underline font-medium"
            >
                Return to Feed
            </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <PostCard post={post} initialShowComments={showComments} />
    </div>
  )
}
