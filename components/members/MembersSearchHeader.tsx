'use client'

import { Search, SlidersHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input' // Assuming standard input
import { Button } from '@/components/ui/button'

interface MembersSearchHeaderProps {
  query: string
  setQuery: (q: string) => void
  totalResults: number
  onToggleFilters: () => void
  showFilters: boolean
}

export default function MembersSearchHeader({
  query,
  setQuery,
  totalResults,
  onToggleFilters,
  showFilters
}: MembersSearchHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
      <div className="relative w-full md:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input 
          type="text"
          placeholder="Search by name, headline, or location..."
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 pl-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{totalResults}</span> members
        </p>
        
        <Button 
          variant="outline" 
          size="sm"
          className={`gap-2 md:hidden ${showFilters ? 'bg-accent' : ''}`}
          onClick={onToggleFilters}
        >
          <SlidersHorizontal size={16} />
          Filters
        </Button>
      </div>
    </div>
  )
}
