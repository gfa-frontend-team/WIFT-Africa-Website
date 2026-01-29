'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JobsList } from '@/components/jobs/JobsList'
import { MentorshipsList } from '@/components/mentorship/MentorshipsList'
import { FundingList } from '@/components/funding/FundingList'
import { Briefcase, FileText, Video } from 'lucide-react'

export default function OpportunitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Opportunities</h1>
        <p className="text-gray-600">Explore career opportunities, grants, and casting calls.</p>
      </div>

      <Tabs defaultValue="jobs" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="jobs" className="flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="grants" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Grants
          </TabsTrigger>
          <TabsTrigger value="mentorship" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Mentorship
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <JobsList />
        </TabsContent>

        <TabsContent value="grants" className="mt-6">
          <FundingList />
        </TabsContent>

        <TabsContent value="mentorship" className="mt-6">
          <MentorshipsList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
