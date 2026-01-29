'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { chaptersApi } from '@/lib/api/chapters'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import ChapterCard from '@/components/shared/ChapterCard'

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
            {filteredChapters.map((chapter: any) => (
              <ChapterCard
                key={chapter.id}
                id={chapter.id}
                name={chapter.name}
                code={chapter.code}
                country={chapter.country}
                city={chapter.city}
                description={chapter.description || "Join this chapter to connect with women in film and television in this region."}
                memberCount={chapter.fixedMemberCount || 0}
                president={chapter.presidentName || chapter.currentPresident}
                admin={chapter.adminName}
                actionLink={`/chapters/${chapter.id}`}
                actionLabel="View Chapter"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
