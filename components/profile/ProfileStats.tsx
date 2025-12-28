import { Eye, Users, Briefcase } from 'lucide-react'

interface ProfileStatsProps {
  connectionsCount: number
  viewsCount?: number // Mock for now
  projectCount?: number // Mock for now
}

export default function ProfileStats({ 
  connectionsCount, 
  viewsCount = 1240, // Mock default
  projectCount = 8     // Mock default
}: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 py-6 border-b border-border/50">
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground mb-1">
          <Eye className="h-5 w-5 text-primary" />
          <span>{viewsCount.toLocaleString()}</span>
        </div>
        <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium text-[10px] sm:text-xs">
          Profile Views
        </p>
      </div>
      
      <div className="text-center border-l border-r border-border/50">
        <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground mb-1">
          <Users className="h-5 w-5 text-primary" />
          <span>{connectionsCount.toLocaleString()}</span>
        </div>
        <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium text-[10px] sm:text-xs">
          Connections
        </p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1.5 text-2xl font-bold text-foreground mb-1">
          <Briefcase className="h-5 w-5 text-primary" />
          <span>{projectCount}</span>
        </div>
        <p className="text-sm text-muted-foreground uppercase tracking-wide font-medium text-[10px] sm:text-xs">
          Projects
        </p>
      </div>
    </div>
  )
}
