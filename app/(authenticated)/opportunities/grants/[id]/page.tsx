// app/funding/[id]/page.tsx (or wherever your pages are located)

'use client'

import { Calendar, DollarSign, ExternalLink, FileText, Globe, MapPin, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { fundingApi } from '@/lib/api/funding'
import { useQuery } from '@tanstack/react-query'
import { FundingDetailResponse } from '@/types'
import { useParams } from 'next/navigation'

interface FundingDetailsPageProps {
    params: {
        id: string
    }
}

export default function FundingDetailsPage() {

     const params = useParams()
       const id = params.id as string
    const { data: response, isLoading, isError, error } = useQuery<FundingDetailResponse>({
        queryKey: ['funding-opportunity', params.id],
        queryFn: () => fundingApi.getFundingOpportunity(id)
    })

    console.log(params.id,params,"param");
    

    // Extract the opportunity from the response
    const opportunity = response?.data

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading funding opportunity...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (isError || !opportunity) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="bg-destructive/10 text-destructive rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">!</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Failed to Load</h2>
                    <p className="text-muted-foreground mb-6">
                        {error instanceof Error 
                            ? error.message 
                            : "We couldn't load the funding opportunity. Please try again."}
                    </p>
                    <Link 
                        href="/funding" 
                        className="inline-flex items-center text-primary hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Funding Opportunities
                    </Link>
                </div>
            </div>
        )
    }

    const isDirect = opportunity.applicationType === 'Direct'

    // Safely format amount with fallback
    const formattedAmount = opportunity.amount && opportunity.currency
        ? `${opportunity.currency} ${opportunity.amount}`
        : opportunity.amount
        ? `USD ${opportunity.amount}`
        : null

    // Safely handle deadline with fallback
    const deadlineDate = opportunity.deadline ? new Date(opportunity.deadline) : new Date()
    const isDeadlinePassed = opportunity.deadline ? deadlineDate < new Date() : false
    const formattedDeadline = opportunity.deadline 
        ? format(deadlineDate, 'MMMM d, yyyy')
        : 'No deadline specified'
    const deadlineClass = isDeadlinePassed ? "text-destructive" : ""

    // Use _id or id based on what's available
    const opportunityId = opportunity._id || opportunity.id

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-5xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link 
                    href="/opportunities" 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Funding Opportunities
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge variant="secondary" className="text-sm">
                            {opportunity.fundingType || 'Funding'}
                        </Badge>
                        {formattedAmount && (
                            <Badge variant="outline" className="text-primary border-primary">
                                {formattedAmount}
                            </Badge>
                        )}
                        <Badge variant={isDirect ? "default" : "outline"}>
                            {opportunity.applicationType || 'Redirect'}
                        </Badge>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        {opportunity.name}
                    </h1>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        {opportunity.deadline && (
                            <div className="flex items-center gap-2">
                                <Calendar className={`w-4 h-4 ${isDeadlinePassed ? 'text-destructive' : 'text-primary'}`} />
                                <span>Deadline: <span className={deadlineClass}>{formattedDeadline}</span></span>
                            </div>
                        )}
                        {opportunity.region && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Region: {opportunity.region}</span>
                            </div>
                        )}
                        {opportunity.role && (
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary" />
                                <span>Role: {opportunity.role}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Description */}
                        {opportunity.description && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Description
                                </h2>
                                <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
                                    {opportunity.description}
                                </div>
                            </section>
                        )}

                        {/* Eligibility Criteria */}
                        {opportunity.eligibility && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold">Eligibility</h2>
                                <div className="text-muted-foreground whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
                                    {opportunity.eligibility}
                                </div>
                            </section>
                        )}

                        {/* Additional Criteria */}
                        {opportunity.criteria && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold">Selection Criteria</h2>
                                <div className="text-muted-foreground whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
                                    {opportunity.criteria}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Application Card */}
                        <div className="bg-muted/30 p-6 rounded-lg border">
                            <h3 className="font-semibold mb-4">Application</h3>
                            
                            {opportunity.applicationLink ? (
                                <Button 
                                    asChild 
                                    size="lg" 
                                    className="w-full mb-4"
                                    variant={isDirect ? "default" : "outline"}
                                >
                                    <a
                                        href={opportunity.applicationLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2"
                                    >
                                        {isDirect ? "Start Application" : "Visit Official Website"}
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </Button>
                            ) : (
                                <p className="text-sm text-muted-foreground mb-4">
                                    No application link provided
                                </p>
                            )}

                            <p className="text-xs text-muted-foreground">
                                {isDirect 
                                    ? "You'll be redirected to the application form"
                                    : "Visit the official website for application details"
                                }
                            </p>
                        </div>

                        {/* Key Information Card */}
                        <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                            <h3 className="font-semibold">Key Information</h3>
                            
                            <div className="space-y-3 text-sm">
                                {opportunity.status && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant={opportunity.status === 'Open' ? 'default' : 'secondary'}>
                                            {opportunity.status}
                                        </Badge>
                                    </div>
                                )}
                                
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Funding Type:</span>
                                    <span className="font-medium">{opportunity.fundingType || 'Not specified'}</span>
                                </div>
                                
                                {opportunity.region && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Region:</span>
                                        <span className="font-medium">{opportunity.region}</span>
                                    </div>
                                )}
                                
                                {opportunity.role && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Role:</span>
                                        <span className="font-medium">{opportunity.role}</span>
                                    </div>
                                )}

                                {opportunity.chapterId && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Chapter ID:</span>
                                        <span className="font-medium truncate ">{opportunity.chapterId}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Created:</span>
                                    <span className="font-medium">
                                        {opportunity.createdAt 
                                            ? format(new Date(opportunity.createdAt), 'MMM d, yyyy')
                                            : 'Unknown'
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}