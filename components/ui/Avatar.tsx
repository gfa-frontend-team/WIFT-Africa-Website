import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
}

export default function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const sizeClass = sizeClasses[size]

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn(
          'rounded-full object-cover bg-muted',
          sizeClass,
          className
        )}
        onError={(e) => {
          // Fallback to initials if image fails to load
          const target = e.target as HTMLImageElement
          target.style.display = 'none'
          const parent = target.parentElement
          if (parent) {
            parent.innerHTML = `
              <div class="${cn('rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium', sizeClass, className)}">
                ${initials}
              </div>
            `
          }
        }}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium',
        sizeClass,
        className
      )}
    >
      {initials}
    </div>
  )
}