import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { profilesApi } from "@/lib/api/profiles";
import { analyticsApi } from "@/lib/api/analytics";
import { useAuth } from "@/lib/hooks/useAuth";
import { API_BASE_URL } from "../env";

export function useProfileAnalytics() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<"30days" | "90days">("90days");

  // Profile Views Query
  const {
    data: profileViews,
    isLoading: isLoadingViews,
    isError: isErrorViews,
  } = useQuery({
    queryKey: ["profile-views", user?.id, timeframe],
    queryFn: () =>
      profilesApi.getProfileViews(user!.id, timeframe === "30days"),
    enabled: !!user?.id,
  });

  // Post Stats Query (Summary)
  const {
    data: postStats,
    isLoading: isLoadingStats,
    isError: isErrorStats,
  } = useQuery({
    queryKey: ["post-stats-summary", user?.id],
    queryFn: () => analyticsApi.getPostsSummary(),
    enabled: !!user?.id,
  });

  return {
    timeframe,
    setTimeframe,
    profileViews,
    postStats,
    isLoading: isLoadingViews || isLoadingStats,
    isError: isErrorViews || isErrorStats,
  };
}

export const useRecordProfileView = () => {
  
  return useMutation({
    mutationFn: recordView,
  });
};

export const useProfileViewCount = (
  profileOwnerId: string | undefined ,
  lastMonth = false,
) => {

  console.log(profileOwnerId,'lol')
  return useQuery({
    queryKey: ["profileViewCount", profileOwnerId, lastMonth],
    queryFn: () => getViewCount(profileOwnerId!,lastMonth),
    enabled: !!profileOwnerId,
  });
};

async function recordView(profileOwnerId: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/profiles/views/${profileOwnerId}`,
      {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to record profile view");

    const data = await res.json();
    return data
  } catch (error) {
    console.error("Record view error:", error);
    throw error; // let TanStack handle it
  }
}


async function getViewCount(
  profileOwnerId: string,
  lastMonth = false
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/profiles/views/${profileOwnerId}?lastMonth=${lastMonth}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch profile view count");

    const data = await res.json();

    return data 
  } catch (error) {
    console.error("Get view count error:", error);
    throw error;
  }
}
