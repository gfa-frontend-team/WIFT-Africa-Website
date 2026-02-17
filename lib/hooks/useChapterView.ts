import { useMutation, useQuery } from "@tanstack/react-query";
import { API_BASE_URL } from "../env";

export const useRecordChapterView = () => {
  
  return useMutation({
    mutationFn: recordView,
  });
};

export const useChapterViewCount = (
  chapterId: string | undefined ,
  lastMonth = false,
) => {

  return useQuery({
    queryKey: ["chapterView", chapterId, lastMonth],
    queryFn: () => getViewCount(chapterId!,lastMonth),
    enabled: !!chapterId,
  });
};

async function recordView(chapterId: string) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/chapters/${chapterId}/record-view`,
      {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to record chapter view");

    const data = await res.json();
    return data
  } catch (error) {
    console.error("Record view error:", error);
    throw error; // let TanStack handle it
  }
}


async function getViewCount(
  chapterId: string,
  lastMonth = false
) {
  try {
    const res = await fetch(
      `${API_BASE_URL}/chapters/${chapterId}/view-count?lastMonth=${lastMonth}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch chapter view count");

    const data = await res.json();

    return data 
  } catch (error) {
    console.error("Get view count error:", error);
    throw error;
  }
}
