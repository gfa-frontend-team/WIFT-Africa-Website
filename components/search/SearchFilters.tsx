'use client'

import { useSearchStore } from '@/lib/stores/searchStore'
import { useSearch } from '@/lib/hooks/useSearch'
import { AvailabilityStatus, Role } from '@/lib/api/search'
import { Filter, X } from 'lucide-react'

export default function SearchFilters() {
  const { activeFilters, setFilter, clearFilters } = useSearchStore()
  const { useSearchFilters } = useSearch()
  const { data: filters } = useSearchFilters()

  const handleRoleChange = (role: string) => {
    const currentRoles = (activeFilters.roles as string[]) || []
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]
    
    setFilter('roles', newRoles)
  }

  const handleAvailabilityChange = (status: string) => {
     setFilter('availability', status === activeFilters.availability ? undefined : status)
  }

  // Common roles enum to string array
  const roles = Object.values(Role)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </h3>
        {Object.keys(activeFilters).length > 0 && (
          <button 
            onClick={clearFilters}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Roles Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Roles</h4>
        <div className="space-y-2">
          {roles.map((role) => (
            <label key={role} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={(activeFilters.roles as string[])?.includes(role) || false}
                onChange={() => handleRoleChange(role)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm group-hover:text-primary transition-colors">
                {role.charAt(0) + role.slice(1).toLowerCase()}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Availability</h4>
        <div className="space-y-2">
            {[
                { label: 'Available for work', value: AvailabilityStatus.AVAILABLE },
                { label: 'Busy', value: AvailabilityStatus.BUSY },
                { label: 'Not looking', value: AvailabilityStatus.NOT_LOOKING },
            ].map((option) => (
                <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="availability"
                    checked={activeFilters.availability === option.value}
                    onChange={() => handleAvailabilityChange(option.value)}
                    className="w-4 h-4 border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm group-hover:text-primary transition-colors">
                    {option.label}
                  </span>
                </label>
            ))}
        </div>
      </div>

      {/* Chapter Filter */}
      {filters?.availableChapters && filters.availableChapters.length > 0 && (
        <div>
           <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Chapter</h4>
            <select 
                className="w-full p-2 rounded-md border border-border bg-background text-sm"
                value={activeFilters.chapter || ''}
                onChange={(e) => setFilter('chapter', e.target.value || undefined)}
            >
                <option value="">All Chapters</option>
                {filters.availableChapters.map(chapter => (
                    <option key={chapter.id} value={chapter.id}>
                        {chapter.name} ({chapter.memberCount})
                    </option>
                ))}
            </select>
        </div>
      )}
    </div>
  )
}
