"use client";

import { useEffect } from "react";
import { useNotifications } from "@/lib/hooks/useNotifications";
import NotificationList from "@/components/notifications/NotificationList";
import { CheckCheck, Bell, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";
import { useSocket } from "@/lib/socket";

export default function NotificationsPage() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const {
    useNotificationsList,
    useUnreadCount,
    markAllAsRead,
    isMarkingAllRead,
  } = useNotifications();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isListLoading,
  } = useNotificationsList();

  const { data: unreadData } = useUnreadCount();

  // console.log(data,"data")
  const unreadCount = unreadData?.count || 0;

  const socket = useSocket()

  const isConnected = socket?.connected

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  const isLoading = isListLoading;

  // 🔥 Update document title with unread count
  useEffect(() => {
    if (unreadCount > 0) {
      document.title = `(${unreadCount}) Notifications - WIFT Africa`;
    } else {
      document.title = 'Notifications - WIFT Africa';
    }
  }, [unreadCount]);

  // 🔥 Toggle sound preference (save to localStorage)
  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    localStorage.setItem('notificationSound', JSON.stringify(newValue));
  };

  // 🔥 Load sound preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('notificationSound');
    if (saved !== null) {
      setSoundEnabled(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-muted-foreground mt-1">
              You have {unreadCount} unread notification
              {unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* 🔥 Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            title={soundEnabled ? "Sound enabled" : "Sound disabled"}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4" />
            )}
          </button>

          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              disabled={isMarkingAllRead}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors disabled:opacity-50"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* 🔥 Real-time connection status indicator */}
      <div className="mb-4 text-xs text-muted-foreground flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
        <span>{isConnected ? 'Live' : 'Connecting...'}</span>
      </div>

      <NotificationList notifications={notifications} isLoading={isLoading} />

      {hasNextPage && (
        <div className="mt-6 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-muted text-muted-foreground hover:text-foreground rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}