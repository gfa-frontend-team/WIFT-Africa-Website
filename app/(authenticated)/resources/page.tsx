'use client'

import { useQuery } from '@tanstack/react-query'
import { resourcesApi } from '@/lib/api/resources'
import { ResourceCard } from '@/components/resources/ResourceCard'
import { BookOpen, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ResourcesPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['resources'],
    queryFn: resourcesApi.getResources
  })

  // Handle Loading
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2"></div>
          <div className="h-4 w-96 bg-muted animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  // Handle Error
  if (isError) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center max-w-md">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Failed to load resources</h2>
        <p className="text-muted-foreground mb-6">
          {(error as Error).message || "We couldn't fetch the resources. Please try again later."}
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const resources = data?.data || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-primary/10 rounded-lg">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Resources</h1>
          <p className="text-muted-foreground mt-1">
            Access guides, templates, and educational materials to advance your career.
          </p>
        </div>
      </div>

      {/* Empty State */}
      {resources.length === 0 ? (
        <div className="bg-muted/20 border border-border rounded-lg p-12 text-center">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-2">No resources available yet</h3>
            <p className="text-muted-foreground">
              Check back soon! We are constantly updating our library with new materials.
            </p>
          </div>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <ResourceCard key={resource.id || resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  )
}
