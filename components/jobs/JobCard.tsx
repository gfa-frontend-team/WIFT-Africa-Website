import { Job } from '@/types'
import { MapPin, Briefcase, Clock, Building2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between md:justify-start gap-4">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                {job.title}
              </h3>
              {job.isRemote && (
                <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  Remote
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-gray-600 font-medium">
              <Building2 className="w-4 h-4 mr-2" />
              {job.companyName}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Briefcase className="w-4 h-4 mr-1" />
                {(job.employmentType || '').replace('_', ' ')}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Posted {new Date(job.createdAt || new Date().toISOString()).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start md:items-end gap-2 min-w-[120px]">
            <Button asChild className="w-full md:w-auto">
              <Link href={`/opportunities/jobs/${job._id}`}>View Details</Link>
            </Button>
            {job.hasApplied && (
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                Applied
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
