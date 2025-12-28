import { CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface AvailabilityBannerProps {
  isAvailable?: boolean
  message?: string
  status?: string // 'AVAILABLE' | 'BUSY' | 'NOT_LOOKING'
  isOwner?: boolean
}

export default function AvailabilityBanner({ 
  isAvailable, 
  message, 
  status,
  isOwner 
}: AvailabilityBannerProps) {
  
  // Resolve unified status
  const finalStatus = status || (isAvailable ? 'AVAILABLE' : 'BUSY')
  
  if (finalStatus === 'NOT_LOOKING' && !isOwner) return null

  const config = {
    AVAILABLE: {
      color: 'bg-green-50 border-green-200 text-green-800',
      icon: CheckCircle,
      label: 'Available for Work',
      defaultMessage: 'I am currently open to new opportunities and collaborations.'
    },
    BUSY: {
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: AlertCircle,
      label: 'Currently Busy',
      defaultMessage: 'I am currently fully booked with projects.'
    },
    NOT_LOOKING: {
      color: 'bg-gray-50 border-gray-200 text-gray-800',
      icon: XCircle,
      label: 'Not Looking',
      defaultMessage: 'I am not looking for new opportunities at this time.'
    }
  }

  const { color, icon: Icon, label, defaultMessage } = config[finalStatus as keyof typeof config] || config.AVAILABLE

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-3 ${color} shadow-sm`}>
      <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-sm">{label}</h3>
        <p className="text-sm opacity-90 mt-1">
          {message || defaultMessage}
        </p>
      </div>
    </div>
  )
}
