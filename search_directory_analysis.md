# Study: Search & Directory Implementation

## Overview
This document analyzes the technical implementation of the **Search Page** (`/search`) and **Member Directory** (`/members`). Both features share core infrastructure but diverge in state management and UI patterns.

## Architecture

### 1. Data Layer (Shared)
Both pages rely on the same API and Hook layer, ensuring consistent data fetching logic.
-   **API Service**: [lib/api/search.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/api/search.ts)
    -   [searchMembers(params)](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/api/search.ts#98-106): Main endpoint `/search/users`.
    -   [getFilters()](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/api/search.ts#121-127): Fetches available facets (roles, chapters) from `/search/filters`.
    -   [getRecommendations()](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/api/search.ts#107-113): Fetches recommended members.
-   **React Query Hooks**: [lib/hooks/useSearch.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useSearch.ts)
    -   [useSearchMembers](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useSearch.ts#17-25): Caches search results for 1 minute.
    -   [useSearchFilters](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useSearch.ts#40-46): Caches filter options for 10 minutes.

### 2. Search Page (`/search`)
-   **Purpose**: Global search across the platform (currently focused on members).
-   **State Management**: **Global Store** ([lib/stores/searchStore.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/stores/searchStore.ts))
    -   Uses `zustand` to persist state across the app.
    -   Syncs state to URL query params via `useEffect` in the page component.
-   **Key Components**:
    -   [SearchBar](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/search/SearchBar.tsx#8-55): Updates `searchStore.currentQuery`.
    -   [SearchFilters](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/search/SearchFilters.tsx#10-213): Updates `searchStore.activeFilters`.
    -   `MemberCard`: Displays individual results.

### 3. Member Directory (`/members`)
-   **Purpose**: Browsable directory of all members with filtering.
-   **State Management**: **Local State** (`useState`)
    -   Manages [query](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useSearch.ts#36-37), `roles`, `chapter`, `availability` locally in [MembersPageContent](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/app/%28authenticated%29/members/page.tsx#28-153).
    -   Syncs state to URL query params explicitly on change.
-   **Key Components**:
    -   `MembersSearchHeader`: Contains a local search input and filter toggle.
    -   `MembersFilterSidebar`: UI for toggling filters (accepts props, stateless logic).
    -   `MembersGrid`: Render list of members.

## Comparative Analysis

| Feature | Search Page (`/search`) | Directory (`/members`) |
| :--- | :--- | :--- |
| **State Source** | Global Store (`searchStore`) | Local Page State (`useState`) |
| **URL Sync** | Reactive (Store -> URL) | Reactive (State -> URL) |
| **Filter UI** | [SearchFilters.tsx](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/search/SearchFilters.tsx) (Connected to Store) | `MembersFilterSidebar.tsx` (Controlled Props) |
| **Pagination** | `SearchPagination` (Explicit) | Infinite Scroll (Planned) / Simple Limit |

## Observations & Issues

### 1. Duplicated Logic
The logic for sinking URL parameters is duplicated between the two pages.
-   `/search` does it via `searchStore` + `useEffect`.
-   `/members` does it via local state + `useEffect`.
*Recommendation*: This is acceptable given the different scope (Global Search vs. Directory browsing), but creates maintenance overhead.

### 2. Potential Points of Failure
-   **API Dependency**: Both pages pass their parameters to `searchApi.searchMembers`. If the backend endpoint `/search/users` is down or expects different parameter formats (e.g., `roles[]` vs `roles`), **both** pages will break simultaneously.
-   **Filter Data**: The sidebar relies on [useSearchFilters()](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/lib/hooks/useSearch.ts#40-46) calling `/search/filters`. If this endpoint returns empty data, the filters will be blank, making the directory feel "broken".

### 3. Component Coupling
-   [SearchFilters.tsx](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/search/SearchFilters.tsx) is tightly coupled to `useSearchStore`. It cannot be reused in `/members` because `/members` uses local state. This forces the maintenance of two separate filter UI components ([SearchFilters](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/wift-africa-member-frontend/components/search/SearchFilters.tsx#10-213) vs `MembersFilterSidebar`).

## Conclusion
The implementation is structurally sound but relies heavily on the backend `/search/*` endpoints being fully operational. The split between "Store-driven" (Search) and "Local-driven" (Directory) state is a valid architectural choice to keep the Directory isolated, but it prevents component reuse for filters.
