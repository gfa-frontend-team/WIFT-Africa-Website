'use client'

import { useMyApplications } from '@/hooks/use-applications'
import { ApplicationCard } from '@/components/jobs/ApplicationCard'
import { Loader2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { Application } from '@/types/application'
import { useState } from 'react'
import SearchPagination from '@/components/search/SearchPagination'

export default function MyApplicationsPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string | undefined>(undefined)
  const limit = 10
  const { data, isLoading, error } = useMyApplications(page, limit, status)

  const handleStatusChange = (value: string) => {
    setStatus(value === 'ALL' ? undefined : value)
    setPage(1)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        Failed to load applications. Please try again later.
      </div>
    )
  }

  // Explicitly cast or access safely
  const applications = (data?.applications as Application[]) || []
  const totalPages = data?.pages || 1

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your job applications
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
            <Select value={status || 'ALL'} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Applications</SelectItem>
                    <SelectItem value="RECEIVED">Received</SelectItem>
                    <SelectItem value="SHORTLISTED">Shortlisted</SelectItem>
                    <SelectItem value="HIRED">Hired</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
            </Select>
            <Button asChild className="w-full sm:w-auto">
                <Link href="/opportunities">Browse Jobs</Link>
            </Button>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No applications yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Start applying to open positions to see them here.
          </p>
          <Button asChild>
            <Link href="/opportunities">Browse Opportunities</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="space-y-4">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
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
