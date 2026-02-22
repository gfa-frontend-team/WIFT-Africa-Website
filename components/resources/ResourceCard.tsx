"use client"
import { Resource, ResourceType } from '@/types'
import { FileText, Video, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useState,useEffect } from 'react'
import { getThumbnails } from 'video-metadata-thumbnails';

interface ResourceCardProps {
    resource: Resource
}

export function ResourceCard({ resource }: ResourceCardProps) {
    const Icon = resource.resourceType === ResourceType.VIDEO ? Video : FileText

    // const [thumb, setThumb] = useState<string | null>(null);

    const url = resource.fileUrl

   const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  
  let thumbSrc = '';

if (isYouTube) {
  const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
  thumbSrc = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
} 

    console.log(thumbSrc,"resource.thumbnailUrl")

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
            {/* Thumbnail / Icon Area */}
            <div className="aspect-video bg-muted flex items-center justify-center relative">
                {resource.thumbnailUrl ||thumbSrc ? (
                    <img
                        src={resource.thumbnailUrl || thumbSrc}
                        alt={resource.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="h-16 w-16 rounded-full bg-background/50 flex items-center justify-center">
                        <Icon className="h-8 w-8 text-muted-foreground" />
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {resource.resourceType}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="font-semibold text-lg line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                    {resource.title}
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4 flex-1">
                    {resource.description}
                </p>

                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t">
                    <span>{format(new Date(resource.createdAt), 'MMM d, yyyy')}</span>
                    <Link
                        href={`/resources/${resource.id || resource._id}`}
                        className="flex items-center text-primary font-medium hover:underline"
                    >
                        View Resource <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                </div>
            </div>
        </div>
    )
}
