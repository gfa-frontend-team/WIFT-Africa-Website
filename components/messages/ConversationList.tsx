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
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const otherUser = conversation.otherParticipant
        const isSelected = conversation.id === activeConversationId
        
        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${
              isSelected ? 'bg-muted' : ''
            }`}
          >
            <div className="flex gap-4">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted relative">
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
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-bold">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-foreground truncate max-w-[120px]">
                    {conversation.type === 'DIRECT' 
                      ? `${otherUser?.firstName} ${otherUser?.lastName}`
                      : conversation.title}
                  </h4>
                  {conversation.lastMessage && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                    </span>
                  )}
                </div>
                <p className={`text-sm truncate ${
                  conversation.unreadCount > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {conversation.lastMessage?.isMine && 'You: '}
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
