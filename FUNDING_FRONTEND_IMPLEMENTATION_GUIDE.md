# Funding Opportunities - Member Frontend Implementation Guide

## Overview

This guide shows how to implement the funding opportunities feature on the member-facing frontend, including how to display multi-role targeting and filter opportunities.

---

## API Response Structure

### GET /api/v1/funding-opportunities

**Response:**
```json
{
  "data": [
    {
      "_id": "6998d8506b5ea6cb1763dbb6",
      "targetRoles": ["PRODUCER", "DIRECTOR"],
      "customRoles": ["Film Festival Organizer"],
      "fundingType": "Grant",
      "name": "African Women in Film Grant 2026",
      "description": "Supporting women filmmakers across Africa",
      "deadline": "2026-12-31T00:00:00.000Z",
      "region": "Africa",
      "applicationType": "Redirect",
      "applicationLink": "https://wift.org/apply/grant-2026",
      "notes": "Priority given to first-time feature filmmakers",
      "chapterId": "69526ddb9b10a7962e73557f",
      "createdBy": "698d6770e83ddf7430e7291c",
      "status": "Open",
      "createdAt": "2026-02-20T21:55:28.660Z",
      "updatedAt": "2026-02-23T02:05:12.352Z"
    }
  ]
}
```

### Key Fields for Frontend

| Field | Type | Description | Display |
|-------|------|-------------|---------|
| `targetRoles` | array | Predefined roles | Show as badges |
| `customRoles` | array | Custom roles | Show as badges (different style) |
| `fundingType` | string | "Grant" or "Fund" | Show as label |
| `name` | string | Opportunity name | Title |
| `description` | string | Full description | Body text |
| `deadline` | date | Application deadline | Format as date, show countdown |
| `region` | string | Geographic region | Show with icon |
| `applicationType` | string | "Redirect" or "Internal" | Determines button behavior |
| `applicationLink` | string | External URL | Used if Redirect type |
| `status` | string | "Open" or "Closed" | Show status badge |

---

## Frontend Implementation

### 1. TypeScript Types

```typescript
// types/funding.ts

export enum TargetRole {
  PRODUCER = "PRODUCER",
  DIRECTOR = "DIRECTOR",
  WRITER = "WRITER",
  ACTRESS = "ACTRESS",
  CREW = "CREW",
  BUSINESS = "BUSINESS",
  ALL = "ALL"
}

export enum FundingType {
  GRANT = "Grant",
  FUND = "Fund"
}

export enum ApplicationType {
  REDIRECT = "Redirect",
  INTERNAL = "Internal"
}

export enum FundingStatus {
  OPEN = "Open",
  CLOSED = "Closed"
}

export interface FundingOpportunity {
  _id: string;
  targetRoles: TargetRole[];
  customRoles?: string[];
  fundingType: FundingType;
  name: string;
  description: string;
  deadline: string;
  region: string;
  applicationType: ApplicationType;
  applicationLink?: string;
  notes?: string;
  chapterId?: string;
  status: FundingStatus;
  createdAt: string;
  updatedAt: string;
}
```

---

### 2. API Client

