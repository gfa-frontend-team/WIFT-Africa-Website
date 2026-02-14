import { useQuery } from '@tanstack/react-query'
import { applicationApi } from '@/lib/api/application'

export const useMyApplications = (page = 1, limit = 20, status?: string) => {
  return useQuery({
    queryKey: ['my-applications', page, limit, status],
    queryFn: () => applicationApi.getMyApplications(page, limit, status),
    // placeholderData: keepPreviousData, // specific import needed for v5, commenting out for now to fix build

  })
}

export const useApplication = (applicationId: string) => {
  return useQuery({
    queryKey: ['application', applicationId],
    queryFn: () => applicationApi.getApplication(applicationId),
    enabled: !!applicationId,
  })
}
