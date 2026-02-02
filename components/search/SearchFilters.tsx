'use client'

import { useSearch } from '@/lib/hooks/useSearch'
import { AvailabilityStatus, Role, SearchUsersParams } from '@/lib/api/search'
import { Filter, X, MapPin, Tags } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { UrlSearchState } from '@/lib/hooks/useUrlSearch'

interface SearchFiltersProps {
  activeFilters: Partial<SearchUsersParams>
  sortBy: SearchUsersParams['sortBy']
  onFilterChange: (key: keyof UrlSearchState, value: any) => void
  onSortChange: (sort: SearchUsersParams['sortBy']) => void
  onClear: () => void
}

export default function SearchFilters({
  activeFilters,
  sortBy,
  onFilterChange,
  onSortChange,
  onClear
}: SearchFiltersProps) {
  const { useSearchFilters } = useSearch()
  const { data: filters } = useSearchFilters()

  // Local state for debounced inputs
  const [localLocation, setLocalLocation] = useState(activeFilters.location || '')
  const [localSkills, setLocalSkills] = useState(activeFilters.skills?.join(', ') || '')

  const debouncedLocation = useDebounce(localLocation, 500)
  const debouncedSkills = useDebounce(localSkills, 500)

  // Sync local state if props change externally (e.g. Clear button)
  useEffect(() => {
    setLocalLocation(activeFilters.location || '')
  }, [activeFilters.location])

  useEffect(() => {
    setLocalSkills(activeFilters.skills?.join(', ') || '')
  }, [activeFilters.skills])

  // Sync debounced values to store
  useEffect(() => {
    if (debouncedLocation !== activeFilters.location) {
      onFilterChange('location', debouncedLocation || undefined)
    }
  }, [debouncedLocation])

  useEffect(() => {
    // Convert comma separated string to array
    const skillsArray = debouncedSkills
      ? debouncedSkills.split(',').map(s => s.trim()).filter(Boolean)
      : undefined

    const currentSkills = activeFilters.skills || []

    // Simple check to avoid loops if arrays are same content
    const stringifiedNew = JSON.stringify(skillsArray)
    const stringifiedCurrent = JSON.stringify(currentSkills.length > 0 ? currentSkills : undefined)

    if (stringifiedNew !== stringifiedCurrent) {
      onFilterChange('skills', skillsArray)
    }
  }, [debouncedSkills])


  const handleRoleChange = (role: string) => {
    const currentRoles = (activeFilters.roles as string[]) || []
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role]

    onFilterChange('roles', newRoles)
  }

  const handleAvailabilityChange = (status: string) => {
    onFilterChange('availability', status === activeFilters.availability ? undefined : status)
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
        {/* Clear All */}
        {(Object.keys(activeFilters).length > 0 || sortBy !== 'relevance') && (
          <button
            onClick={() => {
              onClear()
              setLocalLocation('')
              setLocalSkills('')
            }}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}
      </div>

      {/* Sort By */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Sort By</h4>
        <select
          className="w-full p-2 rounded-md border border-border bg-background text-sm"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as any)}
        >
          <option value="relevance">Relevance</option>
          <option value="recent">Recently Joined</option>
          <option value="connections">Most Connections</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {/* Location Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Location</h4>
        <div className="relative">
          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="City or Country..."
            value={localLocation}
            onChange={(e) => setLocalLocation(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-sm"
          />
        </div>
      </div>

      {/* Skills Filter */}
      <div>
        <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wider">Skills</h4>
        <div className="relative">
          <Tags className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="e.g. Editing, Camera..."
            value={localSkills}
            onChange={(e) => setLocalSkills(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-md border border-border bg-background text-sm"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Comma separated</p>
      </div>

      {/* Multihyphenate Filter */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={activeFilters.isMultihyphenate || false}
            onChange={(e) => onFilterChange('isMultihyphenate', e.target.checked ? true : undefined)}
            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm group-hover:text-primary transition-colors">
            Multihyphenate
          </span>
        </label>
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
            onChange={(e) => onFilterChange('chapter', e.target.value || undefined)}
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
