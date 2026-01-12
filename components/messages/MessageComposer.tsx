"use client";

import { useState } from "react";
import { useMessages } from "@/lib/hooks/useMessages";
import { Send, Paperclip } from "lucide-react";

interface MessageComposerProps {
  conversationId?: string;
  receiverId?: string;
  onMessageSent?: (data: any) => void; // Add 'data' here
}

export default function MessageComposer({
  conversationId,
  receiverId,
  onMessageSent,
}: MessageComposerProps) {
  const [content, setContent] = useState("");
  const { sendMessage, isSending } = useMessages();

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || isSending || (!conversationId && !receiverId))
      return;

    // Prefer receiverId if available (direct message), otherwise fall back to conversationId if broadcast/group logic supported later
    // For now the API sendMessage requires receiverId for DM.
    // If conversationId is present but no receiverId, we might need to derive it props or assume this is only for DMs for now.
    // Based on API: sendMessage(receiverId...)

    const resolvedReceiverId = receiverId;

    if (!resolvedReceiverId) {
      console.error("No receiver ID provided for message", {
        conversationId,
        receiverId,
      });
      return;
    }

    try {
      // Inside handleSend:
      const response = await sendMessage({
        receiverId: resolvedReceiverId,
        content,
      });
      setContent("");
      onMessageSent?.(response); // Pass the response back!
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

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
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-6 py-1 text-sm md:text-base outline-none"
            rows={1}
            style={{ height: "auto", minHeight: "24px" }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
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
  );
}
