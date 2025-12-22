'use client'

import { Briefcase, ExternalLink } from 'lucide-react'
import FeatureGate, { FeatureButton } from '@/components/access/FeatureGate'
import { useFeatureAccess } from '@/lib/hooks/useFeatureAccess'

export default function OpportunitiesPage() {
  const { access } = useFeatureAccess()

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-6">
      <FeatureGate 
        feature="canViewOpportunities"
        restrictionTitle="Opportunities Require Verification"
        restrictionDescription="Complete your membership verification to view and apply for opportunities in the film industry."
        size="lg"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Opportunities</h1>
              <p className="text-muted-foreground mt-2">
                Discover jobs, grants, mentorship programs, and collaboration opportunities
              </p>
            </div>
          </div>

          {/* Coming Soon Content */}
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Opportunities Coming Soon
              </h2>
              <p className="text-muted-foreground mb-6">
                Discover jobs, grants, mentorship programs, and collaboration opportunities in the film industry.
              </p>

              {/* Example restricted action */}
              <div className="space-y-3">
                <FeatureButton
                  feature="canApplyToOpportunities"
                  className="w-full py-3 px-4 bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  Apply to Opportunities
                </FeatureButton>
                
                {!access.canApplyToOpportunities && (
                  <p className="text-xs text-muted-foreground">
                    Complete verification to apply for opportunities
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </FeatureGate>
    </div>
  )
}
