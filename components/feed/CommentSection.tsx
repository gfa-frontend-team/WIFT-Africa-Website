'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MoreHorizontal, Reply } from 'lucide-react'
import { type Comment } from '@/lib/api/posts'
import { postsApi } from '@/lib/api/posts'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { getProfileUrl } from '@/lib/utils/routes'

interface CommentSectionProps {
  postId: string
  onAddComment?: (content: string) => void
  onLikeComment?: (commentId: string) => void
  onReply?: (commentId: string, content: string) => void
}

interface CommentItemProps {
  comment: Comment
  allComments: Comment[]
  user: any
  onLike: (id: string) => void
  onReplySubmit: (id: string, content: string) => void
  onLoadReplies: (id: string) => Promise<void>
  depth?: number
}

const CommentItem = ({ 
  comment, 
  allComments, 
  user,
  onLike, 
  onReplySubmit,
  onLoadReplies,
  depth = 0 
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [loadingReplies, setLoadingReplies] = useState(false)
  
  const replies = allComments.filter((c) => c.parentCommentId === comment.id)
  const hasMoreReplies = comment.repliesCount > replies.length

  const handleReply = () => {
    if (!replyContent.trim()) return
    onReplySubmit(comment.id, replyContent)
    setIsReplying(false)
    setReplyContent('')
  }

  const handleLoadReplies = async () => {
    try {
      setLoadingReplies(true)
      await onLoadReplies(comment.id)
    } finally {
      setLoadingReplies(false)
    }
  }

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString()
  }

  return (
    <div className={`space-y-4 ${depth > 0 ? 'ml-8 relative' : ''}`}>
      {depth > 0 && (
        <div className="absolute top-0 left-[-20px] bottom-0 w-[2px] bg-border rounded-full" />
      )}
      <div className="flex items-start gap-3">
        <Link href={getProfileUrl(comment.author)}>
          <Avatar
            src={comment.author.profilePhoto}
            name={`${comment.author.firstName} ${comment.author.lastName}`}
            size="sm"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="bg-accent rounded-2xl px-4 py-3">
            <Link
              href={`/${comment.author.username}`}
              className="font-semibold text-sm text-foreground hover:underline"
            >
              {comment.author.firstName} {comment.author.lastName}
            </Link>
            <p className="text-sm text-foreground mt-1 break-words whitespace-pre-wrap">
              {comment.content}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-1 px-4">
            <button
              onClick={() => onLike(comment.id)}
              className={`text-xs font-semibold transition-colors flex items-center gap-1 ${
                comment.isLiked
                  ? 'text-red-500'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {comment.likesCount > 0 && (
                <Heart className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
              )}
              {comment.isLiked ? 'Liked' : 'Like'}
              {comment.likesCount > 0 && <span>{comment.likesCount}</span>}
            </button>
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Reply
            </button>
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(comment.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="flex items-start gap-3 pl-11">
          <Avatar 
            src={user.profilePhoto} 
            name={`${user.firstName} ${user.lastName}`} 
            size="sm" 
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder={`Reply to ${comment.author.firstName}...`}
              className="flex-1 px-4 py-2 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleReply()
              }}
            />
            <button
              onClick={handleReply}
              disabled={!replyContent.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {replies.length > 0 && (
        <div className="space-y-4 pt-2">
          {replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              allComments={allComments}
              user={user}
              onLike={onLike}
              onReplySubmit={onReplySubmit}
              onLoadReplies={onLoadReplies}
              depth={depth + 1}
            />
          ))}
        </div>
      )}

      {hasMoreReplies && (
        <button 
          onClick={handleLoadReplies}
          disabled={loadingReplies}
          className="ml-11 text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-2"
        >
          {loadingReplies ? (
            <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></span>
          ) : (
            <Reply className="h-3 w-3 rotate-180" />
          )}
          View {comment.repliesCount - replies.length} more replies
        </button>
      )}
    </div>
  )
}

export default function CommentSection({
  postId,
  onAddComment,
  onLikeComment,
  onReply,
}: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments when component mounts
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const response = await postsApi.getComments(postId, 1, 5) // Fetch fewer initially
      setComments(response.comments)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadReplies = async (commentId: string) => {
    try {
      // Fetch all replies (or paginate if needed, for now getting first page is fine)
      const response = await postsApi.getReplies(commentId, 1, 50)
      
      setComments(prev => {
        // Filter out existing ones to avoid duplicates
        const existingIds = new Set(prev.map(c => c.id))
        const newReplies = response.comments.filter(c => !existingIds.has(c.id))
        return [...prev, ...newReplies]
      })
    } catch (error) {
      console.error('Failed to load replies:', error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await postsApi.addComment(postId, newComment)
      
      setComments(prev => [response.comment, ...prev])
      setNewComment('')
      
      if (onAddComment) {
        onAddComment(newComment)
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReplySubmit = async (commentId: string, content: string) => {
    try {
      const response = await postsApi.addComment(postId, content, commentId)
      setComments(prev => {
        // Find parent and increment repliesCount locally if needed
        const updated = prev.map(c => {
          if (c.id === commentId) {
            return { ...c, repliesCount: c.repliesCount + 1 }
          }
          return c
        })
        return [...updated, response.comment]
      })
      
      if (onReply) {
        onReply(commentId, content)
      }
    } catch (error) {
      console.error('Failed to add reply:', error)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    // Optimistic update
    setComments(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          isLiked: !c.isLiked,
          likesCount: c.isLiked ? c.likesCount - 1 : c.likesCount + 1
        }
      }
      return c
    }))

    // TODO: Call API
    if (onLikeComment) {
      onLikeComment(commentId)
    }
  }

  const topLevelComments = comments.filter((c) => !c.parentCommentId)
  
  const displayedComments = showAllComments
    ? topLevelComments
    : topLevelComments.slice(0, 3)

  if (!user) {
    return (
      <div className="px-4 py-3 border-t border-border bg-muted/30">
        <p className="text-sm text-muted-foreground text-center">
          Please log in to view and add comments.
        </p>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 border-t border-border bg-muted/30">
      {/* Comment Input */}
      <form onSubmit={handleSubmitComment} className="flex items-start gap-3 mb-6">
        <Avatar 
          src={user.profilePhoto} 
          name={`${user.firstName} ${user.lastName}`} 
          size="sm" 
        />
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            disabled={isSubmitting}
            className="w-full px-4 py-2 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-50"
          />
        </div>
      </form>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {displayedComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            allComments={comments}
            user={user}
            onLike={handleLikeComment}
            onReplySubmit={handleReplySubmit}
            onLoadReplies={handleLoadReplies}
          />
        ))}
        
        {topLevelComments.length > 3 && !showAllComments && (
          <button
            onClick={() => setShowAllComments(true)}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pl-11"
          >
            View {topLevelComments.length - 3} more comments
          </button>
        )}

        {comments.length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No comments yet. Be the first to comment!
          </p>
        )}
      </div>
    </div>
  )
}