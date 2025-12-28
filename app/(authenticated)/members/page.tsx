'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSearch } from '@/lib/hooks/useSearch'
import { useConnections } from '@/lib/hooks/useConnections'
import { Role } from '@/lib/api/search'

import MembersSearchHeader from '@/components/members/MembersSearchHeader'
import MembersFilterSidebar from '@/components/members/MembersFilterSidebar'
import MembersGrid from '@/components/members/MembersGrid'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

// Main component wrapped in Suspense for useSearchParams
export default function MembersPage() {
  return (
    <Suspense fallback={<MembersPageLoading />}>
        <MembersPageContent />
    </Suspense>
  )
}

function MembersPageLoading() {
    return <div className="p-8 text-center">Loading directory...</div>
}

function MembersPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { useSearchMembers, useSearchFilters } = useSearch()
  const { sendRequest, isSending } = useConnections()

  // --- State Initialization from URL ---
  const [query, setQuery] = useState(searchParams.get('query') || '')
  // roles can be multi-selected, stored as comma-separated in URL for simplicity
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    searchParams.get('roles')?.split(',').filter(Boolean) || []
  )
  const [selectedChapter, setSelectedChapter] = useState<string | null>(searchParams.get('chapter'))
  const [availability, setAvailability] = useState<string | null>(searchParams.get('availability'))
  const [showFilters, setShowFilters] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)

  // --- Data Fetching ---
  const { data: searchResults, isLoading: isSearching } = useSearchMembers({
    query,
    roles: selectedRoles.length > 0 ? (selectedRoles as Role[]) : undefined,
    chapter: selectedChapter || undefined,
    availability: availability as any, // Enum cast
    limit: 12
  })

  // Mock filters data until endpoint is ready/verified, or use hook if ready
  const { data: filterOptions } = useSearchFilters()

  // --- Debounced URL Sync (Effect) ---
  useEffect(() => {
    const params = new URLSearchParams()
    if (query) params.set('query', query)
    if (selectedRoles.length > 0) params.set('roles', selectedRoles.join(','))
    if (selectedChapter) params.set('chapter', selectedChapter)
    if (availability) params.set('availability', availability)
    
    // Replace URL without full reload
    const newUrl = `/members?${params.toString()}`
    if (newUrl !== window.location.pathname + window.location.search) {
        // Use replace to avoid cluttering history stack with every keystroke
        router.replace(newUrl, { scroll: false })
    }
  }, [query, selectedRoles, selectedChapter, availability, router])


  // --- Handlers ---
  const toggleRole = (role: string) => {
    setSelectedRoles(prev => 
      prev.includes(role) 
        ? prev.filter(r => r !== role)
        : [...prev, role]
    )
  }

  const handleConnect = async (userId: string) => {
    try {
        setConnectingId(userId)
        await sendRequest(userId)
        // Optimistic update handled by React Query invalidation in hook
    } catch (error) {
        console.error('Failed to connect:', error)
        // Ideally show toast
        alert('Failed to send request') // Temporary fallback
    } finally {
        setConnectingId(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Member Directory</h1>
        <p className="text-muted-foreground">
          Discover and connect with {filterOptions?.availableRoles?.length || ''} professionals across our network.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar - Hidden on mobile unless toggled */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block flex-shrink-0`}>
            <MembersFilterSidebar 
                filters={filterOptions}
                selectedRoles={selectedRoles}
                toggleRole={toggleRole}
                selectedChapter={selectedChapter}
                setChapter={setSelectedChapter}
                availability={availability}
                setAvailability={setAvailability}
                className="sticky top-24"
            />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
            <MembersSearchHeader 
                query={query}
                setQuery={setQuery}
                totalResults={searchResults?.total || 0}
                onToggleFilters={() => setShowFilters(!showFilters)}
                showFilters={showFilters}
            />

            <MembersGrid 
                members={searchResults?.users || []}
                isLoading={isSearching}
                onConnect={handleConnect}
                connectingId={connectingId}
            />
            
            {/* Simple Pagination Footer (if needed) */}
            {searchResults && searchResults.total > 12 && (
                <div className="mt-8 text-center text-muted-foreground text-sm">
                    Scroll for more (Infinite scroll coming soon) 
                    {/* Or standard pagination buttons here */}
                </div>
            )}
        </div>

      </div>
    </div>
  )
}
