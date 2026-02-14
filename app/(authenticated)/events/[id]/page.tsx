'use client'

import { use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEvent } from '@/lib/hooks/useEvent'
import { EventHero } from '@/components/events/EventHero'
import { EventContent } from '@/components/events/EventContent'
import { Skeleton } from '@/components/ui/skeleton'

export default function EventDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params using React.use() as recommended in Next.js 15/16
  const resolvedParams = use(params)
  const router = useRouter()
  
  const { event, isLoading, isError, error } = useEvent(resolvedParams.id)

  if (isLoading) {
    return (
        <div className="min-h-screen bg-background pb-12">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <Skeleton className="w-24 h-8 mb-6" />
                <Skeleton className="w-full h-[400px] rounded-xl mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        <Skeleton className="w-1/3 h-8" />
                        <Skeleton className="w-full h-32" />
                    </div>
                    <div>
                        <Skeleton className="w-full h-48" />
                    </div>
                </div>
            </div>
        </div>
    )
  }

  if (isError || !event) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
         <Button variant="ghost" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
         </Button>
         <div className="flex flex-col items-center justify-center py-24 text-center">
            <h2 className="text-2xl font-bold border-b pb-2 mb-4">Event Not Found</h2>
            <p className="text-muted-foreground max-w-md mb-6">
                {error?.message || "The event you are looking for does not exist or has been removed."}
            </p>
            <Button onClick={() => router.push('/events')}>Browse Events</Button>
         </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Back navigation */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Button variant="ghost" onClick={() => router.back()} className="-ml-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
        </Button>
      </div>

      <EventHero event={event} />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <EventContent event={event} />
      </div>
    </div>
  )
}
