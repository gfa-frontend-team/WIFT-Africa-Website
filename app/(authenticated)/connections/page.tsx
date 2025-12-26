'use client'

import { useEffect, useState, useMemo } from 'react'
import { useConnectionStore } from '@/lib/stores/connectionStore'
import RequestCard from '@/components/connections/RequestCard'
import { Users, UserPlus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function ConnectionsPage() {
  const { 
    requests, 
    stats, 
    isLoading,
    fetchRequests, 
    fetchStats 
  } = useConnectionStore()

  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming')

  useEffect(() => {
    // fetchRequests('all') // handled by tab effect
    fetchStats()
  }, [fetchRequests, fetchStats])


  
  useEffect(() => {
    fetchRequests(activeTab)
  }, [activeTab, fetchRequests])

  // Deduplicate requests to prevent key errors
  const uniqueRequests = useMemo(() => {
    const seen = new Set()
    return requests.filter((request) => {
      if (!request || typeof request.id === 'undefined') return false
      
      const id = String(request.id) // Ensure string
      if (seen.has(id)) {
        console.warn('Duplicate connection request found:', request)
        return false
      }
      seen.add(id)
      return true
    })
  }, [requests])

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-4">Your Network</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Connections</span>
                  <span className="font-bold text-lg">{stats?.connectionsCount || 0}</span>
                </div>
                {/* <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Following</span>
                  <span className="font-bold">12</span>
                </div> */}
              </div>
              <div className="mt-6 pt-6 border-t border-border">
                <Link 
                  href="/search" 
                  className="block w-full py-2 bg-primary text-primary-foreground text-center rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Find People
                </Link>
              </div>
            </div>

            <div className="bg-muted/30 border border-border rounded-xl p-6">
                <h3 className="font-semibold mb-2">Manage my network</h3>
                <ul className="space-y-2 text-sm">
                    <li>
                        <Link href="/connections" className="flex items-center gap-2 text-primary font-medium">
                            <Users className="h-4 w-4" />
                            Connections
                        </Link>
                    </li>
                    {/* <li>
                        <Link href="/following" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                            <UserPlus className="h-4 w-4" />
                            Following & Followers
                        </Link>
                    </li> */}
                </ul>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
             {/* Tabs */}
            <div className="bg-card border border-border rounded-t-xl overflow-hidden flex border-b-0">
                <button
                    onClick={() => setActiveTab('incoming')}
                    className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'incoming' 
                            ? 'border-primary text-primary bg-primary/5' 
                            : 'border-transparent text-muted-foreground hover:bg-muted/50'
                    }`}
                >
                    Incoming Requests ({stats?.pendingIncoming || 0})
                </button>
                <button
                    onClick={() => setActiveTab('outgoing')}
                    className={`flex-1 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === 'outgoing' 
                            ? 'border-primary text-primary bg-primary/5' 
                            : 'border-transparent text-muted-foreground hover:bg-muted/50'
                    }`}
                >
                    Sent Requests ({stats?.pendingOutgoing || 0})
                </button>
            </div>

            <div className="bg-card border border-border border-t-0 rounded-b-xl p-6 min-h-[400px]">
                {isLoading ? (
                     <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : uniqueRequests.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {uniqueRequests.map((request, index) => (
                            <RequestCard key={`${request.id}-${index}`} request={request} type={activeTab} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                         <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            {activeTab === 'incoming' ? <UserPlus className="h-8 w-8 text-muted-foreground" /> : <ExternalLink className="h-8 w-8 text-muted-foreground" />}
                        </div>
                        <h3 className="text-lg font-semibold mb-2">
                            No {activeTab} requests
                        </h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">
                            {activeTab === 'incoming' 
                                ? "When people want to join your professional network, you'll see their requests here." 
                                : "You haven't sent any connection requests recently."}
                        </p>
                         {activeTab === 'outgoing' && (
                             <Link href="/search" className="inline-block mt-4 text-primary hover:underline">
                                 Grow your network
                             </Link>
                         )}
                    </div>
                )}
            </div>

            {/* Suggestions / Discovery (Placeholder) */}
            {/* <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">People you may know</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     
                </div>
            </div> */}
          </div>

        </div>
      </div>
    </div>
  )
}
