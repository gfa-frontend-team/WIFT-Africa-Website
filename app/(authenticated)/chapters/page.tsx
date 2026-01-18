'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { chaptersApi } from '@/lib/api/chapters'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2, Search, MapPin, Users, Globe, ExternalLink, ArrowRight, Crown, User } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ChaptersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  // We can add country filter state here if needed later

  const { data: chaptersData, isLoading, isError } = useQuery({
    queryKey: ['chapters', searchQuery],
    queryFn: () => chaptersApi.getChapters(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  // Client-side filtering for now until API search param is confirmed/implemented robustly
  const chapters = chaptersData?.data?.chapters || []
  const filteredChapters = chapters.filter(chapter => 
    chapter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.city?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-primary/5 border-b border-border py-12 md:py-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">WIFT Africa Chapters</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto ">
            Connect with our network of chapters across the continent. Find a chapter near you and join the community.
          </p>
          
          {/* <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name, country, or city..." 
              className="pl-10 h-12"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}
        </div>
      </div>

      {/* Chapters Grid */}
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : isError ? (
          <div className="text-center py-20">
            <p className="text-destructive mb-4">Failed to load chapters.</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : filteredChapters.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No chapters found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChapters.map((chapter: any) => ( // Use 'any' or 'Chapter' if available in scope
              <Card key={chapter.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl">{chapter.name}</CardTitle>
                    {chapter.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                        Inactive
                      </span>
                    )}
                  </div>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {chapter.city ? `${chapter.city}, ` : ''}{chapter.country}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="space-y-1 mb-3">
                    {chapter.currentPresident && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Crown className="h-4 w-4 text-primary" />
                        <span>President: {chapter.currentPresident}</span>
                      </div>
                    )}
                    {chapter.adminName && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="h-4 w-4 text-primary" />
                        <span>Admin: {chapter.adminName}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground line-clamp-3 mb-4 text-sm">
                    {chapter.description || "Join this chapter to connect with women in film and television in this region."}
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span>{chapter.fixedMemberCount || 0} Members</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border mt-auto">
                  <Button asChild className="w-full group">
                    <Link href={`/chapters/${chapter.id}`}>
                      View Chapter 
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
