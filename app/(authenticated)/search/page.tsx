'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useSearchStore } from '@/lib/stores/searchStore'
import { useSearch } from '@/lib/hooks/useSearch'
import SearchBar from '@/components/search/SearchBar'
import SearchFilters from '@/components/search/SearchFilters'
import MemberCard from '@/components/search/MemberCard'
import { Loader2, SearchX } from 'lucide-react'

export default function SearchPage() {
  const { currentQuery, activeFilters, setQuery } = useSearchStore()
  const { useSearchMembers } = useSearch()
  
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('query')

  // Initial fetch handling URL params
  useEffect(() => {
    if (queryParam) {
        setQuery(queryParam)
    }
  }, [queryParam])

  const { data, isLoading: isSearching } = useSearchMembers({
    query: currentQuery,
    ...activeFilters
  })

  const results = data?.users || []
  const totalResults = data?.total || 0

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header and Search Bar */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">Find Members</h1>
          <p className="text-muted-foreground">
            Connect with other professionals in the WIFT Africa network.
          </p>
          <div className="w-full max-w-2xl">
            <SearchBar />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 bg-card border border-border rounded-lg p-6 h-fit sticky top-24">
            <SearchFilters />
          </aside>

          {/* Results Grid */}
          <main className="flex-1">
            {isSearching ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Searching members...</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  Found {totalResults} member{totalResults !== 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((user) => (
                        <MemberCard key={user.id} user={user} />
                    ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-lg text-center p-8">
                <div className="bg-muted p-4 rounded-full mb-4">
                    <SearchX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No members found</h3>
                <p className="text-muted-foreground max-w-sm">
                  Try adjusting your filters or search terms to find what you're looking for.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
