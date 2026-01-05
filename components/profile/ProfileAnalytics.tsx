'use client'

import { useAnalytics } from '@/lib/hooks/useAnalytics'
import { BarChart3, Users, Eye, TrendingUp, Lock } from 'lucide-react'

export default function ProfileAnalytics() {
  const { useSummary } = useAnalytics()
  const { data: summary, isLoading, error } = useSummary()

  // If error (likely 403 or analytics not enabled/available yet), hide section or show empty
  // For now, we'll hide if we can't load data to avoid cluttering the UI
  if (error) {
    return null
  }

  return (
    <div className="bg-card border border-border rounded-lg p-5 mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Analytics
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium text-muted-foreground uppercase tracking-wider border border-border">
                Private to you
            </span>
        </div>
        
        {/* Helper/Info tooltip could go here */}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-muted/50 rounded-md"></div>
            ))}
        </div>
      ) : !summary ? (
        <div className="text-center py-6 text-muted-foreground bg-muted/20 rounded-lg">
             <p>No analytics data available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-background border border-border/50 flex flex-col items-center text-center hover:border-primary/20 transition-colors">
                <div className="mb-2 p-2 rounded-full bg-blue-500/10 text-blue-500">
                    <Eye className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                    {(summary?.totalImpressions ?? 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                    Impressions
                </div>
            </div>

            <div className="p-4 rounded-lg bg-background border border-border/50 flex flex-col items-center text-center hover:border-primary/20 transition-colors">
                <div className="mb-2 p-2 rounded-full bg-green-500/10 text-green-500">
                    <Users className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                    {(summary?.totalMembersReached ?? 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                    Accounts Reached
                </div>
            </div>

            <div className="p-4 rounded-lg bg-background border border-border/50 flex flex-col items-center text-center hover:border-primary/20 transition-colors">
                <div className="mb-2 p-2 rounded-full bg-purple-500/10 text-purple-500">
                    <TrendingUp className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                    {(summary?.totalEngagement ?? 0).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide mt-1">
                    Engagement
                </div>
            </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-border flex justify-end">
         <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
            View detailed insights
            <span className="text-xs">→</span>
         </button>
      </div>
    </div>
  )
}
