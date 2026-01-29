import { Mentorship, MentorshipFormat } from '@/types'
import { Video, MapPin, Users, Clock, Calendar } from 'lucide-react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface MentorshipCardProps {
    mentorship: Mentorship
}

export function MentorshipCard({ mentorship }: MentorshipCardProps) {
    const isVirtual = mentorship.mentorshipFormat === MentorshipFormat.VIRTUAL
    const isPhysical = mentorship.mentorshipFormat === MentorshipFormat.PHYSICAL

    return (
        <div className="bg-card border border-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="p-6 flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-foreground line-clamp-1">{mentorship.mentorName}</h3>
                        <p className="text-sm text-primary font-medium">{mentorship.mentorRole}</p>
                    </div>
                    <Badge variant={isVirtual ? "secondary" : "outline"} className="ml-2 shrink-0">
                        {isVirtual ? <Video className="w-3 h-3 mr-1" /> : <MapPin className="w-3 h-3 mr-1" />}
                        {mentorship.mentorshipFormat}
                    </Badge>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="truncate">{mentorship.duration}</span>
                    </div>
                    <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="truncate">{mentorship.availability}</span>
                    </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {mentorship.description}
                </p>

                {/* Expertise Tags */}
                <div className="flex flex-wrap gap-1 mb-6">
                    {mentorship.areasOfExpertise.slice(0, 3).map((area) => (
                        <span key={area} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                            {area}
                        </span>
                    ))}
                    {mentorship.areasOfExpertise.length > 3 && (
                        <span className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                            +{mentorship.areasOfExpertise.length - 3}
                        </span>
                    )}
                </div>

                {/* Action */}
                <Button asChild className="w-full mt-auto">
                    <Link href={`/opportunities/mentorship/${mentorship.id || mentorship._id}`}>
                        View Details
                    </Link>
                </Button>
            </div>
        </div>
    )
}
