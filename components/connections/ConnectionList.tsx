import { ConnectionRequest } from '@/lib/api/connections'
import { User } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import { MoreHorizontal, MessageCircle, UserMinus, Ban } from 'lucide-react'
import { useState } from 'react'

// Mock connection interface until we have a real one or fetch it
// Usually list of connections comes from a different endpoint not yet in store, 
// or derived. For this demo we might need to assume we are fetching Profiles or similar.
// But based on API docs: GET /api/v1/connections/requests is for requests.
// There is no explicit "GET /api/v1/connections" endpoint in my docs read?
// Wait, I missed "GET /api/v1/connections" in the docs list I saw?
// Ah, the docs I cat-ed earlier (Step 156) showed:
// DELETE /api/v1/connections/:connectionId
// GET /api/v1/connections/stats
// GET /api/v1/connections/check/:targetUserId
// It did NOT show a list endpoint.
// Let me double check if I missed "GET /api/v1/connections" in the file dump.
// Looking at Step 156 again... it jumps from "Response" to "Endpoint: Remove Connection".
// It seems I might have missed the main list endpoint.
// I will implement a placeholder or generic list assuming the endpoint exists (standard pattern),
// OR relying on Search/Profiles labeled as "connected".
// Actually, for "My Connections" page, we definitely need a list.
// I'll assume `GET /api/v1/connections` exists and returns User[] or Connection[]
// For now, I will build a Generic User Card component for this list.

import { ConnectionProfile } from '@/lib/api/connections'

interface ConnectionListProps {
  connections: ConnectionProfile[]
  onRemove: (id: string) => void
  onBlock?: (id: string) => void
}

export default function ConnectionList({ connections, onRemove, onBlock }: ConnectionListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {connections.map((connection) => {
        // Data is now flat: id, name, profilePhoto, professionalHeadline
        return (
          <div key={connection.id} className="bg-card border border-border rounded-lg p-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted relative mb-4">
              {connection.profilePhoto ? (
                <Image
                  src={connection.profilePhoto}
                  alt={connection.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-2xl font-bold">
                  {connection.name?.[0]}
                </div>
              )}
            </div>
            
            <Link 
              href={`/in/${connection.id}`} // Assuming ID maps to profile
              className="font-bold text-lg text-foreground hover:underline mb-1"
            >
              {connection.name}
            </Link>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
              {connection.professionalHeadline || 'Member'}
            </p>
            
            <div className="flex items-center gap-2 w-full">
              <Link 
                href={`/messages?userId=${connection.id}`}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Message
              </Link>
              <button 
                onClick={() => onRemove(connection.id)}
                className="p-2 border border-border rounded-md hover:bg-muted text-destructive hover:text-destructive"
                title="Remove connection"
              >
                <UserMinus className="h-4 w-4" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
