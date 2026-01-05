'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { JobCard } from '@/components/jobs/JobCard'
import { JobFilters } from '@/components/jobs/JobFilters'
import { Loader2 } from 'lucide-react'
import type { JobFilters as FilterTypes } from '@/types/jobs'

export function JobsList() {
  const [filters, setFilters] = useState<FilterTypes>({})

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsApi.getJobs(filters),
  })

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Find Your Next Role</h2>
        <JobFilters onFilter={setFilters} />
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
        <div className="grid gap-6">
          {data?.data?.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
            </div>
          ) : (
            data?.data.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
