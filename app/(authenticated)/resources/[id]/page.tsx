'use client'

import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { resourcesApi } from '@/lib/api/resources'
import { ResourceType } from '@/types'
import { Button } from '@/components/ui/button'
import { ArrowLeft, FileText, Video, Calendar, Download } from 'lucide-react'
import { format } from 'date-fns'

export default function ResourceDetailPage() {
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['resource', id],
        queryFn: () => resourcesApi.getResource(id),
        enabled: !!id
    })

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="h-6 w-24 bg-muted animate-pulse rounded mb-6"></div>
                <div className="h-10 w-3/4 bg-muted animate-pulse rounded mb-4"></div>
                <div className="aspect-video w-full bg-muted animate-pulse rounded-lg mb-6"></div>
                <div className="h-4 w-full bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-muted animate-pulse rounded"></div>
            </div>
        )
    }

    if (isError || !data?.data) {
        return (
            <div className="container mx-auto px-4 py-16 flex flex-col items-center text-center max-w-md">
                <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
                <p className="text-muted-foreground mb-6">
                    {(error as Error)?.message || "The resource you are looking for does not exist or has been removed."}
                </p>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    const resource = data.data

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            {/* Back Button */}
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Resources
            </Button>

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded text-foreground font-medium text-xs">
                        {resource.resourceType === ResourceType.VIDEO ? (
                            <Video className="h-3 w-3" />
                        ) : (
                            <FileText className="h-3 w-3" />
                        )}
                        {resource.resourceType}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(resource.createdAt), 'MMMM d, yyyy')}
                    </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    {resource.title}
                </h1>
            </div>

            {/* Content Viewer */}
            <div className="bg-black/5 border border-border rounded-lg overflow-hidden mb-8 shadow-sm">
                {resource.resourceType === ResourceType.VIDEO ? (
                    <div className="aspect-video bg-black flex items-center justify-center">
                        {/* 
              In a real app, this would be a proper video player component 
              handling different sources (YouTube, Vimeo, MP4, etc.)
            */}
                        <video
                            src={resource.fileUrl}
                            controls
                            className="w-full h-full"
                            poster={resource.thumbnailUrl}
                        >
                            Your browser does not support the video tag.
                        </video>
                    </div>
                ) : (
                    <div className="aspect-[4/3] bg-background w-full">
                        <iframe
                            src={resource.fileUrl}
                            className="w-full h-full"
                            title={resource.title}
                        />
                    </div>
                )}
            </div>

            {/* Actions & Description */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xl font-semibold">About this resource</h3>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                        {resource.description}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <div className="bg-card border border-border rounded-lg p-4 shadow-sm">
                        <h4 className="font-semibold mb-3">Actions</h4>
                        <Button className="w-full mb-3" asChild>
                            <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" download>
                                <Download className="mr-2 h-4 w-4" />
                                Download / Open Original
                            </a>
                        </Button>
                        <p className="text-xs text-muted-foreground text-center">
                            Having trouble viewing? Open in a new tab.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
