'use client'

import { MentorshipForm } from '@/components/mentorship/MentorshipForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Video } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CreateMentorshipPage() {
    const router = useRouter()

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Button
                variant="ghost"
                className="mb-6 pl-0 hover:bg-transparent hover:text-primary"
                onClick={() => router.back()}
            >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Opportunities
            </Button>

            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-primary/10 rounded-full">
                        <Video className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Create Mentorship Offer</h1>
                        <p className="text-muted-foreground">Share your expertise and guide the next generation.</p>
                    </div>
                </div>

                <MentorshipForm />
            </div>
        </div>
    )
}
