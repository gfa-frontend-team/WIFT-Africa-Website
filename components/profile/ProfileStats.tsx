import { Eye, Users, PenSquare } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ProfileStatsProps {
  connectionsCount: number
  viewsCount?: number
  postsCount?: number
  isOwner?: boolean
}

export default function ProfileStats({ 
  connectionsCount, 
  viewsCount = 0, 
  postsCount = 0,
  isOwner = false
}: ProfileStatsProps) {
  // If owner, show 3 cols. If not, show 2 cols.
  const gridCols = isOwner ? 'grid-cols-3' : 'grid-cols-2'

  return (
    <div className={cn("grid gap-6 py-6 border-b border-border/50", gridCols)}>
      {isOwner && (
        <Link href="/me/analytics" className="text-center group cursor-pointer hover:bg-muted/10 rounded-lg p-1 transition-colors">
          <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
            <Eye className="h-5 w-5 text-primary" />
            <span>{viewsCount.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium text-[10px] sm:text-xs">
            Profile Views
          </p>
        </Link>
      )}
      
      <div className={cn("text-center", isOwner && "border-l border-r border-border/50")}>
        {isOwner ? (
          <Link href="/connections" className="block group cursor-pointer hover:bg-muted/10 rounded-lg p-1 transition-colors -m-1">
            <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              <Users className="h-5 w-5 text-primary" />
              <span>{connectionsCount.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium text-[10px] sm:text-xs">
              Connections
            </p>
          </Link>
        ) : (
          <>
            <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground mb-1">
              <Users className="h-5 w-5 text-primary" />
              <span>{connectionsCount.toLocaleString()}</span>
            </div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium text-[10px] sm:text-xs">
              Connections
            </p>
          </>
        )}
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground mb-1">
          <PenSquare className="h-5 w-5 text-primary" />
          <span>{postsCount}</span>
        </div>
        <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium text-[10px] sm:text-xs">
          Posts
        </p>
      </div>
    </div>
  )
}
