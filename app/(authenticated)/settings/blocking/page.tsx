'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { connectionsApi } from '@/lib/api/connections'
import { Loader2, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Avatar from '@/components/ui/Avatar'
import { toast } from 'sonner'
import { useState } from 'react'

interface BlockedUser {
  id: string
  blockedUser: {
    id: string
    firstName: string
    lastName: string
    username: string
    profilePhoto?: string
  }
  createdAt: string // Blocked At
}

export default function BlockingSettingsPage() {
  const queryClient = useQueryClient()
  const [selectedUserToUnblock, setSelectedUserToUnblock] = useState<string | null>(null)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: () => connectionsApi.getBlockedUsers(),
  })

  const unblockMutation = useMutation({
    mutationFn: (userId: string) => connectionsApi.unblockUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] })
      toast.success('User unblocked successfully!')
      setSelectedUserToUnblock(null)
    },
    onError: (error: any) => {
      toast.error('Failed to unblock user.', {
        description: error.message || 'Please try again.',
      })
    },
  })

  // Explicitly cast the data
  const blockedUsers = (data?.blockedUsers || []) as BlockedUser[]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Failed to load blocked users.
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blocked Users</h1>
        <p className="text-muted-foreground mt-1">
          Manage users you have blocked.
        </p>
      </div>

      {blockedUsers.length === 0 ? (
        <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
          <UserX className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No blocked users</h3>
          <p className="text-muted-foreground mt-2">
            You haven't blocked anyone yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {blockedUsers.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
              <div className="flex items-center gap-3">
                <Avatar 
                  src={item.blockedUser.profilePhoto} 
                  name={`${item.blockedUser.firstName} ${item.blockedUser.lastName}`}
                />
                <div>
                  <div className="font-medium">
                    {item.blockedUser.firstName} {item.blockedUser.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{item.blockedUser.username}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => unblockMutation.mutate(item.blockedUser.id)}
                disabled={unblockMutation.isPending}
              >
                {unblockMutation.isPending && selectedUserToUnblock === item.blockedUser.id ? 'Unblocking...' : 'Unblock'}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
