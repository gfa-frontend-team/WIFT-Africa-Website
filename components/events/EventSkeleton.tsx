import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function EventCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <Skeleton className="h-48 w-full rounded-t-lg" />
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-6 w-full" />
      </CardHeader>
      <CardContent className="flex-grow space-y-2 pb-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter className="pt-2">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )
}

export function EventsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  )
}
