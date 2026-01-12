'use client'

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { useSearchStore } from '@/lib/stores/searchStore'
import { useSearch } from '@/lib/hooks/useSearch'
import SearchBar from '@/components/search/SearchBar'
import SearchFilters from '@/components/search/SearchFilters'
import SearchPagination from '@/components/search/SearchPagination'
import MemberCard from '@/components/search/MemberCard'
import { Loader2, SearchX, Filter } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function SearchPage() {
  const { currentQuery, activeFilters, setQuery, page, limit, sortBy, setPage } = useSearchStore()
  const { useSearchMembers } = useSearch()
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryParam = searchParams.get('query')

  // Initial fetch handling URL params
  useEffect(() => {
    // Only set if different to avoid infinite loops or overwriting initial state unnecessarily
    if (queryParam && queryParam !== currentQuery) {
        setQuery(queryParam)
    }
  }, [queryParam]) // Removed currentQuery dependency to strictly follow URL on change

  // Sync Store -> URL
  // We debounce this slightly or just rely on the fact that currentQuery is already debounced by SearchBar
  useEffect(() => {
     // Create new URLSearchParams to preserve other params if we were syncing them, 
     // but for now we basically focus on query. 
     // Actually, we should be careful not to blow away manual params if the user navigated here with them.
     const params = new URLSearchParams(searchParams.toString())
     
     if (currentQuery) {
         params.set('query', currentQuery)
     } else {
         params.delete('query')
     }
     
     const newSearch = params.toString()
     // Only replace if actually different to avoid router churn
     if (newSearch !== searchParams.toString()) {
         router.replace(`${pathname}?${newSearch}`, { scroll: false })
     }
  }, [currentQuery, pathname, router, searchParams])

  const { data, isLoading: isSearching } = useSearchMembers({
    query: currentQuery,
    ...activeFilters,
    page,
    limit,
    sortBy
  })

  // Using optional chaining and default empty array for safety
  const results = data?.users || []
  const totalResults = data?.total || 0
  const totalPages = data?.pages || 0

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



        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full flex gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </DialogTrigger>
            <DialogContent className="h-[90vh] overflow-y-auto sm:max-w-[425px]">
               <DialogHeader>
                  <DialogTitle>Search Filters</DialogTitle>
               </DialogHeader>
               <div className="py-4">
                  <SearchFilters />
               </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mt-6">
          {/* Sidebar Filters - Desktop only */}
          <aside className="hidden lg:block w-64 bg-card border border-border rounded-lg p-6 h-fit sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
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

                <SearchPagination 
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
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
