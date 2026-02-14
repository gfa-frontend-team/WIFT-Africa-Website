'use client'

import { CheckCircle2, ChevronRight, XCircle } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProfileCompleteness as ProfileCompletenessType } from '@/types'

interface ProfileCompletenessProps {
  completeness: ProfileCompletenessType
}

export default function ProfileCompleteness({ completeness }: ProfileCompletenessProps) {
  const { completionPercentage, missingFields, isComplete } = completeness

  if (isComplete) {
    return (
      <Card className="border-green-200/50 bg-green-50/50 dark:bg-green-900/10 dark:border-green-800/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">All set!</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Your profile is 100% complete.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Map missing fields to friendly labels and action URLs
  // This is a simple mapping; specific fields usually go to specific sections effectively via /me/edit
  const getFieldAction = (field: string) => {
    const map: Record<string, { label: string; url: string }> = {
      bio: { label: 'Add a Bio', url: '/me/edit' },
      headline: { label: 'Add a Headline', url: '/me/edit' },
      location: { label: 'Add Location', url: '/me/edit' },
      website: { label: 'Add Website', url: '/me/edit' },
      cvUrl: { label: 'Upload CV', url: '/me/edit' },
      profilePhoto: { label: 'Upload Photo', url: '/me/edit' },
      instagramHandle: { label: 'Add Instagram', url: '/me/edit' },
      twitterHandle: { label: 'Add Twitter', url: '/me/edit' },
      linkedinUrl: { label: 'Add LinkedIn', url: '/me/edit' },
    }
    
    return map[field] || { label: `Add ${field}`, url: '/me/edit' }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Profile Strength</CardTitle>
          <span className="text-sm font-bold text-primary">{completionPercentage}%</span>
        </div>
        <Progress value={completionPercentage} className="h-2" />
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Complete your profile to increase your visibility and credibility.
        </p>
        
        <div className="space-y-3">
          {missingFields.slice(0, 3).map((field) => {
            const action = getFieldAction(field)
            return (
              <div key={field} className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors group">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                  <span className="text-sm font-medium">{action.label}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
                  <Link href={action.url}>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )
          })}
          {missingFields.length > 3 && (
            <p className="text-xs text-center text-muted-foreground pt-1">
              + {missingFields.length - 3} more items to complete
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
