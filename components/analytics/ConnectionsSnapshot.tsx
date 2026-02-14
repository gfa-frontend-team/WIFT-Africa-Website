import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { connectionsApi } from '@/lib/api/connections'
import { Card, CardContent } from '@/components/ui/card'
import Avatar from '@/components/ui/Avatar'
import { Button } from '@/components/ui/button'
import { MessageCircle, UserMinus, Loader2, Users } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { getProfileUrl } from '@/lib/utils/routes'

export function ConnectionsSnapshot() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['connections-snapshot'],
    queryFn: () => connectionsApi.getConnections(1, 5), // Top 5
  })

  const removeMutation = useMutation({
    mutationFn: (connectionId: string) => connectionsApi.removeConnection(connectionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections-snapshot'] })
    },
    onError: () => {
       // toast.error("Failed to remove connection")
       alert("Failed to remove connection")
    }
  })

  // Handle remove connection
  const handleRemove = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from your connections?`)) {
        removeMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
        <div className="space-y-3">
             {[1, 2, 3].map(i => (
                 <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-lg" />
             ))}
        </div>
    )
  }

  const connections = data?.connections || []

  if (connections.length === 0) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-8 text-center bg-muted/10">
                <Users className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-muted-foreground text-sm">No connections yet.</p>
                <Button variant="link" asChild size="sm">
                    <Link href="/search">Find people to connect with</Link>
                </Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <div className="space-y-3">
      {connections.map((conn) => {
        // Flat structure: id, name, profilePhoto, professionalHeadline
        return (
          <div key={conn.id} className="flex items-center justify-center p-3 bg-white border rounded-lg hover:shadow-sm transition-shadow">
            <Link href={getProfileUrl(conn)} className="flex items-center gap-3 flex-1 min-w-0">
               <Avatar 
                  src={conn.profilePhoto} 
                  name={conn.name}
                  size="md"
               />
               <div className="min-w-0">
                  <h4 className="font-medium text-sm truncate">{conn.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{conn.professionalHeadline || 'Member'}</p>
               </div>
            </Link>

            <div className="flex items-center gap-1 ml-2">
               <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" asChild>
                  <Link href={`/messages?userId=${conn.id}`}>
                      <MessageCircle className="h-4 w-4" />
                  </Link>
               </Button>
               <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(conn.id, conn.name)}
                    disabled={removeMutation.isPending}
               >
                  <UserMinus className="h-4 w-4" />
               </Button>
            </div>
          </div>
        )
      })}

      {data && data.totalConnections > 5 && (
          <Button variant="ghost" className="w-full text-xs text-muted-foreground" asChild>
              <Link href="/connections">View all ({data.totalConnections})</Link>
          </Button>
      )}
    </div>
  )
}
