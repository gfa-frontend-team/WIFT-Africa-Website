'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { type Post } from '@/lib/api/posts'
import { usePostMutations } from '@/lib/hooks/usePostMutations'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

interface SharePostModalProps {
  post: Post
  isOpen: boolean
  onClose: () => void
}

export default function SharePostModal({ post, isOpen, onClose }: SharePostModalProps) {
  const [comment, setComment] = useState('')
  const [visibility, setVisibility] = useState<'PUBLIC' | 'CHAPTER_ONLY' | 'CONNECTIONS_ONLY'>('PUBLIC')
  
  const { sharePost, isSharing } = usePostMutations()

  const handleShare = async () => {
    try {
      await sharePost(post.id, comment, visibility)
      toast.success('Post shared successfully')
      onClose()
      setComment('')
    } catch (error) {
      toast.error('Failed to share post')
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Post"
    >
      <div className="space-y-4">
        {/* Post Preview - Simplified */}
        <div className="border border-border rounded-lg p-3 bg-muted/30">
            <div className="flex items-center gap-2 mb-2">
                <div className="relative w-6 h-6 rounded-full overflow-hidden bg-muted">
                    {post.author.profilePhoto && <Image src={post.author.profilePhoto} alt="" fill className="object-cover" />}
                </div>
                <span className="text-sm font-semibold">{post.author.firstName} {post.author.lastName}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>
        </div>

        <div>
            <label className="text-sm font-medium mb-1 block">Your Thoughts (Optional)</label>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What do you think about this?"
                className="w-full h-24 p-3 rounded-md border border-border bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
        </div>

        <div>
           <label className="text-sm font-medium mb-1 block">Who can see this?</label>
           <select
             value={visibility}
             onChange={(e) => setVisibility(e.target.value as any)}
             className="w-full p-2 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
           >
             <option value="PUBLIC">Generic (Public)</option>
             <option value="CONNECTIONS_ONLY">My Connections</option>
             <option value="CHAPTER_ONLY">My Chapter</option>
           </select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleShare}
            disabled={isSharing}
            className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSharing && <Loader2 className="h-4 w-4 animate-spin" />}
            Share Now
          </button>
        </div>
      </div>
    </Modal>
  )
}
