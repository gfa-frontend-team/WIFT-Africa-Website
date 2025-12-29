# Events API Documentation

## Endpoint: List Events (Calendar)

### Request
**`GET /api/v1/events`**

Retrieve a list of events with optional filtering.

**Authentication**: Public (for listing) / Required (depending on implementation - checking routes, it seems public or at least accessible)
*Note: Route definition uses `eventsController.listEvents` directly without `authenticate` middleware on the router level for this specific route?
Wait, checking `events.routes.ts`:
`router.get('/', eventsController.listEvents.bind(eventsController));`
There is no `router.use(authenticate)` at the top level. The other routes have `authenticate`.
So listing events appears to be public.

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| chapterId | string | Filter by chapter |
| type | string | Filter by event type (`WORKSHOP`, `SCREENING`, `NETWORKING`, `MEETUP`, `CONFERENCE`, `OTHER`) |
| startDate | string | Filter events starting from this date (YYYY-MM-DD) |
| endDate | string | Filter events up to this date (YYYY-MM-DD) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "events": [
    {
      "id": "evt_123...",
      "title": "Film Industry Networking Mixer",
      "description": "Join us for an evening...",
      "type": "NETWORKING",
      "chapter": {
        "id": "...",
        "name": "WIFT Africa HQ"
      },
      "startDate": "2024-02-15T18:00:00Z",
      "endDate": "2024-02-15T21:00:00Z",
      "location": {
        "type": "PHYSICAL",
        "city": "Lagos",
        "country": "Nigeria"
      },
      "coverImage": "/uploads/events/evt-123.jpg",
      "capacity": 50,
      "currentAttendees": 25
    }
  ],
  "total": 1,
  "pages": 1
}
```

---

## Endpoint: Get Event Details

### Request
**`GET /api/v1/events/:eventId`**

Get detailed information about a specific event.

**Authentication**: Public

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | ID of the event |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "id": "evt_123...",
  "title": "Film Industry Networking Mixer",
  "description": "Full description...",
  "type": "NETWORKING",
  "location": {
    "type": "PHYSICAL",
    "address": "123 Victoria Island",
    "city": "Lagos",
    "country": "Nigeria"
  },
  "organizer": {
    "id": "usr_...",
    "firstName": "Jane",
    "lastName": "Doe"
  },
  "myRSVP": "GOING" 
}
```
*Note: `myRSVP` field will be `null` if user is not authenticated or hasn't RSVP'd.*

---

## Endpoint: RSVP to Event

### Request
**`POST /api/v1/events/:eventId/rsvp`**

RSVP to an upcoming event.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | ID of the event |

#### Request Body
```json
{
  "status": "GOING"
}
```
**Field Descriptions**:
- `status` (string, required): `GOING`, `INTERESTED`, or `NOT_GOING`.

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "RSVP recorded successfully",
  "rsvp": {
    "eventId": "evt_123...",
    "status": "GOING"
  }
}
```

---

## Endpoint: Cancel RSVP

### Request
**`DELETE /api/v1/events/:eventId/rsvp`**

Cancel an existing RSVP.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "RSVP cancelled successfully"
}
```

---

## Endpoint: Create Event (Admin)

### Request
**`POST /api/v1/admin/events`**

Create a new chapter event.

**Authentication**: Required (Chapter Admin)

#### Request Body
```json
{
  "title": "Screenwriting Workshop",
  "description": "Learn the basics...",
  "type": "WORKSHOP",
  "chapterId": "ch_123...",
  "startDate": "2024-03-01T10:00:00Z",
  "endDate": "2024-03-01T14:00:00Z",
  "timezone": "Africa/Lagos",
  "location": {
    "type": "PHYSICAL",
    "address": "Film Center",
    "city": "Lagos",
    "country": "Nigeria"
  },
  "capacity": 30,
  "tags": ["writing", "workshop"]
}
```

### Response

#### Success Response
**Status Code**: `201 Created`
```json
{
  "message": "Event created successfully",
  "event": { ... }
}
```

---

## Endpoint: Update Event (Admin)

### Request
**`PATCH /api/v1/admin/events/:eventId`**

Update details of an existing event.

**Authentication**: Required (Chapter Admin)

#### Request Body
```json
{
  "title": "Updated Title",
  "capacity": 40
}
```

### Response
**Status Code**: `200 OK`

---

## Endpoint: Cancel/Archive Event (Admin)

### Request
**`DELETE /api/v1/admin/events/:eventId`**

Cancel an event and notify attendees.

**Authentication**: Required (Chapter Admin)

#### Request Body
```json
{
  "reason": "Venue unavailable"
}
```

### Response
**Status Code**: `200 OK`
```json
{
  "message": "Event cancelled successfully",
  "notifiedAttendees": 15
}
```

---

## Endpoint: Get Attendees (Admin)

### Request
**`GET /api/v1/admin/events/:eventId/attendees`**

List all users who have RSVP'd to the event.

**Authentication**: Required (Chapter Admin)

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| export | boolean | If true, may trigger CSV download (default: false) |

### Response
**Status Code**: `200 OK`
```json
{
  "attendees": [
    {
      "user": { "id": "...", "firstName": "..." },
      "status": "GOING",
      "rsvpDate": "2024-02-10T..."
    }
  ],
  "stats": {
    "going": 20,
    "interested": 5,
    "notGoing": 1
  }
}
```
