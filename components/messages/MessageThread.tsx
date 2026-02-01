import { Message, Conversation, messagesApi } from '@/lib/api/messages'
import Image from 'next/image'
import { format } from 'date-fns'
import { useRef, useEffect, useLayoutEffect, useState } from 'react'
import { Loader2, Trash2, Pencil, Check, X } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { messageKeys, useMessages } from '@/lib/hooks/useMessages'

// Component for individual message item to handle edit state independently
function MessageItem({ message, isMine, showSenderInfo, onDelete }: {
  message: Message,
  isMine: boolean,
  showSenderInfo: boolean,
  onDelete: (id: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(message.content)
  const { editMessage } = useMessages()

  const handleSaveEdit = async () => {
    if (editContent.trim() === message.content) {
      setIsEditing(false)
      return
    }

    // Handle both id formats
    const id = message.id || (message as any)._id

    try {
      await editMessage({ messageId: id, content: editContent })
      setIsEditing(false)
      toast.success('Message updated')
    } catch (error) {
      toast.error('Failed to update message')
    }
  }

  // Check if message is editable (within 15 mins)
  const isEditable = isMine && (new Date().getTime() - new Date(message.createdAt).getTime() < 15 * 60 * 1000)

  return (
    <div className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
      {/* Other User Avatar */}
      {!isMine && (
        <div className="w-8 h-8 rounded-full overflow-hidden bg-muted shrink-0 mb-1">
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

      <div className={`flex flex-col max-w-[75%] ${isMine ? 'items-end' : 'items-start'} group`}>
        {/* Sender Name */}
        {showSenderInfo && (
          <span className="text-[10px] font-semibold text-muted-foreground ml-1 mb-1">
            {message.sender.firstName} {message.sender.lastName}
          </span>
        )}

        <div className={`relative rounded-2xl px-4 py-2.5 shadow-sm ${isMine
          ? 'bg-primary text-primary-foreground rounded-br-none'
          : 'bg-card border border-border text-foreground rounded-bl-none'
          }`}>
          {isEditing ? (
            <div className="flex flex-col gap-2 min-w-[200px]">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="bg-background/20 text-inherit rounded p-1 text-sm focus:outline-none resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex justify-end gap-1">
                <button onClick={() => setIsEditing(false)} className="p-1 hover:bg-black/10 rounded-full" title="Cancel">
                  <X size={14} />
                </button>
                <button onClick={handleSaveEdit} className="p-1 hover:bg-black/10 rounded-full" title="Save">
                  <Check size={14} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          )}

          <div className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 opacity-70 ${isMine ? 'text-primary-foreground/80' : 'text-muted-foreground'
            }`}>
            {format(new Date(message.createdAt), 'h:mm a')}
            {isMine && (
              <span className="ml-1 font-medium">
                {message.isReadByMe ? 'Read' : 'Sent'}
              </span>
            )}
            {/* Show edited label if applicable (assuming backend sends isEdited flag later, current Type might miss it but safe to add logic if prop exists) */}
            {/* @ts-ignore */}
            {message.isEdited && <span className="ml-1 italic">(edited)</span>}
          </div>

          {/* Actions: Edit & Delete */}
          {isMine && !isEditing && (
            <div className="absolute -left-16 top-1/2 -translate-y-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isEditable && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 bg-background border shadow-sm rounded-full text-foreground hover:text-primary"
                  onClick={() => setIsEditing(true)}
                  title="Edit message"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 bg-background border shadow-sm rounded-full text-foreground hover:text-destructive"
                onClick={() => onDelete(message.id || (message as any)._id)}
                title="Delete message"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

interface MessageThreadProps {
  conversation: Conversation
  messages: Message[]
  onBack?: () => void
  hasMore?: boolean
  fetchNextPage?: () => void
  isFetchingNextPage?: boolean
}

export default function MessageThread({
  conversation,
  messages,
  onBack,
  hasMore,
  fetchNextPage,
  isFetchingNextPage
}: MessageThreadProps) {
  const queryClient = useQueryClient()
  const bottomRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Refs for scroll management
  const prevMessagesLength = useRef(messages.length)
  const isInitialLoad = useRef(true)
  const prevScrollHeight = useRef(0)


  const deleteMutation = useMutation({
    mutationFn: (messageId: string) => messagesApi.deleteMessage(messageId),
    onSuccess: () => {
      toast.success('Message deleted')
      queryClient.invalidateQueries({ queryKey: ['message-thread', conversation.id] })
      // Also update conversations list to reflect last message change if needed
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
    },
    onError: () => {
      toast.error('Failed to delete message')
    }
  })

  const handleDelete = (messageId: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      deleteMutation.mutate(messageId)
    }
  }

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
          // Save current scroll height before fetching
          if (containerRef.current) {
            prevScrollHeight.current = containerRef.current.scrollHeight
            fetchNextPage?.()
          }
        }
      },
      { threshold: 0.1 }
    )

    if (topRef.current) {
      observer.observe(topRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isFetchingNextPage, fetchNextPage])

  // Scroll Management
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const currentLen = messages.length
    const startLen = prevMessagesLength.current

    // Case 1: Initial Load -> Scroll to bottom
    if (isInitialLoad.current && currentLen > 0) {
      container.scrollTop = container.scrollHeight
      isInitialLoad.current = false
      prevMessagesLength.current = currentLen
      return
    }

    // Case 2: Updates
    if (currentLen > startLen) {
      // If we fetched previous page (start of list changed)
      // Heuristic: If we were at the top (near 0) and validation passed, restore position
      // Better: Compare first message ID or check if isFetchingNextPage WAS true
      // But since we captured prevScrollHeight in the observer, we can use it.

      if (prevScrollHeight.current > 0) {
        // We were loading history
        const newScrollHeight = container.scrollHeight
        const diff = newScrollHeight - prevScrollHeight.current
        container.scrollTop = diff

        // Reset
        prevScrollHeight.current = 0
      } else {
        // New message at bottom
        // Only auto-scroll if user is near bottom
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100
        if (isNearBottom || messages[messages.length - 1].isMine) {
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    prevMessagesLength.current = currentLen
  }, [messages])

  // Clear initial load state when conversation changes
  useEffect(() => {
    isInitialLoad.current = true
    prevMessagesLength.current = 0
  }, [conversation.id])

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
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth"
      >
        {/* Loading Sentinel */}
        <div ref={topRef} className="h-4 w-full flex items-center justify-center">
          {isFetchingNextPage && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
        </div>

        {messages.map((message, index) => {
          const isMine = message.isMine
          const showSenderInfo = !isMine && (index === 0 || messages[index - 1].sender.id !== message.sender.id)
          const messageId = message.id || (message as any)._id

          return (
            <MessageItem
              key={messageId || index}
              message={message}
              isMine={!!isMine}
              showSenderInfo={showSenderInfo}
              onDelete={() => handleDelete(messageId)}
            />
          )
        })}
        <div ref={bottomRef} className="h-1" />
      </div>
    </div>
  )
}
