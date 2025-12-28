'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Pin } from 'lucide-react'
import { type Post } from '@/lib/api/posts'
import Avatar from '@/components/ui/Avatar'
import { usePostMutations } from '@/lib/hooks/usePostMutations'
import CommentSection from './CommentSection'
import { useAuth } from '@/lib/hooks/useAuth'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const [showComments, setShowComments] = useState(false)
  const { likePost, savePost, isLiking, isSaving } = usePostMutations()
  const { user } = useAuth()
  
  const handleLike = async () => {
    try {
      await likePost(post.id)
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleSave = async () => {
    try {
      await savePost(post.id)
    } catch (error) {
      console.error('Failed to save post:', error)
    }
  }

  const handleShare = () => {
    // TODO: Implement share modal
    console.log('Share post:', post.id)
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getPrivacyLabel = (visibility: string) => {
    switch (visibility) {
      case 'CHAPTER_ONLY':
        return '👥 Chapter'
      case 'CONNECTIONS_ONLY':
        return '🔒 Connections'
      default:
        return null
    }
  }

  const isOwnPost = user?.id === post.author.id

  return (
    <article className="bg-card border border-border rounded-lg">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Link href={`/in/${post.author.username || post.author.id}`}>
            <Avatar
              src={post.author.profilePhoto}
              name={`${post.author.firstName} ${post.author.lastName}`}
              size="md"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/in/${post.author.username || post.author.id}`}
                className="font-semibold text-foreground hover:underline block truncate"
              >
                {post.author.firstName} {post.author.lastName}
              </Link>
              {post.isAdminPost && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  Admin
                </span>
              )}
              {post.isPinned && (
                <Pin className="h-4 w-4 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {post.author.primaryRole}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{formatTimestamp(post.createdAt)}</span>
              {getPrivacyLabel(post.visibility) && (
                <>
                  <span>•</span>
                  <span>{getPrivacyLabel(post.visibility)}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <button className="p-2 hover:bg-accent rounded-lg transition-colors">
          <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className={`grid gap-1 ${
          post.media.length === 1 ? 'grid-cols-1' :
          post.media.length === 2 ? 'grid-cols-2' :
          post.media.length === 3 ? 'grid-cols-3' :
          'grid-cols-2'
        }`}>
          {post.media.slice(0, 4).map((media, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden bg-muted"
            >
              {media.type === 'image' ? (
                <img
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  className="w-full h-full object-cover hover:opacity-90 transition-opacity cursor-pointer"
                />
              ) : (
                <video
                  src={media.url}
                  className="w-full h-full object-cover"
                  controls
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {index === 3 && post.media && post.media.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <span className="text-white text-2xl font-semibold">
                    +{post.media.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Interaction Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-muted-foreground border-t border-border">
        <button className="hover:underline">
          {post.likesCount > 0 && `${post.likesCount} ${post.likesCount === 1 ? 'like' : 'likes'}`}
        </button>
        <div className="flex items-center gap-3">
          {post.commentsCount > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:underline"
            >
              {post.commentsCount} {post.commentsCount === 1 ? 'comment' : 'comments'}
            </button>
          )}
          {post.sharesCount > 0 && (
            <button className="hover:underline">
              {post.sharesCount} {post.sharesCount === 1 ? 'share' : 'shares'}
            </button>
          )}
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-border">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            post.isLiked
              ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
              : 'text-muted-foreground hover:bg-accent'
          } ${isLiking ? 'scale-95' : 'hover:scale-105 active:scale-95'}`}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 ${
              post.isLiked ? 'fill-current animate-pulse' : ''
            }`}
          />
          <span className="text-sm font-medium hidden sm:inline">
            {post.isLiked ? 'Liked' : 'Like'}
          </span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
            showComments
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Comment</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">Share</span>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${
            post.isSaved
              ? 'text-primary bg-primary/10'
              : 'text-muted-foreground hover:bg-accent'
          }`}
        >
          <Bookmark className={`h-5 w-5 ${post.isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          onAddComment={(content) => {
            console.log('Add comment:', content)
            // TODO: Implement add comment functionality
          }}
          onLikeComment={(commentId) => {
            console.log('Like comment:', commentId)
            // TODO: Implement like comment functionality
          }}
          onReply={(commentId, content) => {
            console.log('Reply to comment:', commentId, content)
            // TODO: Implement reply functionality
          }}
        />
      )}
    </article>
  )
}