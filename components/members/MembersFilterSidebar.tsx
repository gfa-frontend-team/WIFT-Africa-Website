'use client'

import { useState } from 'react'
import { Check, X } from 'lucide-react'
import { FilterOptions } from '@/lib/api/search'

interface MembersFilterSidebarProps {
  filters?: FilterOptions
  selectedRoles: string[]
  toggleRole: (role: string) => void
  selectedChapter: string | null
  setChapter: (id: string | null) => void
  availability: string | null
  setAvailability: (status: string | null) => void
  className?: string
}

export default function MembersFilterSidebar({
  filters,
  selectedRoles,
  toggleRole,
  selectedChapter,
  setChapter,
  availability,
  setAvailability,
  className
}: MembersFilterSidebarProps) {
  
  const roles = [
    'PRODUCER', 'DIRECTOR', 'WRITER', 'ACTRESS', 'CREW', 'BUSINESS'
  ]

  const availabilityOptions = [
    { value: 'AVAILABLE', label: 'Available for work' },
    { value: 'BUSY', label: 'Busy / On Project' },
    { value: 'NOT_LOOKING', label: 'Not Looking' },
  ]

  return (
    <aside className={`w-full md:w-64 space-y-8 ${className}`}>
        
        {/* Roles Filter */}
        <div>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Role</h3>
            <div className="space-y-2">
                {roles.map(role => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer group">
                        <div 
                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors
                                ${selectedRoles.includes(role) ? 'bg-primary border-primary text-primary-foreground' : 'border-input group-hover:border-primary'}
                            `}
                        >
                            {selectedRoles.includes(role) && <Check size={12} />}
                        </div>
                        <input 
                            type="checkbox" 
                            className="hidden" 
                            checked={selectedRoles.includes(role)}
                            onChange={() => toggleRole(role)}
                        />
                        <span className="text-sm capitalize">{role.toLowerCase()}</span>
                    </label>
                ))}
            </div>
        </div>

        {/* Availability Filter */}
        <div>
             <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Availability</h3>
             <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                    <div 
                         className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                                ${availability === null ? 'border-primary' : 'border-input group-hover:border-primary'}
                        `}
                    >
                        {availability === null && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                    <input 
                        type="radio" 
                        className="hidden"
                        checked={availability === null}
                        onChange={() => setAvailability(null)}
                    />
                    <span className="text-sm">Any status</span>
                </label>

                {availabilityOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer group">
                        <div 
                             className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                                    ${availability === option.value ? 'border-primary' : 'border-input group-hover:border-primary'}
                            `}
                        >
                            {availability === option.value && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                        <input 
                            type="radio" 
                            className="hidden"
                            checked={availability === option.value}
                            onChange={() => setAvailability(option.value)}
                        />
                         <span className="text-sm">{option.label}</span>
                    </label>
                ))}
             </div>
        </div>
        
        {/* Chapters Filter (Mocked or passed via props) */}
         <div>
            <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Chapter</h3>
            <select 
                className="w-full text-sm rounded-md border border-input bg-background px-3 py-2"
                value={selectedChapter || ''}
                onChange={(e) => setChapter(e.target.value || null)}
            >
                <option value="">All Chapters</option>
                {/* 
                   Ideally we map over filters.availableChapters if provided 
                   For now, let's assume some common ones or wait for data integration 
                */}
                <option value="nigeria">WIFT Nigeria</option>
                <option value="kenya">WIFT Kenya</option>
                <option value="cameroon">WIFT Cameroon</option>
                <option value="south-africa">WIFT South Africa</option>
            </select>
        </div>

    </aside>
  )
}
