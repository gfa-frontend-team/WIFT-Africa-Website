'use client'

import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '@/lib/api/jobs'
import { applicationApi } from '@/lib/api/application'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Building2, Briefcase, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { JobApplicationModal } from '@/components/jobs/JobApplicationModal'

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch Job Data
  const { data: jobResponse, isLoading: isJobLoading, isError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobsApi.getJob(id),
    enabled: !!id,
  })

  // Fetch User Applications to check if already applied
  // This is a robust check in case 'hasApplied' flag is missing from job details
  const { data: applicationsResponse, isLoading: isAppsLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationApi.getMyApplications(1, 100), // Fetch enough to likely find it
  })

  const job = jobResponse?.data

  // Determine if user has applied
  const hasApplied = useMemo(() => {
    if (job?.hasApplied) return true;

    if (applicationsResponse?.applications) {
      return applicationsResponse.applications.some(app =>
        // app.job can be populated object or ID string. 
        // If populated, use _id. If string, compare directly.
        (typeof app.job === 'string' ? app.job : app.job._id) === id
      );
    }
    return false;
  }, [job, applicationsResponse, id]);

  const isLoading = isJobLoading || isAppsLoading

  if (isLoading) {
    return (
      <div className="flex justify-center h-[50vh] items-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !job) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-foreground mb-4">Job not found</h2>
        <p className="text-muted-foreground mb-6">The job posting you are looking for may have been removed or does not exist.</p>
        <Button asChild>
          <Link href="/opportunities">Back to Opportunities</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Jobs
      </Button>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-8 border-b border-border">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-muted-foreground" />
                  <span className="font-medium">{job.companyName}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-muted-foreground" />
                  {job.location}
                </div>
                {job.isRemote && (
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                    Remote
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Button size="lg" onClick={() => setIsModalOpen(true)} disabled={hasApplied}>
                {hasApplied ? 'Applied' : 'Apply Now'}
              </Button>
              <span className="text-sm text-muted-foreground">
                Posted {new Date(job.createdAt || new Date().toISOString()).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Badge variant="outline" className="px-3 py-1">
              <Briefcase className="w-3 h-3 mr-2" />
              {(job.employmentType || '').replace('_', ' ')}
            </Badge>
            {job.salaryRange && (
              <Badge variant="outline" className="px-3 py-1">
                {job.salaryRange.currency} {job.salaryRange.min.toLocaleString()} - {job.salaryRange.max.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>

        <div className="p-8 space-y-8">
          <section>
            <h3 className="text-xl font-bold text-foreground mb-4">About the Role</h3>
            <div className="prose max-w-none text-muted-foreground leading-relaxed whitespace-pre-line">
              {job.description}
            </div>
          </section>

          {job.responsibilities && job.responsibilities.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements && job.requirements.length > 0 && (
            <section>
              <h3 className="text-xl font-bold text-foreground mb-4">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>

      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={job._id}
        jobTitle={job.title}
      />
    </div>
  )
}
