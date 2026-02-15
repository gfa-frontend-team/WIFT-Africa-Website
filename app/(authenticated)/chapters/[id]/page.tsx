'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { chaptersApi } from '@/lib/api/chapters'
import { useChapterEvents, useChapterFunding, useChapterMentorships } from '@/lib/hooks/useChapter'
import {
  ArrowLeft, Users, MapPin, Mail, Calendar, Briefcase, Crown,
  Loader2
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getCountryFlagUrl } from '@/lib/utils/countryMapping'
import { EventCard } from '@/components/events/EventCard'
import { FundingCard } from '@/components/funding/FundingCard'
import { MentorshipCard } from '@/components/mentorship/MentorshipCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'
import { useAuth } from '@/lib/hooks/useAuth'
import { Chapter, Job } from '@/types'
import { useJobs } from '@/hooks/useJobs'
import { JobCard } from '@/components/jobs/JobCard'

export default function ChapterDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const chapterId = params.id as string

  const {user} = useAuth()
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'opportunities'>('about')

  const { data: chapterResponse, isLoading, isError } = useQuery({
    queryKey: ['chapter', chapterId],
    queryFn: () => chaptersApi.getChapter(chapterId),
    enabled: !!chapterId,
  })
  
  const chapter: Chapter = chapterResponse?.chapter
  const isUserChapterId = user?.chapter?._id === chapterId
  // console.log(user,"user")

  // Fetch chapter-specific data
  const { data: eventsData, isLoading: isLoadingEvents } = useChapterEvents(chapterId)
  const { data: fundingData, isLoading: isLoadingFunding } = useChapterFunding(chapterId)
  const { data: mentorshipsData, isLoading: isLoadingMentorships } = useChapterMentorships(chapterId)
  const {data:jobs,isLoading:isJobbing} = useJobs()

  
  const chapterJobs: Job[] = useMemo(() => {
    if (!jobs?.data) return []
    return jobs.data.filter(ele => ele?.chapterId === chapterId)
  }, [jobs, chapterId])
  // console.log(chapterJobs,"jobs")

  // Extract data arrays
  const events = eventsData?.events || []
  const funding = fundingData?.data || []
  const mentorships = mentorshipsData?.data || []

  // Calculate counts
  const upcomingEventsCount = events.length
  const opportunitiesCount = funding.length + mentorships.length + chapterJobs.length

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
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Chapters
        </Button>
      </div>
    )
  }

  // We will use the utility directly in the render
  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/chapters")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Chapters</span>
        </button>

        {/* Header */}
        <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-8 border-b border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 flex-shrink-0">
                  {chapter.code === 'HQ' || chapter.country === 'Global' ? (
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-5xl">
                      🌍
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div className="w-20 h-20 rounded bg-card shadow-sm flex items-center justify-center overflow-hidden">
                      <Image
                        src={getCountryFlagUrl(chapter.code, chapter.country)}
                        alt={`${chapter.country} flag`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.innerHTML = '📍';
                          e.currentTarget.parentElement!.classList.add('text-3xl');
                        }}
                        width={50}
                        height={50}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-foreground capitalize">
                      {chapter.name}
                    </h1>
                    {chapter.code === 'HQ' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-sm font-medium rounded-full flex items-center gap-1">
                        <Crown className="h-4 w-4" />
                        Headquarters
                      </span>
                    )}
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {chapter.country}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{chapter.city ? `${chapter.city}, ` : ''}{chapter.country}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {(chapter.fixedMemberCount || 0).toLocaleString()} Members
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-8 px-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("about")}
                className={`py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "about"
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "events"
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                Events
              </button>
              <button
                onClick={() => setActiveTab("opportunities")}
                className={`py-4 border-b-2 transition-colors whitespace-nowrap ${activeTab === "opportunities"
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
              >
                Opportunities
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* ABOUT CONTENT  */}
            {activeTab === "about" && (
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  About {chapter.name}
                </h2>
                <div className="text-muted-foreground mb-6 leading-relaxed whitespace-pre-line">
                  {chapter.description || "No description available."}
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">
                    Chapter Leadership
                  </h3>

                  <div className="space-y-4">
                    {(chapter.currentPresident || chapter.presidentName) && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold text-lg">
                            {(chapter.currentPresident || chapter.presidentName || '').charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-1">
                            {chapter.currentPresident || chapter.presidentName}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            Chapter President
                          </p>
                          {chapter.presidentEmail && (
                            <a
                              href={`mailto:${chapter.presidentEmail}`}
                              className="text-sm text-primary hover:underline flex items-center gap-1"
                            >
                              <Mail className="h-3 w-3" />
                              {chapter.presidentEmail}
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {chapter.adminName && (
                      <div className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary font-semibold text-lg">
                            {chapter.adminName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-1">
                            {chapter.adminName}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            Chapter Admin
                          </p>
                          {/* Admin email not strictly available on Chapter type yet, using placeholder or check adminIds if needed. 
                                 For now leaving email out if not in top level flat props. 
                             */}
                        </div>
                      </div>
                    )}

                    {!chapter.currentPresident && !chapter.presidentName && !chapter.adminName && (
                      <p className="text-muted-foreground italic">Leadership information not available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* EVENTS CONTENT  */}
            {activeTab === "events" && (
              <div className="space-y-4">
                {isLoadingEvents ? (
                  <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                    <p className="text-muted-foreground">Loading events...</p>
                  </div>
                ) : events.length === 0 ? (
                  <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No upcoming events for this chapter.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {events.map((event) => (
                      <EventCard key={event.id || event._id} event={event} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* OPPO CONTENT  */}
            {activeTab === "opportunities" && (
              <div className="space-y-6">
                {isLoadingFunding || isLoadingMentorships || isJobbing ? (
                  <div className="bg-card border border-border rounded-lg p-12 text-center">
                    <Loader2 className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                    <p className="text-muted-foreground">Loading opportunities...</p>
                  </div>
                ) :
                //  funding.length === 0 && mentorships.length === 0 ? (
                //   <div className="bg-card border border-border rounded-lg p-12 text-center">
                //     <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                //     <p className="text-muted-foreground">
                //       No opportunities available for this chapter.
                //     </p>
                //   </div>
                // ) :
                 (
                  <Tabs defaultValue="funding" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3 max-w-[400px]">
                      <TabsTrigger value="jobs">
                        Jobs ({chapterJobs.length})
                      </TabsTrigger>
                      <TabsTrigger value="funding">
                        Grants ({funding.length})
                      </TabsTrigger>
                      <TabsTrigger value="mentorship">
                        Mentorship ({mentorships.length})
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="jobs">
                      {chapterJobs.length === 0 ? (
                        <div className="bg-muted/30 border border-border rounded-xl p-12 text-center">
                          <p className="text-muted-foreground">No jobs available.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {chapterJobs?.map((jobs) => (
                            <JobCard key={jobs._id} job={jobs} />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                    <TabsContent value="funding">
                      {funding.length === 0 ? (
                        <div className="bg-muted/30 border border-border rounded-xl p-12 text-center">
                          <p className="text-muted-foreground">No funding opportunities available.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {funding.map((opportunity) => (
                            <FundingCard key={opportunity.id || opportunity._id} opportunity={opportunity} />
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="mentorship">
                      {mentorships.length === 0 ? (
                        <div className="bg-muted/30 border border-border rounded-xl p-12 text-center">
                          <p className="text-muted-foreground">No mentorship opportunities available.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {mentorships.map((mentorship) => (
                            <MentorshipCard key={mentorship.id || mentorship._id} mentorship={mentorship} />
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Chapter Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Members
                  </span>
                  <span className="font-semibold text-foreground">
                    {(chapter.fixedMemberCount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Upcoming Events
                  </span>
                  <span className="font-semibold text-foreground">
                    {upcomingEventsCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Open Opportunities
                  </span>
                  <span className="font-semibold text-foreground">
                    {opportunitiesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Get in Touch
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Have questions about this chapter? Reach out to the chapter
                leadership.
              </p>
              {/* Removed "Contact Chapter" button as per request to remove "contact to join" button. 
                  Keeping the section as "Get in Touch" context, but if no emails are visible in leadership section, 
                  this might be redundant. 
                  Adding just a text link or verifying if any contact info is available.
              */}
              {chapter.presidentEmail || chapter.email ? (
                <a
                  href={`mailto:${chapter.presidentEmail || chapter.email}`}
                  className="text-primary hover:underline font-medium flex items-center justify-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Email Chapter
                </a>
              ) : (
                <p className="text-sm text-muted-foreground italic">No contact email available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
