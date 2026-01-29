import { FundingOpportunity } from '@/types'
import { Calendar, DollarSign, ExternalLink, Globe, FileText, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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

    const formattedDeadline = new Date(opportunity.deadline) < new Date()
        ? { text: format(new Date(opportunity.deadline), 'MMM d, yyyy'), className: "text-destructive font-medium" }
        : { text: format(new Date(opportunity.deadline), 'MMM d, yyyy'), className: "" }

    return (
        <Dialog>
            <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow h-full group">
                <DialogTrigger asChild>
                    <div className="flex-1 p-6 pb-2 cursor-pointer text-left">
                        {/* Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <Badge variant="secondary" className="mb-2">
                                    {opportunity.fundingType}
                                </Badge>
                                <h3 className="text-lg font-bold text-foreground line-clamp-2 md:line-clamp-2 group-hover:text-primary transition-colors">
                                    {opportunity.name}
                                </h3>
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
                                <span className={formattedDeadline.className}>
                                    {formattedDeadline.text}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-2">
                            {opportunity.description}
                        </p>
                        <p className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                            Read Details <Info className="w-3 h-3" />
                        </p>
                    </div>
                </DialogTrigger>

                {/* Footer Action - Outside Trigger to separate clicks */}
                <div className="p-6 pt-2 mt-auto">
                    <Button asChild className="w-full" variant={isDirect ? "default" : "outline"}>
                        <a
                            href={opportunity.applicationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {isDirect ? "Apply Now" : "Visit Website"}
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </Button>
                </div>

                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary">
                                {opportunity.fundingType}
                            </Badge>
                            {formattedAmount && (
                                <Badge variant="outline" className="text-primary border-primary">
                                    {formattedAmount}
                                </Badge>
                            )}
                        </div>
                        <DialogTitle className="text-2xl font-bold leading-tight">
                            {opportunity.name}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="py-4 space-y-6">
                        {/* Key Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Deadline:</span>
                                <span className={`text-sm font-medium ${formattedDeadline.className}`}>
                                    {formattedDeadline.text}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-primary" />
                                <span className="text-sm text-muted-foreground">Type:</span>
                                <span className="text-sm font-medium">{opportunity.applicationType}</span>
                            </div>
                        </div>

                        {/* Full Description */}
                        <div className="space-y-2">
                            <h4 className="font-semibold text-foreground flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Description
                            </h4>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {opportunity.description}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button asChild size="lg" className="w-full sm:w-auto" variant={isDirect ? "default" : "default"}>
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
                    </div>
                </DialogContent>
            </div>
        </Dialog>
    )
}