```typescript
// lib/api/funding.ts

import { FundingOpportunity, TargetRole } from '@/types/funding';

export const fundingApi = {
  // Get all opportunities
  getAll: async (filters?: {
    chapterId?: string;
    targetRole?: TargetRole;
  }): Promise<{ data: FundingOpportunity[] }> => {
    const params = new URLSearchParams();
    if (filters?.chapterId) params.append('chapterId', filters.chapterId);
    if (filters?.targetRole) params.append('targetRole', filters.targetRole);
    
    const response = await fetch(
      `/api/v1/funding-opportunities?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch opportunities');
    return response.json();
  },

  // Get single opportunity
  getById: async (id: string): Promise<{ data: FundingOpportunity }> => {
    const response = await fetch(
      `/api/v1/funding-opportunities/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
        },
      }
    );
    
    if (!response.ok) throw new Error('Failed to fetch opportunity');
    return response.json();
  },
};
```

---

### 3. React Query Hooks

```typescript
// hooks/useFunding.ts

import { useQuery } from '@tanstack/react-query';
import { fundingApi } from '@/lib/api/funding';
import { TargetRole } from '@/types/funding';

export function useFundingOpportunities(filters?: {
  chapterId?: string;
  targetRole?: TargetRole;
}) {
  return useQuery({
    queryKey: ['funding-opportunities', filters],
    queryFn: () => fundingApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useFundingOpportunity(id: string) {
  return useQuery({
    queryKey: ['funding-opportunity', id],
    queryFn: () => fundingApi.getById(id),
    enabled: !!id,
  });
}
```

---

### 4. Display Components

#### A. Opportunity Card Component

```tsx
// components/funding/OpportunityCard.tsx

import { FundingOpportunity } from '@/types/funding';
import { formatDistanceToNow } from 'date-fns';

interface OpportunityCardProps {
  opportunity: FundingOpportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const isOpen = opportunity.status === 'Open';
  const isPastDeadline = new Date(opportunity.deadline) < new Date();
  const daysUntilDeadline = formatDistanceToNow(new Date(opportunity.deadline), {
    addSuffix: true,
  });

  const handleApply = () => {
    if (opportunity.applicationType === 'Redirect' && opportunity.applicationLink) {
      window.open(opportunity.applicationLink, '_blank');
    } else {
      // Navigate to internal application page
      // router.push(`/funding/${opportunity._id}/apply`);
    }
  };

  return (
    <div className="opportunity-card">
      {/* Header */}
      <div className="card-header">
        <div className="title-section">
          <h3>{opportunity.name}</h3>
          <span className={`type-badge ${opportunity.fundingType.toLowerCase()}`}>
            {opportunity.fundingType}
          </span>
        </div>
        
        <div className="status-section">
          <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
            {opportunity.status}
          </span>
        </div>
      </div>

      {/* Target Roles */}
      <div className="roles-section">
        <label>Target Roles:</label>
        <div className="roles-container">
          {opportunity.targetRoles.map((role) => (
            <span key={role} className="role-badge predefined">
              {formatRoleName(role)}
            </span>
          ))}
          
          {opportunity.customRoles && opportunity.customRoles.length > 0 && (
            <>
              {opportunity.customRoles.map((role, index) => (
                <span key={index} className="role-badge custom">
                  {role}
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="description">
        {opportunity.description.length > 150
          ? `${opportunity.description.substring(0, 150)}...`
          : opportunity.description}
      </p>

      {/* Details */}
      <div className="details-section">
        <div className="detail-item">
          <span className="icon">📍</span>
          <span>{opportunity.region}</span>
        </div>
        
        <div className="detail-item">
          <span className="icon">📅</span>
          <span className={isPastDeadline ? 'deadline-passed' : ''}>
            Deadline: {new Date(opportunity.deadline).toLocaleDateString()}
            {isOpen && !isPastDeadline && (
              <span className="countdown"> ({daysUntilDeadline})</span>
            )}
          </span>
        </div>
      </div>

      {/* Notes */}
      {opportunity.notes && (
        <div className="notes-section">
          <span className="icon">ℹ️</span>
          <span>{opportunity.notes}</span>
        </div>
      )}

      {/* Actions */}
      <div className="actions-section">
        <button
          onClick={handleApply}
          disabled={!isOpen || isPastDeadline}
          className="apply-button"
        >
          {opportunity.applicationType === 'Redirect' ? 'Apply Now' : 'View Details'}
        </button>
        
        <button className="save-button">
          Save for Later
        </button>
      </div>
    </div>
  );
}

// Helper function to format role names
function formatRoleName(role: string): string {
  const roleNames: Record<string, string> = {
    PRODUCER: 'Producer',
    DIRECTOR: 'Director',
    WRITER: 'Writer',
    ACTRESS: 'Actress',
    CREW: 'Crew',
    BUSINESS: 'Business',
    ALL: 'All Roles',
  };
  return roleNames[role] || role;
}
```

---

#### B. Filter Component

```tsx
// components/funding/FundingFilters.tsx

import { TargetRole } from '@/types/funding';

interface FundingFiltersProps {
  selectedRole?: TargetRole;
  onRoleChange: (role?: TargetRole) => void;
}

export function FundingFilters({ selectedRole, onRoleChange }: FundingFiltersProps) {
  const roles = [
    { value: undefined, label: 'All Roles' },
    { value: TargetRole.PRODUCER, label: 'Producer' },
    { value: TargetRole.DIRECTOR, label: 'Director' },
    { value: TargetRole.WRITER, label: 'Writer' },
    { value: TargetRole.ACTRESS, label: 'Actress' },
    { value: TargetRole.CREW, label: 'Crew' },
    { value: TargetRole.BUSINESS, label: 'Business' },
  ];

  return (
    <div className="funding-filters">
      <div className="filter-group">
        <label>Filter by Role:</label>
        <select
          value={selectedRole || ''}
          onChange={(e) => onRoleChange(e.target.value as TargetRole || undefined)}
          className="role-filter"
        >
          {roles.map((role) => (
            <option key={role.label} value={role.value || ''}>
              {role.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

---

#### C. Main Page Component

```tsx
// app/(authenticated)/funding/page.tsx

'use client';

import { useState } from 'react';
import { useFundingOpportunities } from '@/hooks/useFunding';
import { OpportunityCard } from '@/components/funding/OpportunityCard';
import { FundingFilters } from '@/components/funding/FundingFilters';
import { TargetRole } from '@/types/funding';

export default function FundingPage() {
  const [selectedRole, setSelectedRole] = useState<TargetRole | undefined>();
  
  const { data, isLoading, error } = useFundingOpportunities({
    targetRole: selectedRole,
  });

  if (isLoading) {
    return <div className="loading">Loading opportunities...</div>;
  }

  if (error) {
    return <div className="error">Failed to load opportunities</div>;
  }

  const opportunities = data?.data || [];
  const openOpportunities = opportunities.filter(opp => opp.status === 'Open');
  const closedOpportunities = opportunities.filter(opp => opp.status === 'Closed');

  return (
    <div className="funding-page">
      <header className="page-header">
        <h1>Funding Opportunities</h1>
        <p>Discover grants and funds for women in film and television</p>
      </header>

      <FundingFilters
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
      />

      {/* Open Opportunities */}
      <section className="opportunities-section">
        <h2>Open Opportunities ({openOpportunities.length})</h2>
        
        {openOpportunities.length === 0 ? (
          <div className="empty-state">
            <p>No open opportunities found</p>
            {selectedRole && (
              <button onClick={() => setSelectedRole(undefined)}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="opportunities-grid">
            {openOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id}
                opportunity={opportunity}
              />
            ))}
          </div>
        )}
      </section>

      {/* Closed Opportunities */}
      {closedOpportunities.length > 0 && (
        <section className="opportunities-section closed">
          <h2>Closed Opportunities ({closedOpportunities.length})</h2>
          <div className="opportunities-grid">
            {closedOpportunities.map((opportunity) => (
              <OpportunityCard
                key={opportunity._id}
                opportunity={opportunity}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

---

### 5. Styling (CSS/Tailwind)

```css
/* styles/funding.css */

.opportunity-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.opportunity-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* Roles Section */
.roles-section {
  margin: 16px 0;
}

.roles-section label {
  font-size: 14px;
  font-weight: 600;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.roles-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.role-badge {
  display: inline-block;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
}

.role-badge.predefined {
  background: #e3f2fd;
  color: #1976d2;
  border: 1px solid #90caf9;
}

.role-badge.custom {
  background: #f3e5f5;
  color: #7b1fa2;
  border: 1px solid #ce93d8;
}

/* Type Badge */
.type-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.type-badge.grant {
  background: #e8f5e9;
  color: #2e7d32;
}

.type-badge.fund {
  background: #fff3e0;
  color: #e65100;
}

/* Status Badge */
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.open {
  background: #c8e6c9;
  color: #1b5e20;
}

.status-badge.closed {
  background: #ffcdd2;
  color: #b71c1c;
}

/* Apply Button */
.apply-button {
  background: #1976d2;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.apply-button:hover:not(:disabled) {
  background: #1565c0;
}

.apply-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
```


---

## 6. Smart Role Matching

### Show Relevant Opportunities Based on User Profile

```typescript
// hooks/useRelevantFunding.ts

import { useFundingOpportunities } from './useFunding';
import { useUserProfile } from './useProfile';

export function useRelevantFunding() {
  const { data: profile } = useUserProfile();
  const { data: allOpportunities } = useFundingOpportunities();

  // Filter opportunities relevant to user's roles
  const relevantOpportunities = allOpportunities?.data.filter((opp) => {
    // If opportunity targets ALL, it's relevant
    if (opp.targetRoles.includes('ALL')) return true;

    // Check if any of user's roles match opportunity's target roles
    const userRoles = profile?.roles || [];
    return opp.targetRoles.some((targetRole) =>
      userRoles.includes(targetRole)
    );
  });

  return {
    relevant: relevantOpportunities || [],
    all: allOpportunities?.data || [],
  };
}
```

### Usage in Component

```tsx
// components/funding/RelevantOpportunities.tsx

export function RelevantOpportunities() {
  const { relevant, all } = useRelevantFunding();

  return (
    <div>
      <section>
        <h2>Recommended for You ({relevant.length})</h2>
        <p>Based on your profile roles</p>
        <div className="opportunities-grid">
          {relevant.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      </section>

      <section>
        <h2>All Opportunities ({all.length})</h2>
        <div className="opportunities-grid">
          {all.map((opp) => (
            <OpportunityCard key={opp._id} opportunity={opp} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

---

## 7. Detail Page

```tsx
// app/(authenticated)/funding/[id]/page.tsx

'use client';

import { useFundingOpportunity } from '@/hooks/useFunding';
import { useParams } from 'next/navigation';

export default function FundingDetailPage() {
  const params = useParams();
  const { data, isLoading } = useFundingOpportunity(params.id as string);

  if (isLoading) return <div>Loading...</div>;

  const opportunity = data?.data;
  if (!opportunity) return <div>Not found</div>;

  const isOpen = opportunity.status === 'Open';
  const isPastDeadline = new Date(opportunity.deadline) < new Date();

  return (
    <div className="funding-detail-page">
      {/* Header */}
      <header className="detail-header">
        <div className="breadcrumb">
          <a href="/funding">Funding Opportunities</a> / {opportunity.name}
        </div>
        
        <div className="title-section">
          <h1>{opportunity.name}</h1>
          <div className="badges">
            <span className={`type-badge ${opportunity.fundingType.toLowerCase()}`}>
              {opportunity.fundingType}
            </span>
            <span className={`status-badge ${isOpen ? 'open' : 'closed'}`}>
              {opportunity.status}
            </span>
          </div>
        </div>
      </header>

      {/* Target Roles */}
      <section className="roles-section">
        <h2>Who Can Apply</h2>
        <div className="roles-container">
          {opportunity.targetRoles.map((role) => (
            <span key={role} className="role-badge predefined large">
              {formatRoleName(role)}
            </span>
          ))}
          
          {opportunity.customRoles && opportunity.customRoles.length > 0 && (
            <>
              <span className="separator">Also:</span>
              {opportunity.customRoles.map((role, index) => (
                <span key={index} className="role-badge custom large">
                  {role}
                </span>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Key Information */}
      <section className="info-grid">
        <div className="info-card">
          <h3>📅 Deadline</h3>
          <p className="large-text">
            {new Date(opportunity.deadline).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          {isOpen && !isPastDeadline && (
            <p className="countdown">
              {formatDistanceToNow(new Date(opportunity.deadline), {
                addSuffix: true,
              })}
            </p>
          )}
        </div>

        <div className="info-card">
          <h3>📍 Region</h3>
          <p className="large-text">{opportunity.region}</p>
        </div>

        <div className="info-card">
          <h3>📝 Application Type</h3>
          <p className="large-text">
            {opportunity.applicationType === 'Redirect'
              ? 'External Application'
              : 'Internal Application'}
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="description-section">
        <h2>About This Opportunity</h2>
        <div className="description-content">
          {opportunity.description}
        </div>
      </section>

      {/* Notes */}
      {opportunity.notes && (
        <section className="notes-section">
          <h2>Additional Information</h2>
          <div className="notes-content">
            {opportunity.notes}
          </div>
        </section>
      )}

      {/* Application Section */}
      <section className="application-section">
        {isOpen && !isPastDeadline ? (
          <>
            <h2>Ready to Apply?</h2>
            {opportunity.applicationType === 'Redirect' ? (
              <div className="external-application">
                <p>
                  This opportunity uses an external application process.
                  Click the button below to be redirected to the application page.
                </p>
                <a
                  href={opportunity.applicationLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="apply-button large"
                >
                  Apply Now →
                </a>
              </div>
            ) : (
              <div className="internal-application">
                <p>
                  Complete your application through the WIFT platform.
                </p>
                <button className="apply-button large">
                  Start Application
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="closed-notice">
            <h2>This Opportunity is Closed</h2>
            <p>
              {isPastDeadline
                ? 'The application deadline has passed.'
                : 'This opportunity is no longer accepting applications.'}
            </p>
            <a href="/funding" className="back-button">
              View Other Opportunities
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
```

---

## 8. Mobile Responsive Design

```css
/* Mobile styles */
@media (max-width: 768px) {
  .opportunities-grid {
    grid-template-columns: 1fr;
  }

  .opportunity-card {
    padding: 16px;
  }

  .roles-container {
    gap: 6px;
  }

  .role-badge {
    font-size: 11px;
    padding: 4px 8px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
```

---

## 9. Example API Calls

### Get All Opportunities
```typescript
const { data } = await fundingApi.getAll();
// Response: { data: FundingOpportunity[] }
```

### Filter by Role
```typescript
const { data } = await fundingApi.getAll({
  targetRole: TargetRole.PRODUCER
});
// Returns only opportunities targeting producers
```

### Filter by Chapter
```typescript
const { data } = await fundingApi.getAll({
  chapterId: '69526ddb9b10a7962e73557f'
});
// Returns only opportunities for specific chapter
```

### Combined Filters
```typescript
const { data } = await fundingApi.getAll({
  chapterId: '69526ddb9b10a7962e73557f',
  targetRole: TargetRole.DIRECTOR
});
// Returns opportunities for directors in specific chapter
```

---

## 10. Key Features Summary

### Display Features
✅ Show multiple target roles as badges  
✅ Show custom roles with different styling  
✅ Display funding type (Grant/Fund)  
✅ Show deadline with countdown  
✅ Show status (Open/Closed)  
✅ Show region  
✅ Handle external vs internal applications  

### Filtering Features
✅ Filter by target role  
✅ Filter by chapter  
✅ Show relevant opportunities based on user profile  
✅ Separate open and closed opportunities  

### User Experience
✅ Clear visual distinction between role types  
✅ Disabled apply button for closed opportunities  
✅ External link opens in new tab  
✅ Mobile responsive design  
✅ Loading and error states  

---

## Summary

The member frontend implementation focuses on:

1. **Clear Role Display**: Show both predefined and custom roles with distinct styling
2. **Smart Filtering**: Filter opportunities by role to show relevant options
3. **User-Friendly UI**: Clear status indicators, deadlines, and application buttons
4. **Responsive Design**: Works on all devices
5. **Type Safety**: Full TypeScript support

The GET response includes all necessary data in a clean format, making it easy to display and filter opportunities on the frontend.
