'use client'

import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { chaptersApi } from '@/lib/api/chapters'
import { Loader2, MapPin, Users, Globe, Mail, Phone, Calendar, ArrowLeft, CheckCircle2, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export default function ChapterDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth() // To check if user is already a member of this chapter?
  const chapterId = params.id as string

  const { data: chapterResponse, isLoading, isError } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => chaptersApi.getChapter(chapterId),
    enabled: !!chapterId,
  })

  const chapter = chapterResponse?.chapter

  // Simple Badge fallback if component doesn't exist in project yet (likely shadcn/ui badge)
  // I'll stick to div with classes if not sure, but let's assume shadcn UI button usage implies general shadcn adoption.
  // Actually, I didn't see Badge in the file list earlier, but I'll use inline styles to be safe or simple span.

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (isError || !chapter) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-2">Chapter not found</h2>
        <p className="text-muted-foreground mb-6">The chapter you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="pb-12 bg-background min-h-screen">
      {/* Header / Hero */}
      <div className="bg-muted/30 border-b border-border">
        <div className="max-w-screen-xl mx-auto px-4 py-8">
           <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-primary" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Directory
           </Button>

           <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Cover/Logo placeholder - could be distinct for chapters later */}
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-border">
                 <Users className="h-16 w-16 text-primary" />
              </div>

              <div className="flex-1">
                 <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <h1 className="text-3xl md:text-4xl font-bold">{chapter.name}</h1>
                    {chapter.isActive ? (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                           Active Chapter
                        </div>
                    ) : (
                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                           Inactive
                        </div>
                    )}
                 </div>
                 
                 <div className="flex flex-wrap gap-4 text-muted-foreground mb-6">
                    <div className="flex items-center gap-1.5">
                       <MapPin className="h-4 w-4" />
                       <span>{chapter.city ? `${chapter.city}, ` : ''}{chapter.country}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Users className="h-4 w-4" />
                       <span>{chapter.memberCount} Members</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>Founded {new Date(chapter.createdAt).getFullYear()}</span>
                    </div>
                 </div>

                 {user?.chapterId === chapter.id ? (
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
                          <CheckCircle2 className="h-5 w-5" />
                          You are a member of this chapter
                      </div>
                 ) : (
                     // Placeholder for "Join This Chapter" if logic permits switching or applying
                     <Button className="gap-2" disabled>
                        Contact to Join
                     </Button>
                 )}
              </div>
           </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
         {/* Main Content */}
         <div className="md:col-span-2 space-y-8">
            <section>
               <h2 className="text-2xl font-semibold mb-4">About</h2>
               <div className="prose dark:prose-invert max-w-none text-muted-foreground whitespace-pre-line">
                  {chapter.description || "No description available for this chapter."}
               </div>
            </section>

             {/* Mission Statement if available (API didn't show it in type properly but endpoints docs mentioned it) */}
             {/* Adding it conditionally if I update types, but for now relying on what's in types or generic */}
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
            <Card>
               <CardContent className="pt-6 space-y-4">
                  <h3 className="font-semibold text-lg mb-2">Contact Information</h3>
                  
                  {/* These fields might need to be added to the Chapter type if they aren't there yet, checking endpoints.md they exist in details response */}
                  {/* Types file has limited fields on Chapter interface, I might need to update it or cast it */}
                  
                  {/* Using 'any' cast temporarily if types are strict, or just rendering safe fields */}
                  {/* Actually, let's update the type definition in next step if fields are missing in index.ts */}
                  
                  <div className="space-y-3">
                      <div className="flex items-start gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                              <p className="text-sm font-medium">Email</p>
                              {/* @ts-ignore - API returns email but type might be missing it */}
                              <a href={`mailto:${chapter.email || 'info@wiftafrica.org'}`} className="text-sm text-primary hover:underline break-all">
                                  {/* @ts-ignore */}
                                  {chapter.email || 'N/A'}
                              </a>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                              <p className="text-sm font-medium">Phone</p>
                               {/* @ts-ignore */}
                              <p className="text-sm text-muted-foreground">{chapter.phone || 'N/A'}</p>
                          </div>
                      </div>

                      <div className="flex items-start gap-3">
                          <Globe className="h-4 w-4 text-muted-foreground mt-1" />
                          <div>
                              <p className="text-sm font-medium">Website</p>
                               {/* @ts-ignore */}
                              {chapter.website ? (
                                  <a 
                                    // @ts-ignore
                                    href={chapter.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                      Visit Website <ExternalLink className="h-3 w-3" />
                                  </a>
                              ) : (
                                  <p className="text-sm text-muted-foreground">N/A</p>
                              )}
                          </div>
                      </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  )
}
