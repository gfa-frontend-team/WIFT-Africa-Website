import { TargetRole } from '@/types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface FundingFiltersProps {
  selectedRole?: TargetRole
  onRoleChange: (role?: TargetRole) => void
}

export function FundingFilters({ selectedRole, onRoleChange }: FundingFiltersProps) {
  const roles = [
    { value: 'all', label: 'All Roles' },
    { value: TargetRole.PRODUCER, label: 'Producer' },
    { value: TargetRole.DIRECTOR, label: 'Director' },
    { value: TargetRole.WRITER, label: 'Writer' },
    { value: TargetRole.ACTRESS, label: 'Actress' },
    { value: TargetRole.CREW, label: 'Crew' },
    { value: TargetRole.BUSINESS, label: 'Business' },
  ]

  return (
    <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-foreground">Filter by Role:</label>
        <Select
          value={selectedRole || 'all'}
          onValueChange={(value) => onRoleChange(value === 'all' ? undefined : value as TargetRole)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
