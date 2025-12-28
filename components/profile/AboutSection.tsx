import { Edit3 } from 'lucide-react'

interface AboutSectionProps {
  bio?: string
  isOwner?: boolean
  onEdit?: () => void
}

export default function AboutSection({ bio, isOwner, onEdit }: AboutSectionProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">About</h2>
        {isOwner && (
          <button 
            onClick={onEdit}
            className="p-2 hover:bg-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            title="Edit Bio"
          >
            <Edit3 className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {bio || (
          <span className="italic opacity-60">
            {isOwner ? "Add a bio to tell others about yourself..." : "No bio available."}
          </span>
        )}
      </div>
    </div>
  )
}
