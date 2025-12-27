'use client'

import { Conversation } from '@/lib/api/messages'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface ConversationListProps {
  conversations: Conversation[]
  activeConversationId?: string
  onSelectConversation: (id: string) => void
  isLoading: boolean
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelectConversation,
  isLoading
}: ConversationListProps) {
  if (isLoading && conversations.length === 0) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 animate-pulse">
            <div className="w-12 h-12 bg-muted rounded-full" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-muted rounded w-2/3" />
              <div className="h-3 bg-muted rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>No conversations yet</p>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto divide-y divide-border/50">
      {conversations.map((conversation) => {
        const otherUser = conversation.otherParticipant
        const isSelected = conversation.id === activeConversationId
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 cursor-pointer hover:bg-muted/50 transition-all duration-200 border-l-4 ${
              isSelected 
                ? 'bg-primary/5 border-primary' 
                : 'border-transparent'
            }`}
          >
            <div className="flex gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted ring-2 ring-background ring-offset-2 ring-offset-muted/10 shadow-sm relative">
                  {otherUser?.profilePhoto ? (
                    <Image
                      src={otherUser.profilePhoto}
                      alt={otherUser.firstName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                      {otherUser?.firstName?.[0]}
                    </div>
                  )}
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-background shadow-sm">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-semibold truncate ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {conversation.type === 'DIRECT' 
                      ? `${otherUser?.firstName} ${otherUser?.lastName}`
                      : conversation.title}
                  </h4>
                  {conversation.lastMessage && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
                       {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className={`text-xs truncate leading-tight ${
                  conversation.unreadCount > 0 ? 'text-foreground font-semibold' : 'text-muted-foreground'
                }`}>
                  {conversation.lastMessage?.isMine && <span className="text-primary/70 font-medium">You: </span>}
                  {conversation.lastMessage?.content || 'No messages yet'}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
