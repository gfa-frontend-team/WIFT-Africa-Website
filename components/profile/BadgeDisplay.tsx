import { Star, Award, Zap, ShieldCheck } from 'lucide-react'

// Mock Badges for Visual Flair
const MOCK_BADGES = [
  { id: 1, title: 'Early Adopter', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  { id: 2, title: 'Verified Member', icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 3, title: 'Top Contributor', icon: Zap, color: 'text-purple-500', bg: 'bg-purple-500/10' },
]

export default function BadgeDisplay() {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      {MOCK_BADGES.map((badge) => {
        const Icon = badge.icon
        return (
          <div 
            key={badge.id} 
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/50 ${badge.bg} transition-transform hover:scale-105 cursor-default`}
            title={badge.title}
          >
            <Icon className={`h-3.5 w-3.5 ${badge.color}`} />
            <span className={`text-xs font-medium ${badge.color} filter brightness-75`}>
              {badge.title}
            </span>
          </div>
        )
      })}
      <div className="text-xs text-muted-foreground ml-1">+2 more</div>
    </div>
  )
}
