"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobsList } from "@/components/jobs/JobsList";
import { MentorshipsList } from "@/components/mentorship/MentorshipsList";
import { FundingList } from "@/components/funding/FundingList";
import { Briefcase, FileText, Lock, Video } from "lucide-react";

export default function OpportunitiesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Opportunities
        </h1>
        <p className="text-muted-foreground">
          Explore career opportunities, grants, and casting calls.
        </p>
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
            <Lock className="w-4 h-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs">
          <JobsList />
        </TabsContent>

        <TabsContent value="grants" className="mt-6">
          <FundingList />
        </TabsContent>

        <TabsContent value="mentorship" className="mt-6">

          {/* <MentorshipsList /> */}

          <div className="bg-muted/30 border border-border rounded-xl p-16 text-center">
            <div className="max-w-md mx-auto flex flex-col items-center">
              {/* Swapped Filter for Lock icon */}
              <Lock className="h-12 w-12 text-muted-foreground/50 mb-4" />

              <h3 className="text-lg font-semibold mb-2">
                Mentorship is temporarily locked
              </h3>

              <p className="text-muted-foreground mb-6">
                We are currently updating our mentorship programs. Access will
                be restored shortly. Thank you for your patience.
              </p>

            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
