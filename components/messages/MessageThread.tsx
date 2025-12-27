'use client'

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
            className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full text-foreground"
            title="Go back"
          >
            ←
          </button>
        )}
        
        <div className="w-10 h-10 rounded-full overflow-hidden bg-muted relative flex-shrink-0">
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
        
        <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">
            {conversation.type === 'DIRECT' 
                ? `${otherUser?.firstName} ${otherUser?.lastName}`
                : conversation.title}
            </h3>
            {conversation.type === 'DIRECT' && (
            <p className="text-[10px] text-muted-foreground">@{otherUser?.username}</p>
            )}
        </div>

        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -mr-2 hover:bg-muted rounded-full text-muted-foreground transition-colors"
            title="Close conversation"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => {
          const isMine = message.isMine
          const showSenderInfo = !isMine && (index === 0 || messages[index - 1].sender.id !== message.sender.id)
          
          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              {/* Other User Avatar */}
              {!isMine && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-muted flex-shrink-0 mb-1">
                  {message.sender?.profilePhoto ? (
                    <Image
                      src={message.sender.profilePhoto}
                      alt={message.sender.firstName}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary text-xs font-bold">
                      {message.sender?.firstName?.[0]}
                    </div>
                  )}
                </div>
              )}

              <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                {/* Sender Name for non-mine messages (only if group or first in sequence) */}
                {showSenderInfo && (
                  <span className="text-[10px] font-semibold text-muted-foreground ml-1 mb-1">
                    {message.sender.firstName} {message.sender.lastName}
                  </span>
                )}
                
                <div className={`rounded-2xl px-4 py-2.5 shadow-sm ${
                  isMine 
                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                    : 'bg-card border border-border text-foreground rounded-bl-none'
                }`}>
                  <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </p>
                  
                  <div className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 opacity-70 ${
                    isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {format(new Date(message.createdAt), 'h:mm a')}
                    {isMine && (
                       <span className="ml-1 font-medium">
                         {message.isReadByMe ? 'Read' : 'Sent'}
                       </span>
                    )}
                  </div>
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
