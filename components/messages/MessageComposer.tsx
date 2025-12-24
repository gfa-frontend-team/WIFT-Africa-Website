import { useState } from 'react'
import useMessageStore from '@/lib/stores/messageStore'
import { Send, Image as ImageIcon, Paperclip } from 'lucide-react'

interface MessageComposerProps {
  conversationId: string // Used to get receiver ID if necessary, mostly just for context
}

export default function MessageComposer({ conversationId }: MessageComposerProps) {
  const [content, setContent] = useState('')
  const [isSending, setIsSending] = useState(false)
  const { sendMessage, activeConversation } = useMessageStore()

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!content.trim() || !activeConversation || isSending) return

    const receiverId = activeConversation.otherParticipant?.id
    if (!receiverId) return

    setIsSending(true)
    try {
      await sendMessage(receiverId, content)
      setContent('')
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="p-4 border-t border-border bg-card">
      <form onSubmit={handleSend} className="flex gap-2 items-end">
        <button
          type="button"
          className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          title="Add attachment"
        >
          <Paperclip className="h-5 w-5" />
        </button>
        
        <div className="flex-1 bg-muted rounded-2xl flex items-center px-4 py-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[24px] py-1 text-sm md:text-base outline-none"
            rows={1}
            style={{ height: 'auto', minHeight: '24px' }}
            onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!content.trim() || isSending}
          className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  )
}
