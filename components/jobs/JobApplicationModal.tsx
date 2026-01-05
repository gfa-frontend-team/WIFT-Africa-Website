'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { jobsApi } from '@/lib/api/jobs'
import { uploadApi } from '@/lib/api/upload'
import { toast } from 'sonner'
import { Loader2, Upload, FileText } from 'lucide-react'
import { useUserStore } from '@/lib/stores/userStore'

interface JobApplicationModalProps {
  isOpen: boolean
  onClose: () => void
  jobId: string
  jobTitle: string
}

export function JobApplicationModal({ isOpen, onClose, jobId, jobTitle }: JobApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('')
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [useStoredCV, setUseStoredCV] = useState(false)
  
  const user = useUserStore((state) => state.currentUser)

  const handleSubmit = async () => {
    if (!coverLetter.trim()) {
      toast.error("Cover letter required", {
        description: "Please write a brief cover letter to introduce yourself."
      })
      return
    }

    if (!useStoredCV && !resumeFile) {
      toast.error("Resume missing", {
        description: "Please upload a resume or use your stored CV."
      })
      return
    }

    setIsSubmitting(true)
    try {
      let resumeUrl = ''

      if (useStoredCV && user?.cvFileUrl) {
         resumeUrl = user.cvFileUrl
      } else if (resumeFile) {
         // Upload file first
         const { url } = await uploadApi.uploadFile(resumeFile, 'cv')
         resumeUrl = url
      } else {
        throw new Error("No resume available")
      }

      await jobsApi.applyForJob(jobId, {
        coverLetter,
        resumeUrl
      })
      
      toast.success("Application Submitted", {
        description: "Good luck! Your application has been sent successfully."
      })
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Application Failed", {
        description: "Something went wrong. Please try again later."
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Apply for {jobTitle}</DialogTitle>
          <DialogDescription>
            Submit your application for this position.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="resume">Resume / CV</Label>
            
            {user?.cvFileName && (
              <div className="flex items-center space-x-2 mb-2 p-3 border rounded-md bg-gray-50">
                <input 
                  type="checkbox" 
                  id="useStored" 
                  checked={useStoredCV}
                  onChange={(e) => {
                    setUseStoredCV(e.target.checked)
                    if (e.target.checked) setResumeFile(null)
                  }}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <Label htmlFor="useStored" className="flex items-center cursor-pointer text-sm font-normal">
                  <FileText className="w-4 h-4 mr-2 text-blue-600" />
                  Use my stored profile CV: <span className="font-semibold ml-1">{user.cvFileName}</span>
                </Label>
              </div>
            )}

            {!useStoredCV && (
              <div className="flex items-center gap-4">
                 <Input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                  className="cursor-pointer"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="coverLetter">Cover Letter</Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're a great fit for this role..."
              className="min-h-[200px]"
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
