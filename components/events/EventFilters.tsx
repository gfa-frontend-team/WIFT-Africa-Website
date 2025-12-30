'use client'

import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { EventType } from '@/types'
import { EventTypeBadge } from './EventTypeBadge'

interface EventFiltersProps {
  onFiltersChange: (filters: {
    search?: string
    type?: EventType
    chapterId?: string
    startDate?: string
    endDate?: string
    page?: number
  }) => void
  initialFilters?: {
    search?: string
    type?: EventType
    chapterId?: string
    startDate?: string
    endDate?: string
    page?: number
  }
}

export function EventFilters({ onFiltersChange, initialFilters = {} }: EventFiltersProps) {
  const [search, setSearch] = useState(initialFilters.search || '')
  const [selectedType, setSelectedType] = useState<EventType | undefined>(initialFilters.type)
  const [startDate, setStartDate] = useState(initialFilters.startDate || '')
  const [endDate, setEndDate] = useState(initialFilters.endDate || '')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFiltersChange({
      search: value || undefined,
      type: selectedType,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: 1 // Reset to first page when filters change
    })
  }

  const handleTypeChange = (type: EventType | undefined) => {
    setSelectedType(type)
    onFiltersChange({
      search: search || undefined,
      type,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      page: 1 // Reset to first page when filters change
    })
  }

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    onFiltersChange({
      search: search || undefined,
      type: selectedType,
      startDate: start || undefined,
      endDate: end || undefined,
      page: 1 // Reset to first page when filters change
    })
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedType(undefined)
    setStartDate('')
    setEndDate('')
    onFiltersChange({ page: 1 }) // Reset to first page
  }

  const hasActiveFilters = search || selectedType || startDate || endDate

  return (
    <div className="space-y-4">
      {/* Search and Filter Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {[search, selectedType, startDate, endDate].filter(Boolean).length}
            </span>
          )}
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <Card className="p-4 space-y-4">
          {/* Event Type Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Event Type</label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedType === undefined ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTypeChange(undefined)}
              >
                All Types
              </Button>
              {Object.values(EventType).map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleTypeChange(type)}
                  className="flex items-center gap-2"
                >
                  <EventTypeBadge type={type} className="!px-0 !py-0 !border-0 !bg-transparent !text-current" />
                </Button>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Start Date</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleDateChange(e.target.value, endDate)}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => handleDateChange(startDate, e.target.value)}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}