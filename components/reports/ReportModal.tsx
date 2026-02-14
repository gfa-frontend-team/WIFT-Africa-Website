'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { reportsApi } from '@/lib/api/reports'
import { toast } from 'sonner'
import { Loader2, AlertTriangle } from 'lucide-react'
import { ReportReason } from '@/types/reports'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  targetId: string
  targetType: 'POST' | 'COMMENT' | 'USER' | 'JOB' | 'EVENT'
}

export function ReportModal({ isOpen, onClose, targetId, targetType }: ReportModalProps) {
  const [reason, setReason] = useState<ReportReason | ''>('')
  const [description, setDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason) {
      toast.error("Reason required", {
        description: "Please select a reason for this report."
      })
      return
    }

    setIsSubmitting(true)
    try {
      await reportsApi.createReport({
        targetId,
        targetType,
        reason: reason as ReportReason,
        description: description.trim() || undefined
      })
      
      toast.success("Report Submitted", {
        description: "Thank you for helping keep our community safe. We will review this shortly."
      })
      onClose()
      setReason('')
      setDescription('')
    } catch (error) {
      toast.error("Report Failed", {
        description: "Something went wrong. Please try again later."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Report Content
          </DialogTitle>
          <DialogDescription>
            Please tell us why you are reporting this content. Your report is anonymous.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Select 
              value={reason} 
              onValueChange={(val) => setReason(val as ReportReason)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ReportReason.SPAM}>Spam or misleading</SelectItem>
                <SelectItem value={ReportReason.HARASSMENT}>Harassment or bullying</SelectItem>
                <SelectItem value={ReportReason.HATE_SPEECH}>Hate speech</SelectItem>
                <SelectItem value={ReportReason.INAPPROPRIATE_CONTENT}>Inappropriate content</SelectItem>
                <SelectItem value={ReportReason.IMPERSONATION}>Impersonation</SelectItem>
                <SelectItem value={ReportReason.MISINFORMATION}>Misinformation</SelectItem>
                <SelectItem value={ReportReason.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Additional Details <span className="text-gray-400 font-normal">(Optional)</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide any additional context..."
              className="resize-none min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
