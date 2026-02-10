'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mentorshipsApi } from '@/lib/api/mentorships'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AlertCircle, Calendar, Clock, ArrowRight, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import Link from 'next/link'
import { toast } from 'sonner'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function MyApplicationsPage() {
    const queryClient = useQueryClient()

    const { data: response, isLoading, isError, error } = useQuery({
        queryKey: ['my-applications'],
        queryFn: () => mentorshipsApi.getMyApplications()
    })

    const { mutate: withdraw, isPending: isWithdrawing } = useMutation({
        mutationFn: (applicationId: string) => mentorshipsApi.withdrawApplication(applicationId),
        onSuccess: () => {
            toast.success('Application withdrawn successfully')
            queryClient.invalidateQueries({ queryKey: ['my-applications'] })
        },
        onError: (error) => {
            toast.error(`Failed to withdraw: ${(error as Error).message}`)
        }
    })

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
                <h1 className="text-2xl font-bold mb-6">My Applications</h1>
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-40 bg-muted animate-pulse rounded-xl"></div>
                ))}
            </div>
        )
    }

    if (isError) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-destructive/5 p-8 rounded-lg flex flex-col items-center text-center border border-destructive/20">
                    <AlertCircle className="h-8 w-8 text-destructive mb-3" />
                    <h3 className="text-lg font-semibold mb-2">Failed to load applications</h3>
                    <p className="text-muted-foreground mb-4">
                        {(error as Error).message || "Something went wrong. Please try again."}
                    </p>
                    <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
                </div>
            </div>
        )
    }

    const applications = response?.data || []

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">My Mentorship Applications</h1>
                <Button variant="outline" asChild>
                    <Link href="/opportunities/mentorship">
                        Browse Opportunities
                    </Link>
                </Button>
            </div>

            {applications.length === 0 ? (
                <div className="bg-muted/30 border border-border rounded-xl p-16 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center">
                        <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
                            <Clock className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                        <p className="text-muted-foreground mb-6">
                            You haven&apos;t applied to any mentorships yet. Explore available opportunities to find a mentor.
                        </p>
                        <Button asChild>
                            <Link href="/opportunities/mentorship">
                                Find a Mentor
                            </Link>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {applications.map((application) => {
                        const mentorship = application.mentorshipId
                        if (!mentorship) return null

                        // Determine status color
                        let statusColor = "bg-muted text-muted-foreground"
                        if (application.status === 'Accepted') statusColor = "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        if (application.status === 'Rejected') statusColor = "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        if (application.status === 'Pending') statusColor = "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"

                        return (
                            <div key={application._id} className="bg-card border border-border rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    <div className="space-y-4 flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold mb-1">
                                                    {/* Handle populated mentorship object or just ID if not populated properly */}
                                                    {typeof mentorship === 'object' ? mentorship.mentorName : 'Unknown Mentor'}
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    {typeof mentorship === 'object' ? mentorship.mentorRole : ''}
                                                </p>
                                            </div>
                                            <Badge className={statusColor} variant="outline">
                                                {application.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="h-4 w-4" />
                                                Applied {format(new Date(application.createdAt), 'MMM d, yyyy')}
                                            </div>
                                            {application.updatedAt !== application.createdAt && (
                                                <div className="flex items-center gap-1.5 border-l pl-4">
                                                    <Clock className="h-4 w-4" />
                                                    Updated {format(new Date(application.updatedAt), 'MMM d, yyyy')}
                                                </div>
                                            )}
                                        </div>

                                        {/* Cover Letter Preview (Optional) */}
                                        <div className="bg-muted/30 p-3 rounded-lg text-sm text-foreground/80 line-clamp-2 italic">
                                            &ldquo;{application.message}&rdquo;
                                        </div>
                                    </div>

                                    <div className="flex flex-row md:flex-col gap-3 justify-center md:items-end min-w-[140px] border-t md:border-t-0 md:border-l pt-4 md:pt-0 pl-0 md:pl-6">
                                        <Button asChild variant="default" size="sm" className="w-full">
                                            <Link href={`/opportunities/mentorship/${typeof mentorship === 'object' ? (mentorship._id || mentorship.id) : ''}`}>
                                                View Offer
                                                <ArrowRight className="ml-2 h-3.5 w-3.5" />
                                            </Link>
                                        </Button>

                                        {application.status === 'Pending' && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/5">
                                                        Withdraw
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to withdraw your application? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => withdraw(application._id)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        >
                                                            {isWithdrawing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Withdraw"}
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
