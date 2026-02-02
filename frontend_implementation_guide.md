# Frontend Implementation Guide: Search & Directory

This guide details how to implement the **Search Page** (`/search`) and **Member Directory** (`/members`) using the optimized backend APIs.

## 1. API Endpoints

### Base URL: `/api/v1`

### A. Search Users
**Endpoint**: `GET /search/users`
**Auth**: Required (Bearer Token)

**Query Parameters:**
| Parameter | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `query` | string | No | Search by name, username, headline, bio | `jane` |
| `role` | string (Enum) | No | Filter by primary role | `PRODUCER` |
| `roles` | string[] | No | Filter by multiple roles | `['DIRECTOR', 'WRITER']` |
| `skills` | string[] | No | Filter by skills (partial match) | `['editing']` |
| `location` | string | No | Filter by location | `Lagos` |
| `chapter` | string (ID) | No | Filter by Chapter ID | `65b...` |
| `availability` | string (Enum) | No | `AVAILABLE`, `BUSY`, `NOT_LOOKING` | `AVAILABLE` |
| `isMultihyphenate`| boolean | No | Filter multihyphenates | `true` |
| `excludeConnected`| boolean | No | Exclude already connected users | `true` |
| `sortBy` | string | No | `relevance` (default), `name`, `recent` | `recent` |
| `page` | number | No | Page number (default 1) | `1` |
| `limit` | number | No | Items per page (default 20, max 50) | `20` |

**Response Shape:**
```typescript
interface SearchResponse {
  users: Array<{
    id: string;
    firstName: string;
    lastName: string;
    username?: string;
    profileSlug: string;
    profilePhoto?: string;
    headline?: string;
    primaryRole?: string;
    roles?: string[];
    location?: string;
    availabilityStatus?: 'AVAILABLE' | 'BUSY' | 'NOT_LOOKING';
    chapter?: {
      id: string;
      name: string;
      code: string;
    };
    isConnected: boolean;
    connectionStatus: 'connected' | 'pending' | 'none';
    matchScore: number;
  }>;
  total: number;
  pages: number;
  filters: {
    availableRoles: string[];
    availableChapters: Array<{ id: string; name: string; memberCount: number }>;
    locationSuggestions: string[];
  };
}
```

### B. Get Filters (Metadata)
**Endpoint**: `GET /search/filters`
**Auth**: Required

**Use Case**: Populate sidebar filter options (Roles, Chapters, Locations) *before* a search is run, or to reset filters.

**Response Shape:**
```typescript
interface FilterResponse {
  availableRoles: string[];
  availableChapters: Array<{ id: string; name: string; memberCount: number }>;
  locationSuggestions: string[];
}
```

---

## 2. Implementation Strategy

### Shared Data Hooks
Create a strongly-typed hook using React Query (TanStack Query) to manage state and caching.

```typescript
// hooks/useSearchMembers.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api'; // Your axios instance

export const useSearchMembers = (params: SearchParams) => {
  return useQuery({
    queryKey: ['search', params],
    queryFn: async () => {
      const { data } = await api.get('/search/users', { params });
      return data;
    },
    keepPreviousData: true, // Smooth pagination
    staleTime: 1000 * 60,   // Cache for 1 minute
  });
};
```

### Page 1: Global Search (`/search`)
**Goal**: Search across the entire database.

1.  **State**: Use URL Query Params as the source of truth (`?q=jane&role=PRODUCER`).
2.  **Debounce**: Debounce the `query` input by 300-500ms to avoid excessive API calls.
3.  **Display**:
    -   Show `LoadingSkeleton` while `isLoading` is true.
    -   Map `data.users` to `MemberCard` components.
    -   Show `Pagination` control using `data.pages` and `data.total`.

### Page 2: Member Directory (`/members`)
**Goal**: Browse members, often filtered by Chapter or Role.

1.  **Initial Load**: Call `GET /search/users?sortBy=recent` to show the newest members first.
2.  **Filters**:
    -   Fetch filter options via `GET /search/filters` for the sidebar.
    -   When a filter is clicked (e.g., "Producers"), update the `role` state/URL param.
3.  **Optimization**:
    -   Since the directory can be "browsed", consider `infinite` pagination (Load More) instead of numbered pagination for a smoother mobile experience.

## 3. Handling Edge Cases

-   **Empty State**: If `data.users.length === 0`, display a "No members found" empty state component. Suggest resetting filters.
-   **Error State**: Wrap the list in an `ErrorBoundary` or check `isError` from the hook to show a friendly "Something went wrong" message.
-   **Loading**: Always show a specialized skeleton loader (e.g., repeating member card shapes) instead of a generic spinner for better UX.

## 4. Frontend Enum Sync
Ensure your frontend `Role` types match the backend exactly:
```typescript
export enum Role {
  PRODUCER = 'PRODUCER',
  DIRECTOR = 'DIRECTOR',
  WRITER = 'WRITER',
  ACTRESS = 'ACTRESS',
  CREW = 'CREW',
  BUSINESS = 'BUSINESS',
}
```
