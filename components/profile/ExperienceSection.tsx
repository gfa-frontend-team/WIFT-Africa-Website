import { Plus, Award } from 'lucide-react'

interface ExperienceSectionProps {
  isOwner?: boolean
}

export default function ExperienceSection({ isOwner }: ExperienceSectionProps) {
  // Mock Data
  const experiences = [
    {
      id: 1,
      title: "Film Director",
      company: "Independent",
      period: "2020 - Present",
      description: "Directing narrative films that explore African identity and culture."
    },
    {
      id: 2,
      title: "Production Assistant",
      company: "Nollywood Studios",
      period: "2018 - 2020",
      description: "Assisted in pre-production planning and on-set coordination."
    }
  ]

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm relative overflow-hidden">
      {/* Coming Soon Overlay for non-mocks if needed, but lets simulate features */}
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Experience</h2>
        {isOwner && (
          <button className="flex items-center gap-2 px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Experience</span>
          </button>
        )}
      </div>
      
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={exp.id} className="flex gap-4 group">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">{exp.title}</h3>
              <p className="text-sm text-foreground/80 font-medium">{exp.company} • {exp.period}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Banner indicating this is a preview */}
      <div className="mt-6 pt-4 border-t border-dashed border-border text-xs text-muted-foreground text-center italic">
        * Work experience section is coming soon. Showing example data.
      </div>
    </div>
  )
}
