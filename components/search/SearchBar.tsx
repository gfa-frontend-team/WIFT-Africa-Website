'use client'

import { useDebounce } from '@/lib/hooks/useDebounce'
import { Search } from 'lucide-react'
import { useState, useEffect } from 'react'

interface SearchBarProps {
  query: string
  onQueryChange: (query: string) => void
}

export default function SearchBar({ query, onQueryChange }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState(query)

  // Sync local state if prop updates externally (e.g. from URL)
  useEffect(() => {
    setLocalQuery(query)
  }, [query])

  const debouncedQuery = useDebounce(localQuery, 500)

  // Debounced update to parent
  useEffect(() => {
    if (debouncedQuery !== query) {
      onQueryChange(debouncedQuery)
    }
  }, [debouncedQuery, query, onQueryChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onQueryChange(localQuery)
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          type="text"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          placeholder="Search members by name, role, or skills..."
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  )
}
