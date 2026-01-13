"use client";

import { useEffect, useState, useMemo } from "react";
import { useMessages } from "@/lib/hooks/useMessages";
import ConversationList from "@/components/messages/ConversationList";
import MessageThread from "@/components/messages/MessageThread";
import MessageComposer from "@/components/messages/MessageComposer";
import { useSearchParams, useRouter } from "next/navigation";
import { profilesApi } from "@/lib/api/profiles";
import { getSocket } from "@/lib/socket";
import { useUser } from "@/lib/hooks/useAuthQuery";

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userIdToMessage = searchParams.get("userId");
  const conversationIdParam = searchParams.get("id");

  const { useConversations, useMessageThread, markAsRead } = useMessages();

  const { data: convData, isLoading: isConvsLoading } = useConversations();
  const conversations = useMemo(
    () => convData?.conversations || [],
    [convData]
  );

  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(conversationIdParam);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);
  const [tempUser, setTempUser] = useState<any>(null);
  const [initialSelectDone, setInitialSelectDone] = useState(false);

  // Handle mobile view detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Handle auto-selection and fetching temp user
  useEffect(() => {
    const handleInitialState = async () => {
      // If we are in the process of closing (activeId is null and URL still has params),
      // or if we've already done the initial load and there are no NEW specific params to handle, skip.
      if (initialSelectDone && !userIdToMessage && !conversationIdParam) return;

      // Prevent re-selection if we just manually cleared it
      if (
        initialSelectDone &&
        activeConversationId === null &&
        (userIdToMessage || conversationIdParam)
      ) {
        // This means we just called handleBackToList but the URL hasn't cleared yet
        return;
      }

      if (userIdToMessage) {
        const existing = conversations.find(
          (c) =>
            c.type === "DIRECT" && c.otherParticipant?.id === userIdToMessage
        );
        if (existing) {
          if (activeConversationId !== existing.id) {
            setActiveConversationId(existing.id);
          }
          setInitialSelectDone(true);
        } else if (!tempUser) {
          try {
            const response = await profilesApi.getPublicProfile(
              userIdToMessage
            );
            if (response.profile) {
              setTempUser({
                id:
                  response.profile.id ||
                  response.profile._id ||
                  (response.profile as any).userId,
                firstName: response.profile.firstName,
                lastName: response.profile.lastName,
                profilePhoto: response.profile.profilePhoto,
                username: response.profile.username,
              });
              setActiveConversationId(`new_${userIdToMessage}`);
              setInitialSelectDone(true);
            }
          } catch (err) {
            console.error("Failed to load user for new conversation", err);
          }
        }
      } else if (conversationIdParam) {
        if (activeConversationId !== conversationIdParam) {
          setActiveConversationId(conversationIdParam);
        }
        setInitialSelectDone(true);
      } else if (
        !activeConversationId &&
        conversations.length > 0 &&
        !isMobileView &&
        !initialSelectDone
      ) {
        // Only auto-select first conversation if requested (uncomment if desired)
        // setActiveConversationId(conversations[0].id)
        setInitialSelectDone(true);
      } else if (!initialSelectDone) {
        setInitialSelectDone(true);
      }
    };

    if (!isConvsLoading) {
      handleInitialState();
    }
  }, [
    conversations,
    userIdToMessage,
    conversationIdParam,
    isConvsLoading,
    isMobileView,
    activeConversationId,
    tempUser,
    initialSelectDone,
  ]);

  // Sync activeConversationId with URL
  useEffect(() => {
    if (activeConversationId && !activeConversationId.startsWith("new_")) {
      const currentId = searchParams.get("id");
      if (currentId !== activeConversationId) {
        // Handled via router.replace in handleSelectConversation
      }
    }
  }, [activeConversationId, searchParams]);

  const activeConversation = useMemo(() => {
    if (activeConversationId?.startsWith("new_") && tempUser) {
      return {
        id: activeConversationId,
        type: "DIRECT" as const,
        otherParticipant: tempUser,
        unreadCount: 0,
        updatedAt: new Date().toISOString(),
      };
    }
    return conversations.find((c) => c.id === activeConversationId) || null;
  }, [activeConversationId, conversations, tempUser]);

  const { data } = useUser();

  const {
    data: threadData,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useMessageThread(activeConversationId || "", !!activeConversationId);

  // const activeMessages = useMemo(() => {
  //   return threadData?.pages.flatMap(page => page.messages).reverse() || []
  // }, [threadData])

  
  
  const activeMessages = useMemo(() => {
    const messages =
      threadData?.pages.flatMap((page) => page.messages) || [];

      return messages.map((m) => ({
        ...m,
        isMine: m.sender?._id === data?.id, // ← however you store auth user
      }));
    }, [threadData, data]);
    
    // console.log(activeMessages, "messages in thread")
  useEffect(() => {
    if (activeConversationId && !activeConversationId.startsWith("new_")) {
      markAsRead(activeConversationId);
    }
  }, [activeConversationId, markAsRead]);

  useEffect(() => {
    if (!activeConversationId || activeConversationId.startsWith("new_")) {
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {

      return;
    }

    const socket = getSocket(token);
    if (!socket) {

      return;
    }

    socket.emit("conversation:join", activeConversationId);

    return () => {
      socket.emit("conversation:leave", activeConversationId);
    };
  }, [activeConversationId]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    // Update URL without full refresh to sync state
    if (!conversationId.startsWith("new_")) {
      router.replace(`/messages?id=${conversationId}`, { scroll: false });
    }
    if (isMobileView) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => {
    setActiveConversationId(null);
    setTempUser(null);
    setShowConversationList(true);
    router.replace("/messages", { scroll: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        <div className="flex h-[calc(100vh-200px)] border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          {/* Conversation List - Left Side */}
          {(!isMobileView || showConversationList) && (
            <div
              className={`${
                isMobileView ? "w-full" : "w-1/3 min-w-[300px]"
              } border-r border-border flex flex-col`}
            >
              <div className="p-4 border-b border-border bg-muted/30">
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversationId || undefined}
                onSelectConversation={handleSelectConversation}
                isLoading={isConvsLoading}
              />
            </div>
          )}

          {/* Message Thread - Right Side */}
          {(!isMobileView || !showConversationList) && (
            <div
              className={`${
                isMobileView ? "w-full" : "w-2/3"
              } flex flex-col bg-background/50`}
            >
              {activeConversation ? (
                <>
                  <MessageThread
                    conversation={activeConversation as any}
                    messages={activeMessages}
                    onBack={handleBackToList}
                    hasMore={hasNextPage}
                    fetchNextPage={fetchNextPage}
                    isFetchingNextPage={isFetchingNextPage}
                    // If it was a temp conversation, the hook invalidation will fetch the new real conversation
                  />
                  <MessageComposer
                    conversationId={activeConversation.id}
                    receiverId={
                      activeConversation.otherParticipant?.id ||
                      (activeConversation.otherParticipant as any)?._id
                    }
                    onMessageSent={(data) => {
                      const realId = data.conversation.id; // The ID from the backend
                      if (activeConversationId?.startsWith("new_")) {
                        setTempUser(null);
                        setActiveConversationId(realId);
                        router.replace("/messages", { scroll: false });
                      }
                    }}
                  />
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8 text-center bg-muted/10">
                  <div className="max-w-xs">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">💬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      Your Messages
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Select a conversation from the list to start chatting or
                      connect with other members.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
