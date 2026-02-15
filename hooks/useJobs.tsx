import { jobsApi } from "@/lib/api/jobs";
import { JobFilters } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useJobs(filters?:JobFilters, page?:number, limit?:number) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["jobs", filters, page, limit],
    queryFn: () => jobsApi.getJobs(filters, page, limit),
        staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { data, isLoading, isError };
}
