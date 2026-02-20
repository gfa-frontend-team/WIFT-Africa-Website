// components/NotificationBell.tsx
"use client";

import { useNotifications } from "@/lib/hooks/useNotifications";
import { Bell } from "lucide-react";
import Link from "next/link";

export const NotificationBell = () => {
  const { useUnreadCount } = useNotifications();
  const { data } = useUnreadCount();
  const unreadCount = data?.count || 0;

  return (
    <Link href="/notifications" className="relative">
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-medium text-white animate-pulse">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Link>
  );
};