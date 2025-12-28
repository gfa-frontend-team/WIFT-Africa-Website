# Search & Discovery Module - Usage Examples

## Overview
Powerful search functionality to find users by role, skills, and location, along with personalized recommendations.

---

## Basic Search

### Text Search
```typescript
const searchByName = async (query) => {
  const params = new URLSearchParams({ query });
  const response = await fetch(`/api/v1/search/users?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

---

## Advanced Filtering

### Filter by Role & Skills
```typescript
const findCrew = async () => {
  const params = new URLSearchParams();
  params.append('role', 'CREW');
  params.append('skills[]', 'lighting');
  params.append('skills[]', 'camera');
  params.append('location', 'Nairobi');
  
  const response = await fetch(`/api/v1/search/users?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  console.log('Matches:', data.users);
};
```

---

## Recommendations

### Get Recommended Connections
```typescript
const loadRecommendations = async () => {
  const response = await fetch('/api/v1/recommendations/users?limit=5', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  
  // Display as "People you may know"
  return data.recommendations;
};
```

---

## Interactive Filters

### Load Dropdown Options
```typescript
// Call this on page load to populate filter dropdowns
const getFilters = async () => {
  const response = await fetch('/api/v1/search/filters', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { availableRoles, locationSuggestions } = await response.json();
  
  return { roles: availableRoles, locations: locationSuggestions };
};
```
