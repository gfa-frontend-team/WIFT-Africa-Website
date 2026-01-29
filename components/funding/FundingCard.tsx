import { FundingOpportunity } from '@/types'
import { Calendar, DollarSign, ExternalLink, Globe, FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface FundingCardProps {
    opportunity: FundingOpportunity
}

export function FundingCard({ opportunity }: FundingCardProps) {
    const isDirect = opportunity.applicationType === 'Direct'

    // Format amount if available
    const formattedAmount = opportunity.amount
        ? `${opportunity.currency || 'USD'} ${opportunity.amount}`
        : null

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full">
            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <Badge variant="secondary" className="mb-2">
                            {opportunity.fundingType}
                        </Badge>
                        <h3 className="text-lg font-bold text-foreground line-clamp-2">{opportunity.name}</h3>
                    </div>
                    <div className="shrink-0 bg-primary/10 p-2 rounded-full hidden sm:flex">
                        <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-4 text-sm text-muted-foreground">
                    {formattedAmount && (
                        <div className="flex items-center text-foreground font-medium">
                            <span className="w-20 shrink-0">Amount:</span>
                            <span>{formattedAmount}</span>
                        </div>
                    )}

                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span className="w-20 shrink-0">Deadline:</span>
                        <span className={new Date(opportunity.deadline) < new Date() ? "text-destructive font-medium" : ""}>
                            {format(new Date(opportunity.deadline), 'MMM d, yyyy')}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {opportunity.description}
                </p>

                {/* Action */}
                <Button asChild className="w-full mt-auto" variant={isDirect ? "default" : "outline"}>
                    <a
                        href={opportunity.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                    >
                        {isDirect ? "Apply Now" : "Visit Website"}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
            </div>
        </div>
    )
}
