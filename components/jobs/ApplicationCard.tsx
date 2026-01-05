import { Application, ApplicationStatus } from '@/types/application'
import { MapPin, Building2, Calendar, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ApplicationCardProps {
  application: Application
}

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.RECEIVED]: 'bg-blue-100 text-blue-800',
  [ApplicationStatus.SHORTLISTED]: 'bg-purple-100 text-purple-800',
  [ApplicationStatus.REJECTED]: 'bg-red-100 text-red-800',
  [ApplicationStatus.HIRED]: 'bg-green-100 text-green-800',
}

export function ApplicationCard({ application }: ApplicationCardProps) {
  const { job } = application

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between md:justify-start gap-4">
              <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
                {job?.title || 'Unknown Position'}
              </h3>
              <Badge variant="secondary" className={statusColors[application.status] || 'bg-gray-100 text-gray-800'}>
                {application.status}
              </Badge>
            </div>
            
            <div className="flex items-center text-gray-600 font-medium">
              <Building2 className="w-4 h-4 mr-2" />
              {job?.companyName || 'Unknown Company'}
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                {job?.location || 'N/A'}
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Applied {new Date(application.appliedAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-start md:items-end gap-2 min-w-[120px]">
             {/* If job exists, link to it. If we had an application details page, we'd link there. */}
            {job && (
              <Button asChild variant="outline" className="w-full md:w-auto">
                <Link href={`/opportunities/jobs/${job._id}`}>View Job</Link>
              </Button>
            )}
             {application.resume && (
                 <Button asChild variant="ghost" size="sm" className="w-full md:w-auto h-8">
                     <Link href={application.resume} target="_blank" className="flex items-center gap-2">
                         <FileText className="w-3 h-3"/>
                         <span>View Resume</span>
                     </Link>
                 </Button>
             )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
