import { FundingOpportunity, TargetRole } from '@/types'
import { Calendar, ExternalLink, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { format, formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface FundingCardProps {
    opportunity: FundingOpportunity
}

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

export function FundingCard({ opportunity }: FundingCardProps) {
    const isOpen = opportunity.status === 'Open'
    const isPastDeadline = new Date(opportunity.deadline) < new Date()
    
    const formattedDeadline = isPastDeadline
        ? { text: format(new Date(opportunity.deadline), 'MMM d, yyyy'), className: "text-destructive font-medium" }
        : { text: format(new Date(opportunity.deadline), 'MMM d, yyyy'), className: "" }
    
    const daysUntilDeadline = !isPastDeadline 
        ? formatDistanceToNow(new Date(opportunity.deadline), { addSuffix: true })
        : null

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full group">
            {/* Main Content - Clickable to details page */}
            <Link 
                href={`/opportunities/grants/${opportunity._id}`}
                className="flex-1 p-6 pb-2 text-left hover:no-underline"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge 
                                variant="secondary" 
                                className={opportunity.fundingType === 'Grant' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                            >
                                {opportunity.fundingType}
                            </Badge>
                            <Badge variant={isOpen ? 'default' : 'secondary'}>
                                {opportunity.status}
                            </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {opportunity.name}
                        </h3>
                    </div>
                </div>

                {/* Target Roles */}
                <div className="mb-4">
                    <label className="text-xs font-semibold text-muted-foreground mb-2 block">Target Roles:</label>
                    <div className="flex flex-wrap gap-2">
                        {opportunity.targetRoles.map((role) => (
                            <Badge 
                                key={role} 
                                variant="outline"
                                className="bg-blue-50 text-blue-700 border-blue-200 text-xs"
                            >
                                {formatRoleName(role)}
                            </Badge>
                        ))}
                        
                        {opportunity.customRoles && opportunity.customRoles.length > 0 && (
                            <>
                                {opportunity.customRoles.map((role, index) => (
                                    <Badge 
                                        key={index} 
                                        variant="outline"
                                        className="bg-purple-50 text-purple-700 border-purple-200 text-xs"
                                    >
                                        {role}
                                    </Badge>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {opportunity.description}
                </p>

                {/* Details */}
                <div className="space-y-2 text-sm text-muted-foreground">
                    {opportunity.region && (
                        <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                            <span className="text-foreground">{opportunity.region}</span>
                        </div>
                    )}

                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span className={formattedDeadline.className}>
                            Deadline: {formattedDeadline.text}
                            {isOpen && !isPastDeadline && daysUntilDeadline && (
                                <span className="text-xs ml-1">({daysUntilDeadline})</span>
                            )}
                        </span>
                    </div>
                </div>

                {/* Notes */}
                {opportunity.notes && (
                    <div className="mt-3 text-xs text-muted-foreground bg-muted/30 p-2 rounded">
                        ℹ️ {opportunity.notes}
                    </div>
                )}

                <p className="text-sm text-primary font-medium hover:underline mt-3">
                    View Details →
                </p>
            </Link>

            {/* Footer Action */}
            <div className="p-6 pt-2 mt-auto">
                <Button 
                    asChild 
                    className="w-full" 
                    variant={opportunity.applicationType === 'Redirect' ? "default" : "outline"}
                    disabled={!isOpen || isPastDeadline}
                >
                    <a
                        href={opportunity.applicationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                    >
                        {opportunity.applicationType === 'Redirect' ? 'Apply Now' : 'View Details'}
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </Button>
            </div>
        </div>
    )
}