'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'
import { useDebounce } from './useDebounce'
import { Role, AvailabilityStatus, SortOption } from '../api/search'

export interface UrlSearchState {
    query: string
    roles: Role[]
    skills: string[]
    location: string
    chapter: string
    availability?: AvailabilityStatus
    isMultihyphenate?: boolean
    sortBy: SortOption
    page: number
}

export function useUrlSearch() {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    // --- Read State from URL ---
    const state: UrlSearchState = useMemo(() => {
        return {
            query: searchParams.get('query') || '',
            roles: (searchParams.get('roles')?.split(',').filter(Boolean) as Role[]) || [],
            skills: searchParams.get('skills')?.split(',').filter(Boolean) || [],
            location: searchParams.get('location') || '',
            chapter: searchParams.get('chapter') || '',
            availability: (searchParams.get('availability') as AvailabilityStatus) || undefined,
            isMultihyphenate: searchParams.get('isMultihyphenate') === 'true',
            sortBy: (searchParams.get('sortBy') as SortOption) || 'relevance',
            page: Number(searchParams.get('page')) || 1,
        }
    }, [searchParams])

    // --- Update URL Helper ---
    // We use a callback to construct the new URL params based on updates
    const updateUrl = useCallback((updates: Partial<UrlSearchState>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0) || value === false) {
                params.delete(key)
            } else if (Array.isArray(value)) {
                params.set(key, value.join(','))
            } else {
                params.set(key, String(value))
            }
        })

        // Reset page to 1 if any filter (besides page) changes
        if (!updates.page && Object.keys(updates).length > 0) {
            params.set('page', '1')
        }

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, [pathname, router, searchParams])

    // --- Actions ---
    const setQuery = (query: string) => updateUrl({ query })

    const setFilter = <K extends keyof UrlSearchState>(key: K, value: UrlSearchState[K] | undefined) => {
        updateUrl({ [key]: value })
    }

    const setPage = (page: number) => updateUrl({ page })

    const clearFilters = () => {
        router.replace(pathname, { scroll: false })
    }

    return {
        ...state,
        updateUrl,
        setQuery,
        setFilter,
        setPage,
        clearFilters
    }
}
