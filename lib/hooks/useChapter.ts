import { useQuery } from '@tanstack/react-query'
import { eventsApi, type EventFilters } from '@/lib/api/events'
import { fundingApi } from '@/lib/api/funding'
import { mentorshipsApi } from '@/lib/api/mentorships'

export const chapterKeys = {
    all: ['chapters'] as const,
    events: (chapterId: string) => [...chapterKeys.all, 'events', chapterId] as const,
    funding: (chapterId: string) => [...chapterKeys.all, 'funding', chapterId] as const,
    mentorships: (chapterId: string) => [...chapterKeys.all, 'mentorships', chapterId] as const,
}

export function useChapterEvents(chapterId: string) {
    return useQuery({
        queryKey: chapterKeys.events(chapterId),
        queryFn: () => eventsApi.getEvents({ chapterId, status: 'PUBLISHED' }),
        enabled: !!chapterId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useChapterFunding(chapterId: string) {
    return useQuery({
        queryKey: chapterKeys.funding(chapterId),
        queryFn: () => fundingApi.getFundingOpportunities({ chapterId }),
        enabled: !!chapterId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export function useChapterMentorships(chapterId: string) {
    return useQuery({
        queryKey: chapterKeys.mentorships(chapterId),
        queryFn: () => mentorshipsApi.getMentorships({ chapterId }),
        enabled: !!chapterId,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}
