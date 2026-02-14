'use client'

import { useState } from 'react'
import { useProfileAnalytics } from '@/lib/hooks/useProfileAnalytics'
import { AnalyticsHeader } from '@/components/analytics/AnalyticsHeader'
import { StatCard } from '@/components/analytics/StatCard'
import { ViewersList } from '@/components/analytics/ViewersList'
import { PostsPerformance } from '@/components/analytics/PostsPerformance'
import { ConnectionsSnapshot } from '@/components/analytics/ConnectionsSnapshot'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, BarChart2, Users, Loader2 } from 'lucide-react'

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('views')
  const { 
    timeframe, 
    setTimeframe, 
    profileViews, 
    postStats, 
    isLoading 
  } = useProfileAnalytics()

  if (isLoading && !profileViews && !postStats) {
      return (
          <div className="container mx-auto py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  const viewsCount = profileViews?.count || 0
  const impressionsCount = postStats?.totalImpressions || 0
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <AnalyticsHeader timeframe={timeframe} setTimeframe={setTimeframe} />
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard 
            title="Profile Views" 
            value={viewsCount.toLocaleString()}
            icon={Eye}
            active={activeTab === 'views'}
            onClick={() => setActiveTab('views')}
            description={`In the last ${timeframe === '30days' ? '30' : '90'} days`}
        />
        <StatCard 
            title="Post Impressions" 
            value={impressionsCount.toLocaleString()}
            icon={BarChart2}
            active={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            description="Total reach across all posts"
        />
        <StatCard 
            title="Connections" 
            value="Network" 
            icon={Users}
            active={activeTab === 'connections'}
            onClick={() => setActiveTab('connections')}
            description="View and manage connections"
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
          <TabsTrigger value="views">Profile Viewers</TabsTrigger>
          <TabsTrigger value="posts">Post Performance</TabsTrigger>
          <TabsTrigger value="connections">Connections</TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="space-y-4">
            <h2 className="text-xl font-semibold">Who viewed your profile</h2>
            <ViewersList viewers={profileViews?.viewers || []} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="posts" className="space-y-4">
            <h2 className="text-xl font-semibold">Post Engagement</h2>
            <PostsPerformance />
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recent Connections</h2>
            </div>
            <ConnectionsSnapshot />
        </TabsContent>
      </Tabs>
    </div>
  )
}
