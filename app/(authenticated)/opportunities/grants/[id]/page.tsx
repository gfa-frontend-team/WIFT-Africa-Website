'use client'

import { Calendar, ExternalLink, FileText, MapPin, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useFundingOpportunity } from '@/lib/hooks/useFunding'
import { useParams } from 'next/navigation'
import { TargetRole } from '@/types'

// Helper function to format role names
function formatRoleName(role: TargetRole): string {
  const roleNames: Record<TargetRole, string> = {
    [TargetRole.PRODUCER]: 'Producer',
    [TargetRole.DIRECTOR]: 'Director',
    [TargetRole.WRITER]: 'Writer',
    [TargetRole.ACTRESS]: 'Actress',
    [TargetRole.CREW]: 'Crew',
    [TargetRole.BUSINESS]: 'Business',
    [TargetRole.ALL]: 'All Roles',
  }
  return roleNames[role] || role
}

export default function FundingDetailsPage() {
    const params = useParams()
    const id = params.id as string
    
    const { data: response, isLoading, isError, error } = useFundingOpportunity(id)

    // Extract the opportunity from the response
    const opportunity = response?.data
    console.log(opportunity,"param");

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
                        href="/opportunities" 
                        className="inline-flex items-center text-primary hover:underline"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Opportunities
                    </Link>
                </div>
            </div>
        )
    }

    const isOpen = opportunity.status === 'Open'
    const isPastDeadline = new Date(opportunity.deadline) < new Date()
    const formattedDeadline = format(new Date(opportunity.deadline), 'MMMM d, yyyy')
    const deadlineClass = isPastDeadline ? "text-destructive" : ""

    return (
        <div className="min-h-screen bg-background">
            <div className="container max-w-5xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link 
                    href="/opportunities" 
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Opportunities
                </Link>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <Badge 
                            variant="secondary" 
                            className={opportunity.fundingType === 'Grant' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                        >
                            {opportunity.fundingType}
                        </Badge>
                        <Badge variant={isOpen ? "default" : "secondary"}>
                            {opportunity.status}
                        </Badge>
                        <Badge variant="outline">
                            {opportunity.applicationType}
                        </Badge>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-foreground mb-4">
                        {opportunity.name}
                    </h1>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Calendar className={`w-4 h-4 ${isPastDeadline ? 'text-destructive' : 'text-primary'}`} />
                            <span>Deadline: <span className={deadlineClass}>{formattedDeadline}</span></span>
                            {isOpen && !isPastDeadline && (
                                <span className="text-xs">
                                    ({formatDistanceToNow(new Date(opportunity.deadline), { addSuffix: true })})
                                </span>
                            )}
                        </div>
                        {opportunity.region && (
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary" />
                                <span>Region: {opportunity.region}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Target Roles Section */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold">Who Can Apply</h2>
                            <div className="flex flex-wrap gap-2">
                                {opportunity.targetRoles.map((role) => (
                                    <Badge 
                                        key={role} 
                                        variant="outline"
                                        className="bg-blue-50 text-blue-700 border-blue-200 text-sm py-1 px-3"
                                    >
                                        {formatRoleName(role)}
                                    </Badge>
                                ))}
                                
                                {opportunity.customRoles && opportunity.customRoles.length > 0 && (
                                    <>
                                        <span className="text-sm text-muted-foreground self-center">Also:</span>
                                        {opportunity.customRoles.map((role, index) => (
                                            <Badge 
                                                key={index} 
                                                variant="outline"
                                                className="bg-purple-50 text-purple-700 border-purple-200 text-sm py-1 px-3"
                                            >
                                                {role}
                                            </Badge>
                                        ))}
                                    </>
                                )}
                            </div>
                        </section>

                        {/* Description */}
                        <section className="space-y-4">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                About This Opportunity
                            </h2>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap bg-muted/30 p-6 rounded-lg">
                                {opportunity.description}
                            </div>
                        </section>

                        {/* Additional Notes */}
                        {opportunity.notes && (
                            <section className="space-y-4">
                                <h2 className="text-xl font-semibold">Additional Information</h2>
                                <div className="text-muted-foreground whitespace-pre-wrap bg-blue-50 border border-blue-200 p-6 rounded-lg">
                                    <span className="text-lg mr-2">ℹ️</span>
                                    {opportunity.notes}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Application Card */}
                        <div className="bg-muted/30 p-6 rounded-lg border sticky top-4">
                            <h3 className="font-semibold mb-4">Application</h3>
                            
                            {isOpen && !isPastDeadline ? (
                                <>
                                    {opportunity.applicationLink ? (
                                        <>
                                            <Button 
                                                asChild 
                                                size="lg" 
                                                className="w-full mb-4"
                                            >
                                                <a
                                                    href={opportunity.applicationLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center gap-2"
                                                >
                                                    {opportunity.applicationType === 'Redirect' ? 'Apply Now' : 'Start Application'}
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            </Button>
                                            <p className="text-xs text-muted-foreground">
                                                {opportunity.applicationType === 'Redirect'
                                                    ? "You'll be redirected to the external application page"
                                                    : "Complete your application through the WIFT platform"
                                                }
                                            </p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No application link provided yet. Check back soon!
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="bg-destructive/10 text-destructive rounded-lg p-4 mb-4">
                                        <h4 className="font-semibold mb-1">This Opportunity is Closed</h4>
                                        <p className="text-sm">
                                            {isPastDeadline
                                                ? 'The application deadline has passed.'
                                                : 'This opportunity is no longer accepting applications.'}
                                        </p>
                                    </div>
                                    <Link href="/opportunities">
                                        <Button variant="outline" className="w-full">
                                            View Other Opportunities
                                        </Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Key Information Card */}
                        <div className="bg-muted/30 p-6 rounded-lg border space-y-4">
                            <h3 className="font-semibold">Key Information</h3>
                            
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Funding Type:</span>
                                    <span className="font-medium">{opportunity.fundingType}</span>
                                </div>
                                
                                {opportunity.region && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Region:</span>
                                        <span className="font-medium">{opportunity.region}</span>
                                    </div>
                                )}

                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Posted:</span>
                                    <span className="font-medium">
                                        {format(new Date(opportunity.createdAt), 'MMM d, yyyy')}
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