// ProfileContext.tsx
"use client"
import { useAuth } from "@/lib/hooks/useAuth";
import { useProfileViewCount } from "@/lib/hooks/useProfileAnalytics";
import { createContext,  ReactNode } from "react";
import { useContext } from "react";

const ProfileContext = createContext({
  viewCount: 0,
  isReady: false,
  userChapterId: undefined as string | undefined,
});

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, isLoading: authLoading,isAuthenticated } = useAuth();

  // We fetch the data HERE, at the top level
  const { data: viewCount, isLoading: dataLoading } = useProfileViewCount(
    user?._id,
    true,
  );

  const value = {
    viewCount: viewCount ?? 0,
    isReady: !authLoading && !!user?._id,
    userChapterId: user?.chapterId, // Useful for that "Your Chapter" badge!
    isAuthenticated
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export function useProfileCountContext() {
  const context = useContext(ProfileContext);

  return context;
}
