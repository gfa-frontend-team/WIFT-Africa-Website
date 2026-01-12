import { useQuery } from '@tanstack/react-query'
import { analyticsApi } from '@/lib/api/analytics'
import { Card, CardContent } from '@/components/ui/card'
import { Eye, Heart, MessageSquare, Share2, PlayCircle, Loader2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function PostsPerformance() {
  const { data, isLoading } = useQuery({
    queryKey: ['user-posts-analytics'],
    queryFn: () => analyticsApi.getUserPostsAnalytics(1, 10), // Fetch top 10 latest
  })

  // We might want to use the timestamp from the post itself, but PostAnalytics might not have it strictly typed properly everywhere yet.
  // Using the updated type with optional timestamp.

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div>
  }

  const posts = data?.posts || []

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-muted/20 rounded-lg">
        <p className="text-muted-foreground">You haven't posted anything yet.</p>
        <Button variant="link" asChild className="mt-2">
            <Link href="/feed">Create your first post</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.postId} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
               <div>
                  <h4 className="font-medium text-sm">
                    {post.timestamp ? (
                        `Posted ${formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}`
                    ) : (
                        "Recent Post"
                    )}
                  </h4> 
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{post.postType}</span>
               </div>
               
               {post.postType === 'VIDEO' && <PlayCircle className="h-5 w-5 text-primary" />}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 bg-muted/10 rounded-lg p-2">
               <Metric icon={Eye} label="Impressions" value={post.discovery.impressions} />
               <Metric icon={Heart} label="Likes" value={post.engagement.likes} />
               <Metric icon={MessageSquare} label="Comments" value={post.engagement.comments || 0} />
               <Metric icon={Share2} label="Shares" value={post.engagement.shares || 0} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function Metric({ icon: Icon, label, value }: { icon: any, label: string, value: number }) {
    return (
        <div className="flex flex-col items-center p-2 rounded-lg">
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">{label}</span>
            </div>
            <span className="font-bold text-lg">{value.toLocaleString()}</span>
        </div>
    )
}
