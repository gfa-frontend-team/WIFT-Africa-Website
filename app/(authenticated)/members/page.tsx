'use client'

import { Suspense, useRef, useCallback } from 'react'
import { useSearch } from '@/lib/hooks/useSearch'
import { useUrlSearch } from '@/lib/hooks/useUrlSearch'
import { useConnections } from '@/lib/hooks/useConnections'
import { Role, AvailabilityStatus } from '@/lib/api/search'

import MembersSearchHeader from '@/components/members/MembersSearchHeader'
import MembersFilterSidebar from '@/components/members/MembersFilterSidebar'
import MembersGrid from '@/components/members/MembersGrid'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'

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
  // 1. Replaced local state plumbing with useUrlSearch hook
  const {
    query, setQuery,
    roles, setFilter,
    chapter, availability
  } = useUrlSearch()

  const { useInfiniteSearchMembers, useSearchFilters } = useSearch()

  const [showFilters, setShowFilters] = useState(false)
  const [connectingId, setConnectingId] = useState<string | null>(null)

  // 2. Data Fetching via Infinite Query
  const {
    data,
    isLoading: isSearching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteSearchMembers({
    query,
    roles: roles.length > 0 ? roles : undefined,
    chapter: chapter || undefined,
    availability: availability as AvailabilityStatus | undefined,
    limit: 12
  })

  const { data: filterOptions } = useSearchFilters()
    // const router = useRouter()

    
    // Flatten pages into a single array of users
    const allUsers = data?.pages.flatMap((page) => page.users) || []
    const totalResults = data?.pages[0]?.total || 0
    
 

  // 3. Infinite Scroll Trigger
  const observer = useRef<IntersectionObserver | null>(null)
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isSearching || isFetchingNextPage) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    })

    if (node) observer.current.observe(node)
  }, [isSearching, isFetchingNextPage, hasNextPage, fetchNextPage])

  // --- Handlers ---
  const toggleRole = (role: string) => {
    const roleEnum = role as Role
    const newRoles = roles.includes(roleEnum)
      ? roles.filter(r => r !== roleEnum)
      : [...roles, roleEnum]
    setFilter('roles', newRoles)
  }

  // const handleConnect = async (userId: string) => {
  //   try {
  //     setConnectingId(userId)
  //     await sendRequest(userId)

  //         // Otherwise open modal
  //   setIsConnectModalOpen(true)
  //   } catch (error) {
  //     console.error('Failed to connect:', error)
  //     alert('Failed to send request')
  //   } finally {
  //     setConnectingId(null)
  //   }
  // }

    // Actions
    

  // console.log(allUsers.filter(ele=>(ele.chapter?.name === chapter)),"chapter",chapter)

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Member Directory</h1>
        <p className="text-muted-foreground">
          Discover and connect with {filterOptions?.availableRoles?.length || ''} professionals across our network.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block shrink-0`}>
          <MembersFilterSidebar
            filters={filterOptions}
            selectedRoles={roles}
            toggleRole={toggleRole}
            selectedChapter={chapter || null}
            setChapter={(val) => setFilter('chapter', val || undefined)}
            availability={availability || null}
            setAvailability={(val) => setFilter('availability', val ? (val as AvailabilityStatus) : undefined)}
            className="sticky top-24"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <MembersSearchHeader
            query={query}
            setQuery={setQuery}
            totalResults={totalResults}
            onToggleFilters={() => setShowFilters(!showFilters)}
            showFilters={showFilters}
          />

          <MembersGrid
            members={allUsers}
            isLoading={isSearching}
            // onConnect={handleConnect}
            connectingId={connectingId}
            // isConnectModalOpen={isConnectModalOpen}
          />

          {/* Infinite Scroll Loader */}
          {(hasNextPage || isFetchingNextPage) && (
            <div ref={lastElementRef} className="py-8 flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!hasNextPage && allUsers.length > 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              You&apos;ve reached the end of the directory.
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
