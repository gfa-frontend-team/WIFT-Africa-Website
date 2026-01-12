import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { JobCard } from '@/components/jobs/JobCard'
import { JobFilters } from '@/components/jobs/JobFilters'
import { Loader2 } from 'lucide-react'
import type { JobFilters as FilterTypes } from '@/types/jobs'
import SearchPagination from '@/components/search/SearchPagination'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function JobsList() {
  const [filters, setFilters] = useState<FilterTypes>({})
  const [page, setPage] = useState(1)
  const limit = 10

  const handleFilterChange = (newFilters: FilterTypes) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page on filter change
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', filters, page, limit],
    queryFn: () => jobsApi.getJobs(filters, page, limit),
  })

  // Calculate total pages if backend provides it, otherwise guess based on result count
  const totalResults = data?.results || 0
  const totalPages = Math.ceil(totalResults / limit) || 1

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-semibold text-gray-900">Find Your Next Role</h2>
             <Button variant="outline" asChild>
                <Link href="/opportunities/my-applications">My Applications</Link>
             </Button>
        </div>
        <JobFilters onFilter={handleFilterChange} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-red-50 rounded-lg">
          <p className="text-red-600">Failed to load jobs. Please try again later.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-6">
            {data?.data?.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              data?.data.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            )}
          </div>
          
          <SearchPagination 
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  )
}
