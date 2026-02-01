'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Search, RotateCcw } from 'lucide-react'
import { JobFilters as FilterType } from '@/types'
import { useState } from 'react'
import { useDebounce } from '@/lib/hooks/useDebounce'
import { useEffect } from 'react'

interface JobFiltersProps {
  onFilter: (filters: FilterType) => void
  initialFilters?: FilterType
}

export function JobFilters({ onFilter, initialFilters }: JobFiltersProps) {
  const [filters, setFilters] = useState<FilterType>(initialFilters || {})
  const debouncedFilters = useDebounce(filters, 500)

  // Auto-trigger filter on debounce
  useEffect(() => {
    onFilter(debouncedFilters)
  }, [debouncedFilters, onFilter])

  const handleChange = (key: keyof FilterType, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    // onFilter is called by effect
  }

  const handleReset = () => {
    setFilters({})
    // effect will trigger
  }

  return (
    <div className="bg-card p-4 rounded-lg border border-border shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Filter by Role (e.g. Producer)..."
              value={filters.role || ''}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full pl-9"
            />
          </div>
        </div>

      </div>

      <div className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="remote-mode"
            checked={filters.remote || false}
            onCheckedChange={(checked) => handleChange('remote', checked)}
          />
          <Label htmlFor="remote-mode" className="text-sm font-medium text-foreground">Remote Only</Label>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  )
}
