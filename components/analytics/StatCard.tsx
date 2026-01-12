import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  trend?: {
    value: number
    label: string
    positive: boolean
  }
  icon: LucideIcon
  description?: string
  onClick?: () => void
  active?: boolean
}

export function StatCard({ title, value, trend, icon: Icon, description, onClick, active }: StatCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${active ? 'ring-2 ring-primary border-primary' : ''}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {trend && (
            <div className={`flex items-center text-sm font-medium ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {trend.value}%
            </div>
          )}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-sm text-muted-foreground font-medium">{title}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
