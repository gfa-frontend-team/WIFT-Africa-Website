# Events Module Analysis

## 1. Core Rules & Data Model

### Data Model ([Event.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Event.ts))
The [Event](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/models/Event.ts#19-52) model is the central entity with the following key properties:
- **Types**: `WORKSHOP`, `SCREENING`, `NETWORKING`, `MEETUP`, `CONFERENCE`, `OTHER`
- **Status**: `DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED`
- **Location**: Supports `PHYSICAL`, `VIRTUAL`, or `HYBRID` events.
- **Capacity**: Optional limit on attendees.
- **Visibility**: Controlled by `isPublished` (boolean).

### Business Rules & Validation
These rules are enforced in [event.service.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/services/event.service.ts) and [events.controller.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/modules/events/events.controller.ts):

1.  **Creation & Management**:
    *   **Permissions**: Only `SUPER_ADMIN` and `CHAPTER_ADMIN` roles can create, update, or cancel events.
    *   **Chapter Scoping**:
        *   **Chapter Admins** can *only* create/manage events for their assigned chapter.
        *   **Super Admins** can create global events (no chapter ID) or events for any specific chapter.
    *   **Date Validation**: End date must always be after the start date.

2.  **RSVP Logic**:
    *   **Authentication**: Required to RSVP.
    *   **Capacity Support**: Cannot RSVP if `currentAttendees` >= `capacity`.
    *   **Cancellation**: Cannot RSVP to a cancelled event.
    *   **Status updates**: Users can change status between `GOING`, `INTERESTED`, `NOT_GOING`. Only `GOING` counts towards capacity.

## 2. Rules on Fetching Events

### Public Feed (`GET /api/v1/events`)
The event feed has specific logic to show relevant content on the dashboard/calendar.

1.  **Visibility Scope**:
    *   Only fetches events where `isPublished: true` and `isCancelled: false`. (Drafts are currently not visible in the main list).

2.  **Smart Filtering (Context-Aware)**:
    *   **Explicit Chapter Filter**: If `?chapterId=...` is provided, fetches events for that chapter.
    *   **Authenticated User**: Defaults to fetching **Global Events** + **My Chapter Events**.
    *   **Anonymous/Guest**: Defaults to fetching **Global Events** only.

3.  **Standard Filters**:
    *   `type`: Filter by event type (e.g., `WORKSHOP`).
    *   `startDate` / `endDate`: Filter by date range.
    *   `page` / `limit`: Pagination controls (default 20 items per page).

4.  **Data Enrichment**:
    *   If authenticated, the response includes `myRSVP` status for each event (`GOING`, `INTERESTED`, etc.) by checking the `EventRSVP` collection.

## 3. Response Examples

### List Events Response
**GET** `/api/v1/events`

```json
{
  "events": [
    {
      "location": {
        "type": "PHYSICAL",
        "address": "123 Film Ave",
        "city": "Lagos",
        "country": "Nigeria"
      },
      "_id": "65b8e...",
      "title": "Nollywood Networking Night",
      "description": "Connect with industry leaders...",
      "type": "NETWORKING",
      "chapterId": {
        "_id": "65b8d...",
        "name": "WIFT Nigeria",
        "code": "NG"
      },
      "organizer": {
        "_id": "65b8a...",
        "firstName": "Amara",
        "lastName": "Okonjo",
        "profilePhoto": "..."
      },
      "startDate": "2024-03-15T18:00:00.000Z",
      "endDate": "2024-03-15T21:00:00.000Z",
      "timezone": "Africa/Lagos",
      "capacity": 100,
      "currentAttendees": 45,
      "tags": ["networking", "industry"],
      "status": "PUBLISHED",
      "isPublished": true,
      "isCancelled": false,
      "createdAt": "2024-02-01T10:00:00.000Z",
      "updatedAt": "2024-02-01T10:00:00.000Z",
      "myRSVP": "GOING" 
    }
  ],
  "total": 1,
  "pages": 1
}
```
*Note: `myRSVP` is null if not logged in.*

### Event Details Response
**GET** `/api/v1/events/:id`

```json
{
  "_id": "65b8e...",
  "title": "Screenwriting Masterclass",
  "description": "Advanced techniques...",
  "type": "WORKSHOP",
  "chapterId": { ... },
  "organizer": { ... },
  "startDate": "2024-04-10T09:00:00.000Z",
  "endDate": "2024-04-10T17:00:00.000Z",
  "timezone": "Africa/Legos",
  "location": {
    "type": "VIRTUAL",
    "virtualUrl": "https://zoom.us/..."
  },
  "capacity": 500,
  "currentAttendees": 120,
  "status": "PUBLISHED",
  "myRSVP": "INTERESTED"
}
```

### RSVP Response
**POST** `/api/v1/events/:id/rsvp`

```json
{
  "message": "RSVP recorded successfully",
  "rsvp": {
    "eventId": "65b8e...",
    "userId": "65b8a...",
    "status": "GOING"
  }
}
```
