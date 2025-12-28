import { Profile } from '@/types'

interface SpecializationsSectionProps {
  profile: Profile
}

export default function SpecializationsSection({ profile }: SpecializationsSectionProps) {
  const hasSpec = profile.writerSpecialization || 
                 (profile.crewSpecializations && profile.crewSpecializations.length > 0) ||
                 (profile.businessSpecializations && profile.businessSpecializations.length > 0)

  if (!hasSpec) return null

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-4">Specializations</h2>
      <div className="space-y-4">
        {profile.writerSpecialization && (
          <div>
             <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Writer</p>
             <p className="text-sm font-medium">{profile.writerSpecialization}</p>
          </div>
        )}
        
        {profile.crewSpecializations && profile.crewSpecializations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Crew</p>
            <div className="flex flex-wrap gap-2">
              {profile.crewSpecializations.map((spec: string) => (
                <span key={spec} className="inline-flex items-center px-2 py-1 rounded bg-accent/50 text-xs font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.businessSpecializations && profile.businessSpecializations.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Business</p>
             <div className="flex flex-wrap gap-2">
              {profile.businessSpecializations.map((spec: string) => (
                <span key={spec} className="inline-flex items-center px-2 py-1 rounded bg-accent/50 text-xs font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
