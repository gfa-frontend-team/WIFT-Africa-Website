'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, MoreHorizontal } from 'lucide-react'
import { type Comment } from '@/lib/api/posts'
import { postsApi } from '@/lib/api/posts'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/lib/hooks/useAuth'

interface CommentSectionProps {
  postId: string
  onAddComment?: (content: string) => void
  onLikeComment?: (commentId: string) => void
  onReply?: (commentId: string, content: string) => void
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
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [showAllComments, setShowAllComments] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load comments when component mounts
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      const response = await postsApi.getComments(postId, 1, 20)
      setComments(response.comments)
    } catch (error) {
      console.error('Failed to load comments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await postsApi.addComment(postId, newComment)
      
      // Add new comment to the list
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

  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || isSubmitting) return

    try {
      setIsSubmitting(true)
      const response = await postsApi.addComment(postId, replyContent, commentId)
      
      // Add new reply to the list
      setComments(prev => [response.comment, ...prev])
      setReplyContent('')
      setReplyingTo(null)
      
      if (onReply) {
        onReply(commentId, replyContent)
      }
    } catch (error) {
      console.error('Failed to add reply:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    // TODO: Implement comment liking when API is available
    if (onLikeComment) {
      onLikeComment(commentId)
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

  // Separate top-level comments and replies
  const topLevelComments = comments.filter((c) => !c.parentCommentId)
  const getReplies = (commentId: string) =>
    comments.filter((c) => c.parentCommentId === commentId)

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
      <form onSubmit={handleSubmitComment} className="flex items-start gap-3 mb-4">
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
      {displayedComments.length > 0 && (
        <div className="space-y-4">
          {displayedComments.map((comment) => {
            const replies = getReplies(comment.id)
            const isReplying = replyingTo === comment.id

            return (
              <div key={comment.id} className="space-y-2">
                {/* Comment */}
                <div className="flex items-start gap-3">
                  <Link href={`/${comment.author.username}`}>
                    <Avatar
                      src={comment.author.profilePhoto}
                      name={`${comment.author.firstName} ${comment.author.lastName}`}
                      size="sm"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="bg-accent rounded-2xl px-4 py-2">
                      <Link
                        href={`/${comment.author.username}`}
                        className="font-semibold text-sm text-foreground hover:underline"
                      >
                        {comment.author.firstName} {comment.author.lastName}
                      </Link>
                      <p className="text-sm text-foreground mt-1 break-words">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 mt-1 px-4">
                      <button
                        onClick={() => handleLikeComment(comment.id)}
                        className={`text-xs font-medium transition-colors ${
                          comment.isLiked
                            ? 'text-red-500'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {comment.isLiked ? 'Liked' : 'Like'}
                      </button>
                      <button
                        onClick={() => setReplyingTo(isReplying ? null : comment.id)}
                        className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Reply
                      </button>
                      <span className="text-xs text-muted-foreground">
                        {formatTimestamp(comment.createdAt)}
                      </span>
                      {comment.likesCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                          <span>{comment.likesCount}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <button className="p-1 hover:bg-accent rounded-lg transition-colors">
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {/* Reply Input */}
                {isReplying && (
                  <div className="ml-12 flex items-start gap-3">
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
                        disabled={isSubmitting}
                        className="flex-1 px-4 py-2 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm disabled:opacity-50"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSubmitReply(comment.id)}
                        disabled={!replyContent.trim() || isSubmitting}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Nested Replies */}
                {replies.length > 0 && (
                  <div className="ml-12 space-y-3">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-3">
                        <Link href={`/${reply.author.username}`}>
                          <Avatar
                            src={reply.author.profilePhoto}
                            name={`${reply.author.firstName} ${reply.author.lastName}`}
                            size="sm"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="bg-accent rounded-2xl px-4 py-2">
                            <Link
                              href={`/${reply.author.username}`}
                              className="font-semibold text-sm text-foreground hover:underline"
                            >
                              {reply.author.firstName} {reply.author.lastName}
                            </Link>
                            <p className="text-sm text-foreground mt-1 break-words">
                              {reply.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 mt-1 px-4">
                            <button
                              onClick={() => handleLikeComment(reply.id)}
                              className={`text-xs font-medium transition-colors ${
                                reply.isLiked
                                  ? 'text-red-500'
                                  : 'text-muted-foreground hover:text-foreground'
                              }`}
                            >
                              {reply.isLiked ? 'Liked' : 'Like'}
                            </button>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(reply.createdAt)}
                            </span>
                            {reply.likesCount > 0 && (
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                                <span>{reply.likesCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button className="p-1 hover:bg-accent rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Load More Comments */}
          {topLevelComments.length > 3 && !showAllComments && (
            <button
              onClick={() => setShowAllComments(true)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              View {topLevelComments.length - 3} more{' '}
              {topLevelComments.length - 3 === 1 ? 'comment' : 'comments'}
            </button>
          )}
        </div>
      )}

      {/* Empty State */}
      {comments.length === 0 && !isLoading && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No comments yet. Be the first to comment!
        </p>
      )}
    </div>
  )
}