"use client";

import { useState, useRef } from "react";
import { useMessages } from "@/lib/hooks/useMessages";
import { Send, Paperclip, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { sendMessage, isSending } = useMessages();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAttachments((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!content.trim() && attachments.length === 0) || isSending || isUploading || (!conversationId && !receiverId))
      return;

    const resolvedReceiverId = receiverId;

    if (!resolvedReceiverId) {
      console.error("No receiver ID provided for message", {
        conversationId,
        receiverId,
      });
      return;
    }

    try {
      setIsUploading(true);
      const uploadedMedia = [];

      // Upload files if any
      if (attachments.length > 0) {
        // Import dynamically to avoid circular dependencies if any, or just use the import at top
        const { uploadApi } = await import('@/lib/api/upload');

        for (const file of attachments) {
          let mediaItem;

          if (file.type.startsWith('video/')) {
            // Use video upload flow
            const { url, blobName } = await uploadApi.uploadVideo(file);
            mediaItem = {
              type: 'video',
              url: url,
              filename: file.name
            };
          } else {
            // Generic flow (image/doc)
            const response = await uploadApi.uploadFile(file);
            mediaItem = {
              type: response.type, // 'image' or 'document'
              url: response.url,
              filename: response.originalName || file.name
            };
          }
          uploadedMedia.push(mediaItem);
        }
      }

      const response = await sendMessage({
        receiverId: resolvedReceiverId,
        content,
        media: uploadedMedia.length > 0 ? uploadedMedia : undefined,
      });

      setContent("");
      setAttachments([]);
      onMessageSent?.(response);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsUploading(false);
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
      {/* Attachment Previews */}
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto py-2">
          {attachments.map((file, i) => (
            <div key={i} className="relative group shrink-0">
              <div className="w-16 h-16 rounded-lg border border-border bg-muted flex items-center justify-center overflow-hidden">
                {file.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-muted-foreground p-1 text-center break-all">{file.name.slice(0, 10)}...</span>
                )}
              </div>
              <button
                onClick={() => removeAttachment(i)}
                className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSend} className="flex gap-2 items-end">
        <input
          type="file"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          title="Add attachment"
          disabled={isUploading}
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <div className="flex-1 bg-muted rounded-2xl flex items-center px-4 py-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isUploading ? "Uploading attachments..." : "Type a message..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-6 py-1 text-sm md:text-base outline-none disabled:opacity-50"
            rows={1}
            disabled={isUploading}
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
          disabled={(!content.trim() && attachments.length === 0) || isSending || isUploading}
          className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}
