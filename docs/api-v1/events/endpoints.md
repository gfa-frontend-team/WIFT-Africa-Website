# Events API Documentation

## Endpoint: List Events (Calendar)

### Request
**`GET /api/v1/events`**

Retrieve a list of events with optional filtering.

**Authentication**: Public (no authentication required)

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

**Authentication**: Public (optional - if authenticated, includes user's RSVP status)

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

#### Error Response
**Status Code**: `404 Not Found`
```json
{
  "error": "Event not found"
}
```

---

## Endpoint: RSVP to Event

### Request
**`POST /api/v1/events/:eventId/rsvp`**

RSVP to an upcoming event.

**Authentication**: Required (Bearer token)

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
    "userId": "usr_456...",
    "status": "GOING"
  }
}
```

#### Error Responses
**Status Code**: `400 Bad Request`
```json
{
  "error": "Event is full"
}
```
```json
{
  "error": "Event is cancelled"
}
```

**Status Code**: `401 Unauthorized`
```json
{
  "error": "Unauthorized"
}
```

**Status Code**: `404 Not Found`
```json
{
  "error": "Event not found"
}
```

---

## Endpoint: Cancel RSVP

### Request
**`DELETE /api/v1/events/:eventId/rsvp`**

Cancel an existing RSVP.

**Authentication**: Required (Bearer token)

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | ID of the event |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "RSVP cancelled successfully"
}
```

#### Error Responses
**Status Code**: `401 Unauthorized`
```json
{
  "error": "Unauthorized"
}
```

**Status Code**: `404 Not Found`
```json
{
  "error": "RSVP not found"
}
```

---

## Endpoint: Create Event (Admin)

### Request
**`POST /api/v1/events/admin/events`**

Create a new chapter event.

**Authentication**: Required (Chapter Admin or Super Admin)

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

#### Field Descriptions
- `title` (string, required): Event title (max 200 characters)
- `description` (string, required): Event description (max 5000 characters)
- `type` (string, required): Event type enum
- `chapterId` (string, required): Chapter ID
- `startDate` (string, required): ISO datetime string
- `endDate` (string, required): ISO datetime string
- `timezone` (string, required): Timezone identifier
- `location` (object, required): Location details
  - `type` (string, required): `PHYSICAL`, `VIRTUAL`, or `HYBRID`
  - `address` (string, optional): Physical address
  - `city` (string, optional): City name
  - `country` (string, optional): Country name
  - `virtualUrl` (string, optional): Virtual meeting URL
- `capacity` (number, optional): Maximum attendees
- `coverImage` (string, optional): Cover image URL
- `tags` (array, optional): Array of tag strings

### Response

#### Success Response
**Status Code**: `201 Created`
```json
{
  "message": "Event created successfully",
  "event": {
    "id": "evt_789...",
    "title": "Screenwriting Workshop",
    "description": "Learn the basics...",
    "type": "WORKSHOP",
    "chapterId": "ch_123...",
    "organizer": "usr_456...",
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
    "currentAttendees": 0,
    "tags": ["writing", "workshop"],
    "status": "PUBLISHED",
    "isPublished": true,
    "isCancelled": false,
    "createdAt": "2024-02-20T10:00:00Z",
    "updatedAt": "2024-02-20T10:00:00Z"
  }
}
```

#### Error Responses
**Status Code**: `400 Bad Request`
```json
{
  "error": "End date must be after start date"
}
```

**Status Code**: `401 Unauthorized`
```json
{
  "error": "Unauthorized"
}
```

**Status Code**: `403 Forbidden`
```json
{
  "error": "Admin privileges required"
}
```

---

## Endpoint: Get Event Attendees (Admin)

### Request
**`GET /api/v1/events/admin/events/:eventId/attendees`**

List all users who have RSVP'd to the event.

**Authentication**: Required (Chapter Admin or Super Admin)

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| eventId | string | ID of the event |

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| export | boolean | If true, may trigger CSV download (default: false) |

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "attendees": [
    {
      "user": {
        "id": "usr_123...",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com",
        "profilePhoto": "/uploads/profiles/jane.jpg"
      },
      "status": "GOING",
      "rsvpDate": "2024-02-10T15:30:00Z"
    }
  ],
  "stats": {
    "going": 20,
    "interested": 5,
    "notGoing": 1
  }
}
```

#### Error Responses
**Status Code**: `401 Unauthorized`
```json
{
  "error": "Unauthorized"
}
```

**Status Code**: `403 Forbidden`
```json
{
  "error": "Admin privileges required"
}
```

**Status Code**: `404 Not Found`
```json
{
  "error": "Event not found"
}
```

---

## Endpoints NOT YET IMPLEMENTED

The following endpoints are defined in the routes but return placeholder responses:

### Update Event (Admin)
**`PATCH /api/v1/events/admin/events/:eventId`**
- Returns: `{"message": "Event updated successfully"}`
- Status: Placeholder implementation (TODO in controller)

### Cancel Event (Admin)
**`DELETE /api/v1/events/admin/events/:eventId`**
- Returns: `{"message": "Event cancelled successfully", "notifiedAttendees": 0}`
- Status: Placeholder implementation (TODO in controller)

---

## Notes

1. **Correct Admin URLs**: Admin endpoints are accessible at `/api/v1/events/admin/events/*`, not `/api/v1/admin/events/*`
2. **Authentication**: Uses Bearer token in Authorization header
3. **Validation**: All endpoints use Zod schema validation
4. **Error Handling**: Consistent error response format with appropriate HTTP status codes
5. **Pagination**: List events supports pagination with `page` and `limit` parameters
6. **Filtering**: Multiple filter options available for event listing
