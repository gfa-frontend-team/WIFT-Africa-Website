import { Message, Conversation } from '@/lib/api/messages'
import Image from 'next/image'
import { format } from 'date-fns'
import { useRef, useEffect } from 'react'

interface MessageThreadProps {
  conversation: Conversation
  messages: Message[]
  onBack?: () => void
}

export default function MessageThread({ conversation, messages, onBack }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const otherUser = conversation.otherParticipant

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-background/50">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        {onBack && (
          <button 
            onClick={onBack}
            className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full"
          >
            ←
          </button>
        )}
        
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted relative">
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
        
        <div>
            <h3 className="font-semibold text-foreground">
            {conversation.type === 'DIRECT' 
                ? `${otherUser?.firstName} ${otherUser?.lastName}`
                : conversation.title}
            </h3>
            {conversation.type === 'DIRECT' && (
            <p className="text-xs text-muted-foreground">@{otherUser?.username}</p>
            )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isMine = message.isMine
          
          return (
            <div
              key={message.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                isMine 
                  ? 'bg-primary text-primary-foreground rounded-br-none' 
                  : 'bg-muted text-foreground rounded-bl-none'
              }`}>
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <div className={`text-xs mt-1 opacity-70 ${
                  isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'
                }`}>
                  {format(new Date(message.createdAt), 'h:mm a')}
                  {isMine && (
                     <span className="ml-1">
                       {message.isReadByMe ? '✓✓' : '✓'}
                     </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
