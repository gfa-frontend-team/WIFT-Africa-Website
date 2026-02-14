'use client'

import { useTranslation } from 'react-i18next'
import { useState, memo, useCallback, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Pin, Flag } from 'lucide-react'
import { type Post } from '@/lib/api/posts'
import Avatar from '@/components/ui/Avatar'
import { usePostMutations } from '@/lib/hooks/usePostMutations'
import CommentSection from './CommentSection'
import { useAuth } from '@/lib/hooks/useAuth'
import SharePostModal from './SharePostModal'
import EmbeddedPost from './EmbeddedPost'
import { toast } from 'sonner'
import { getProfileUrl } from '@/lib/utils/routes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ReportModal } from '@/components/reports/ReportModal'
import PostLikesModal from './PostLikesModal'

interface PostCardProps {
  post: Post
  initialShowComments?: boolean
}

const PostCard = memo(function PostCard({ post, initialShowComments = false }: PostCardProps) {
  const { t } = useTranslation()
  const [showComments, setShowComments] = useState(initialShowComments)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isLikesModalOpen, setIsLikesModalOpen] = useState(false)
  const { likePost, savePost, isLiking, isSaving } = usePostMutations()
  const { user } = useAuth()

  // API now returns computed isSaved status. 
  // Optimistic updates are handled via React Query cache in usePostMutations.
  const isSaved = post.isSaved

  const handleLike = useCallback(async () => {
    try {
      await likePost(post.id)
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }, [likePost, post.id])

  const handleSave = useCallback(async () => {
    try {
      const { saved } = await savePost(post.id)
      const message = saved ? t('feed.post_card.saved_success') : t('feed.post_card.saved_removed')
      toast.success(message)
    } catch (error: any) {
      console.error('Failed to save post:', error)
      toast.error(error.message || t('feed.post_card.save_error'))
    }
  }, [savePost, post.id, t])

  const openShareModal = useCallback(() => {
    setIsShareModalOpen(true)
  }, [])

  const closeShareModal = useCallback(() => {
    setIsShareModalOpen(false)
  }, [])

  const openReportModal = useCallback(() => {
    setIsReportModalOpen(true)
  }, [])

  const closeReportModal = useCallback(() => {
    setIsReportModalOpen(false)
  }, [])

  const openLikesModal = useCallback(() => {
    if (post.likesCount > 0) {
      setIsLikesModalOpen(true)
    }
  }, [post.likesCount])

  const closeLikesModal = useCallback(() => {
    setIsLikesModalOpen(false)
  }, [])

  const toggleComments = useCallback(() => {
    setShowComments((prev) => !prev)
  }, [])

  const formatTimestamp = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return t('feed.post_card.time.just_now')
    if (diffMins < 60) return t('feed.post_card.time.mins_ago', { count: diffMins })
    if (diffHours < 24) return t('feed.post_card.time.hours_ago', { count: diffHours })
    if (diffDays < 7) return t('feed.post_card.time.days_ago', { count: diffDays })
    return date.toLocaleDateString()
  }

  const getPrivacyLabel = (visibility: string) => {
    switch (visibility) {
      case 'CHAPTER_ONLY':
        return t('feed.post_card.privacy_chapter')
      case 'CONNECTIONS_ONLY':
        return t('feed.post_card.privacy_connections')
      default:
        return null
    }
  }

  const isOwnPost = user?.id === post.author.id
  const isLiked = post.isLiked || (user && post.likes?.includes(user.id))

  // Callback stubs for comment section - TODO: implement real logic
  const handleAddComment = useCallback((content: string) => {
    // console.log('Add comment:', content)
  }, [])

  const handleLikeComment = useCallback((commentId: string) => {
    // console.log('Like comment:', commentId)
  }, [])

  const handleReply = useCallback((commentId: string, content: string) => {
    // console.log('Reply to comment:', commentId, content)
  }, [])

  return (
    <article className="bg-card border border-border rounded-lg">
      {/* Post Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <Link href={getProfileUrl(post.author)}>
            <Avatar
              src={post.author.profilePhoto}
              name={`${post.author.firstName} ${post.author.lastName}`}
              size="md"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={getProfileUrl(post.author)}
                className="font-semibold text-foreground hover:underline block truncate"
              >
                {post.author.firstName} {post.author.lastName}
              </Link>
              {post.isAdminPost && (
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                  {t('feed.post_card.admin_badge')}
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-accent rounded-lg transition-colors">
              <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isOwnPost && (
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={openReportModal}
              >
                <Flag className="mr-2 h-4 w-4" />
                {t('feed.post_card.report_btn')}
              </DropdownMenuItem>
            )}
            {/* TODO: Add more options like delete/edit for own posts */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Post Content */}
      <div className="px-4 pb-3">
        <p className="text-foreground whitespace-pre-wrap break-words">
          {post.content}
        </p>
      </div>

      {/* Post Media */}
      {post.media && post.media.length > 0 && (
        <div className={`grid gap-1 ${post.media.length === 1 ? 'grid-cols-1' :
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
                <Image
                  src={media.url}
                  alt={`Post media ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover hover:opacity-90 transition-opacity cursor-pointer"
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

      {/* Shared Post Content */}
      {post.postType === 'SHARED' && post.originalPost && (
        <EmbeddedPost post={post.originalPost} />
      )}

      {/* Interaction Stats */}
      <div className="px-4 py-2 flex items-center justify-between text-sm text-muted-foreground border-t border-border">
        <button
          className="hover:underline"
          onClick={openLikesModal}
          disabled={post.likesCount === 0}
        >
          {post.likesCount > 0 && t('feed.post_card.stats.likes_plural', { count: post.likesCount })}
        </button>
        <div className="flex items-center gap-3">
          {post.commentsCount > 0 && (
            <button
              onClick={toggleComments}
              className="hover:underline"
            >
              {t('feed.post_card.stats.comments_plural', { count: post.commentsCount })}
            </button>
          )}
          {post.sharesCount > 0 && (
            <button className="hover:underline">
              {t('feed.post_card.stats.shares_plural', { count: post.sharesCount })}
            </button>
          )}
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="px-4 py-2 flex items-center justify-between border-t border-border">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${isLiked
            ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20'
            : 'text-muted-foreground hover:bg-accent'
            } ${isLiking ? 'scale-95' : 'hover:scale-105 active:scale-95'}`}
        >
          <Heart
            className={`h-5 w-5 transition-all duration-200 ${isLiked ? 'fill-current animate-pulse' : ''
              }`}
          />
          <span className="text-sm font-medium hidden sm:inline">
            {isLiked ? t('feed.post_card.liked_btn') : t('feed.post_card.like_btn')}
          </span>
        </button>

        <button
          onClick={toggleComments}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${showComments
            ? 'text-primary bg-primary/10'
            : 'text-muted-foreground hover:bg-accent'
            }`}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">{t('feed.post_card.comment_btn')}</span>
        </button>

        <button
          onClick={openShareModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Share2 className="h-5 w-5" />
          <span className="text-sm font-medium hidden sm:inline">{t('feed.post_card.share_btn')}</span>
        </button>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 ${isSaved
            ? 'text-primary bg-primary/10'
            : 'text-muted-foreground hover:bg-accent'
            }`}
        >
          <Bookmark className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          postId={post.id}
          onAddComment={handleAddComment}
          onLikeComment={handleLikeComment}
          onReply={handleReply}
        />
      )}

      <SharePostModal
        post={post}
        isOpen={isShareModalOpen}
        onClose={closeShareModal}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={closeReportModal}
        targetId={post.id}
        targetType="POST"
      />

      <PostLikesModal
        isOpen={isLikesModalOpen}
        onClose={closeLikesModal}
        postId={post.id}
      />
    </article>
  )
})

PostCard.displayName = 'PostCard'
export default PostCard