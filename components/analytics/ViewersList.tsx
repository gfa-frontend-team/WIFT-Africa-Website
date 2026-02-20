import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import Avatar from '@/components/ui/Avatar'
import { ProfileView } from '@/types/analytics'
import { MapPin, Building2, Users } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { getProfileUrl } from '@/lib/utils/routes'

interface ViewersListProps {
  viewers: ProfileView[]
  isLoading: boolean
}

export function ViewersList({ viewers, isLoading }: ViewersListProps) {
  if (isLoading) {
    return <ViewersListSkeleton />
  }

  if (!viewers || viewers.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted p-4 rounded-full mb-4">
             <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No views yet</h3>
          <p className="text-muted-foreground max-w-sm mt-1">
            Engage with the community by posting content and connecting with others to increase your visibility.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {viewers.map((viewer, index) => (
        <Link href={getProfileUrl({ profileSlug: viewer.profileSlug, id: viewer.viewerId })} key={`${viewer.viewerId}-${viewer.viewedAt}-${index}`}>
          <Card className="hover:bg-muted/30 transition-colors">
            <CardContent className="p-4 flex items-start gap-4">
              <Avatar 
                src={viewer.profilePhoto} 
                name={`${viewer.firstName} ${viewer.lastName}`}
                size="md"
              />
              
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex justify-between items-start">
                   <h4 className="font-semibold text-base truncate pr-2">
                     {viewer.firstName} {viewer.lastName}
                   </h4>
                   <span className="text-xs text-muted-foreground whitespace-nowrap">
                     {formatDistanceToNow(new Date(viewer.viewedAt), { addSuffix: true })}
                   </span>
                </div>
                
                {viewer.headline && (
                  <p className="text-sm text-muted-foreground truncate">{viewer.headline}</p>
                )}
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-2">
                  {viewer.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{viewer.location}</span>
                    </div>
                  )}
                  {viewer.chapter && (
                    <div className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      <span>{viewer.chapter.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

function ViewersListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
