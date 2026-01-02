import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import { type Post } from '@/lib/api/posts'
import { Pin } from 'lucide-react'

interface EmbeddedPostProps {
  post: Post
}

export default function EmbeddedPost({ post }: EmbeddedPostProps) {
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

  return (
    <div className="mt-3 mx-4 p-3 border border-border rounded-lg bg-accent/30">
      {/* Embedded Header */}
      <div className="flex items-start gap-3 mb-2">
        <Link href={`/in/${post.author.username || post.author.id}`} className="shrink-0">
            <Avatar 
                src={post.author.profilePhoto} 
                name={`${post.author.firstName} ${post.author.lastName}`} 
                size="sm" 
            />
        </Link>
        <div className="min-w-0 flex-1">
           <div className="flex items-center gap-2">
              <Link 
                href={`/in/${post.author.username || post.author.id}`}
                className="font-semibold text-sm hover:underline truncate"
              >
                  {post.author.firstName} {post.author.lastName}
              </Link>
               <span className="text-xs text-muted-foreground">• {formatTimestamp(post.createdAt)}</span>
           </div>
           <p className="text-xs text-muted-foreground truncate">{post.author.primaryRole}</p>
        </div>
      </div>

      {/* Embedded Content */}
      <p className="text-sm text-foreground whitespace-pre-wrap break-words mb-2">
        {post.content}
      </p>

      {/* Embedded Media */}
      {post.media && post.media.length > 0 && (
         <div className={`grid gap-0.5 rounded-md overflow-hidden ${
            post.media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}>
             {post.media.slice(0, 4).map((media, index) => (
                 <div key={index} className="relative aspect-video bg-muted">
                    {media.type === 'image' ? (
                        <img 
                            src={media.url} 
                            alt="Media" 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <video src={media.url} className="w-full h-full object-cover" />
                    )}
                 </div>
             ))}
         </div>
      )}
    </div>
  )
}
