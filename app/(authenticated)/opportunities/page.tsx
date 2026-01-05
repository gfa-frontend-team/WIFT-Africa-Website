'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { JobsList } from '@/components/jobs/JobsList'
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
          <TabsTrigger value="casting" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Casting
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <JobsList />
        </TabsContent>

        <TabsContent value="grants">
          <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Grants & Funding</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We're aggregating potential grants and funding opportunities for you. Check back soon for updates.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="casting">
          <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Casting Calls</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Looking for talent? Or looking to be cast? Our casting board is coming soon.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
