'use client'

import { useEffect, useState } from 'react'
import { useMessageStore } from '@/lib/stores/messageStore'
import ConversationList from '@/components/messages/ConversationList'
import MessageThread from '@/components/messages/MessageThread'
import MessageComposer from '@/components/messages/MessageComposer'
import { useSearchParams } from 'next/navigation'
import { profilesApi } from '@/lib/api/profiles'

export default function MessagesPage() {
  const { 
    conversations, 
    activeConversation, 
    messages,
    isLoading,
    fetchConversations,
    selectConversation,
    sendMessage
  } = useMessageStore()
  
  const searchParams = useSearchParams()
  const userIdToMessage = searchParams.get('userId')
  
  const [isMobileView, setIsMobileView] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)

  // Initial fetch
  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  // Handle auto-selection from URL or just select first if desktop
  // Modified to handle generic userId param for new conversations
  useEffect(() => {
    const initSelection = async () => {
        if (userIdToMessage) {
            // Check if we already have a conversation with this user
            const existing = conversations.find(c => 
                c.type === 'DIRECT' && c.otherParticipant?.id === userIdToMessage
            )
            
            if (existing) {
                selectConversation(existing.id)
            } else {
                // Fetch user details to start new conversation
                try {
                    const response = await profilesApi.getPublicProfile(userIdToMessage)
                    if (response.profile) {
                         const user = {
                             id: response.profile.id || response.profile._id,
                             firstName: response.profile.firstName,
                             lastName: response.profile.lastName,
                             profilePhoto: response.profile.profilePhoto,
                             username: response.profile.username,
                             accountType: 'MEMBER'
                         }
                         // @ts-ignore
                         useMessageStore.getState().startDirectConversation(user)
                    }
                } catch (err) {
                    console.error("Failed to load user for new conversation", err)
                }
            }
        } else if (!activeConversation && conversations.length > 0 && !isMobileView) {
           selectConversation(conversations[0].id)
        }
    }
    
    // Only run if we aren't already selecting/loading to avoid loops, 
    // but conversations dependency handles updates.
    if (!isLoading) {
        initSelection()
    }
  }, [conversations, activeConversation, isMobileView, selectConversation, userIdToMessage, isLoading])

  // Helper handling
  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId)
    if (isMobileView) {
      setShowConversationList(false)
    }
  }

  const handleBackToList = () => {
    setShowConversationList(true)
  }

  const activeMessages = activeConversation 
    ? messages[activeConversation.id] || []
    : []

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        <div className="flex h-[calc(100vh-200px)] border border-border rounded-lg overflow-hidden bg-card shadow-sm">
          {/* Conversation List - Left Side */}
          {(!isMobileView || showConversationList) && (
            <div className={`${
              isMobileView ? 'w-full' : 'w-1/3 min-w-[300px]'
            } border-r border-border flex flex-col`}>
              <div className="p-4 border-b border-border bg-muted/30">
                <input 
                  type="text" 
                  placeholder="Search messages..." 
                  className="w-full bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <ConversationList
                conversations={conversations}
                activeConversationId={activeConversation?.id}
                onSelectConversation={handleSelectConversation}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Message Thread - Right Side */}
          {(!isMobileView || !showConversationList) && (
            <div className={`${
              isMobileView ? 'w-full' : 'w-2/3'
            } flex flex-col bg-background/50`}>
              {activeConversation ? (
                <>
                  <MessageThread
                    conversation={activeConversation}
                    messages={activeMessages}
                    onBack={isMobileView ? handleBackToList : undefined}
                  />
                  <MessageComposer conversationId={activeConversation.id} />
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
                      Select a conversation from the list to start chatting or connect with other members.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
