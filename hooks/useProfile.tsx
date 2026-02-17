"use client";
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfileViewCount } from "@/lib/hooks/useProfileAnalytics";
import { createContext, ReactNode, useState, useContext, useMemo } from "react";

// 1. Define a clear Type for the context
interface ProfileContextType {
  viewCount: { count: number; viewers: any[] };
  isReady: boolean;
  userChapterId: string | undefined;
  timeframe: "30days" | "90days";
  setTimeframe: (val: "30days" | "90days") => void;
  user: any;
  isAuthenticated: boolean;
}

// 2. Initial State
const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [timeframe, setTimeframe] = useState<"30days" | "90days" >("90days");

  const { data: viewCount, isLoading: dataLoading } = useProfileViewCount(
    user?.id,
    timeframe === "30days"
  );

  const value = useMemo(() => ({
    viewCount: viewCount ?? { count: 0, viewers: [] },
    isReady: dataLoading,
    userChapterId: user?.chapterId,
    isAuthenticated,
    user,
    timeframe,
    setTimeframe
  }), [viewCount, dataLoading, user, isAuthenticated, timeframe]);

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// 4. Hook with built-in error checking
export function useProfileCountContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileCountContext must be used within a ProfileProvider");
  }
  return context;
}