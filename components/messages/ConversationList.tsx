'use client'

import { Conversation, messagesApi } from '@/lib/api/messages'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import { Archive } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

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
  const queryClient = useQueryClient()
  const currentUser = queryClient.getQueryData<any>(['auth', 'me'])

  const archiveMutation = useMutation({
    mutationFn: (conversationId: string) => messagesApi.archiveConversation(conversationId),
    onSuccess: () => {
      toast.success('Conversation archived')
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: () => {
      toast.error('Failed to archive conversation')
    }
  })

  // User-defined unread logic
  const isMessageUnread = (msg: any) => {
    if (!msg || !currentUser) return false;

    // If I sent it, it's read
    const senderId = msg.sender.id || msg.sender._id;
    const myId = currentUser.id || currentUser._id;
    if (senderId === myId) return false;

    // Broadcast logic: check readBy array
    if (msg.isBroadcast) {
      if (!msg.readBy) return true; // Default unread if no array? Or assume unread? strictly !includes
      return !msg.readBy.includes(myId);
    }

    // Direct logic: check strictly isRead flag
    // If msg.isRead is false, then I haven't read it (assuming I am receiver)
    return msg.isRead === false;
  }

  const handleArchive = (e: React.MouseEvent, conversationId: string) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to archive this conversation?')) {
      archiveMutation.mutate(conversationId)
    }
  }

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

        // Determine unread status using both count and last message check
        // We trust the backend count, OR the last message status for immediate feedback
        const hasUnreadMessages = conversation.unreadCount > 0 || isMessageUnread(conversation.lastMessage)

        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`group p-4 cursor-pointer hover:bg-muted/50 transition-all duration-200 border-l-4 relative ${isSelected
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
                <div className="flex justify-between items-center">
                  <p className={`text-xs truncate leading-tight flex-1 ${hasUnreadMessages ? 'text-foreground font-bold' : 'text-muted-foreground'
                    }`}>
                    {conversation.lastMessage?.isMine && <span className="text-primary/70 font-medium">You: </span>}
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </p>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0"
                    onClick={(e) => handleArchive(e, conversation.id)}
                    title="Archive Conversation"
                  >
                    <Archive className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
