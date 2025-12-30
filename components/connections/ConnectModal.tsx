'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { UserPlus, Loader2 } from 'lucide-react'

interface ConnectModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (message?: string) => Promise<void>
  recipientName: string
  isSending: boolean
}

export default function ConnectModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  recipientName, 
  isSending 
}: ConnectModalProps) {
  const [message, setMessage] = useState('')
  const [addNote, setAddNote] = useState(false)

  const handleConfirm = async () => {
    await onConfirm(message || undefined)
    setMessage('')
    setAddNote(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with {recipientName}</DialogTitle>
          <DialogDescription>
            Grow your network by connecting with {recipientName}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {!addNote ? (
            <Button 
              variant="outline" 
              className="w-full justify-start text-muted-foreground"
              onClick={() => setAddNote(true)}
            >
              + Add a note (optional)
            </Button>
          ) : (
            <div className="space-y-2">
              <label htmlFor="note" className="text-sm font-medium">
                Include a personal message (optional)
              </label>
              <Textarea
                id="message"
                placeholder={`Hi ${recipientName}, I'd like to join your network.`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={300}
                className="resize-none h-24"
              />
              <div className="flex justify-end">
                <span className="text-xs text-muted-foreground">
                  {message.length}/300
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="ghost" onClick={onClose} disabled={isSending}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isSending} className="gap-2">
            {isSending && <Loader2 className="h-4 w-4 animate-spin" />}
            {!isSending && <UserPlus className="h-4 w-4" />}
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
