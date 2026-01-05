'use client'

import { useMyApplications } from '@/hooks/use-applications'
import { ApplicationCard } from '@/components/jobs/ApplicationCard'
import { Loader2, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Application } from '@/types/application'

export default function MyApplicationsPage() {
  const { data, isLoading, error } = useMyApplications()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Applications</h1>
          <p className="text-muted-foreground mt-1">
            Track the status of your job applications
          </p>
        </div>
        <Button asChild>
          <Link href="/opportunities/jobs">Browse Jobs</Link>
        </Button>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No applications yet</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Start applying to open positions to see them here.
          </p>
          <Button asChild>
            <Link href="/opportunities/jobs">Browse Opportunities</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      )}
    </div>
  )
}
