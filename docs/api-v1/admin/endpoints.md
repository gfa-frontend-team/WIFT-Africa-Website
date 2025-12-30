## Endpoint: Get Chapter Statistics

### Request
**`GET /api/v1/admin/chapters/statistics`**

Get high-level statistics about chapters and membership globally.

**Authentication**: Required (Super Admin)

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "totalChapters": 12,
  "activeChapters": 10,
  "inactiveChapters": 2,
  "totalMembers": 1500,
  "totalCountries": 8
}
```

---

## Endpoint: Get Countries with Chapters

### Request
**`GET /api/v1/admin/chapters/countries`**

Get a list of distinct countries where chapters are established.

**Authentication**: Required (Super Admin)

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "countries": [
    "South Africa",
    "Kenya",
    "Nigeria",
    "Ghana"
  ]
}
```

---

## Endpoint: Get Member Analytics

### Request
**`GET /api/v1/admin/analytics/members`**

Retrieve member growth and distribution analytics.

**Authentication**: Required (Super Admin)

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| chapterId | string | Filter by chapter (optional) |
| startDate | string | Start date (YYYY-MM-DD) |
| endDate | string | End date (YYYY-MM-DD) |

### Response
**Status Code**: `200 OK`
```json
{
  "summary": {
    "totalMembers": 150,
    "approvedMembers": 120,
    "pendingMembers": 25,
    "rejectedMembers": 5,
    "activeMembers": 85,
    "profileCompletionRate": 65
  },
  "growth": {
    "period": "daily",
    "data": [
      {
        "date": "2024-01-01",
        "total": 5,
        "approved": 3,
        "pending": 2
      }
    ]
  },
  "byChapter": [
    {
      "chapterId": "...",
      "chapterName": "WIFT Africa HQ",
      "totalMembers": 50,
      "approvedMembers": 45,
      "pendingMembers": 5
    }
  ]
}
```

---

## Endpoint: Get Chapter Analytics

### Request
**`GET /api/v1/admin/chapters/:chapterId/analytics`**

Get specific analytics for a single chapter.

**Authentication**: Required (Super Admin)

### Response
**Status Code**: `200 OK`
```json
{
  "chapter": {
    "id": "...",
    "name": "WIFT Africa HQ",
    "country": "Kenya",
    "city": "Nairobi"
  },
  "members": {
    "approved": { "total": 120, "newLast30Days": 5 },
    "pendingApproval": 15
  },
  "activity": {
    "activeLast30Days": 85,
    "inactive": 35
  },
  "profiles": {
    "completed": 80,
    "incomplete": 40
  },
  "roles": {
    "WRITER": 45,
    "DIRECTOR": 30
  }
}
```

---

## Endpoint: List Chapters

### Request
**`GET /api/v1/admin/chapters`**

Retrieve a paginated, filterable list of all chapters.

**Authentication**: Required (Super Admin)

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| search | string | Search name, code, or city |
| country | string | Filter by country |
| isActive | boolean | Filter by active status |
| sortBy | string | Sort field (default: 'name') |
| sortOrder | string | 'asc' or 'desc' |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "chapters": [
    {
      "id": "676bd...",
      "name": "WIFT Africa HQ",
      "code": "HQ",
      "country": "South Africa",
      "city": "Johannesburg",
      "isActive": true,
      "memberCount": 500
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 12,
    "pages": 1
  }
}
```

---

## Endpoint: Create Chapter

### Request
**`POST /api/v1/admin/chapters`**

Create a new chapter configuration.

**Authentication**: Required (Super Admin)

#### Request Body
```json
{
  "name": "WIFT Kenya",
  "code": "KE",
  "country": "Kenya",
  "city": "Nairobi",
  "description": "Connecting women in film in East Africa.",
  "foundedDate": "2024-01-01"
}
```

**Field Descriptions**:
- `name` (string, required): Chapter name
- `code` (string, required): Unique 2-10 char code
- `country` (string, required): Country name
- `city` (string, optional): City name
- `description` (string, optional): Max 1000 chars
- `websites`, `socialLinks`, etc. (optional string fields)

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "message": "Chapter created successfully",
  "chapter": {
    "id": "677c...",
    "name": "WIFT Kenya",
    "isActive": true
  }
}
```

---

## Endpoint: Get Chapter Details

### Request
**`GET /api/v1/admin/chapters/:id`**

Get full details of a specific chapter, including member statistics.

**Authentication**: Required (Super Admin)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "chapter": {
    "id": "676bd...",
    "name": "WIFT Africa HQ",
    "adminIds": [
      {
        "firstName": "Super",
        "lastName": "Admin",
        "email": "admin@example.com"
      }
    ]
  },
  "stats": {
    "total": 500,
    "approved": 480,
    "pending": 15,
    "rejected": 5
  }
}
```

---

## Endpoint: Update Chapter

### Request
**`PATCH /api/v1/admin/chapters/:id`**

Update chapter details.

**Authentication**: Required (Super Admin)

#### Request Body
```json
{
  "description": "Updated description",
  "isActive": false
}
```

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Chapter updated successfully",
  "chapter": { ... }
}
```

---

## Endpoint: Add Chapter Admin

### Request
**`POST /api/v1/admin/chapters/:id/admins`**

Promote a chapter member to Chapter Admin status.

**Authentication**: Required (Super Admin)

#### Request Body
```json
{
  "userId": "676ac..."
}
```

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Chapter admin added successfully",
  "chapter": {
    "adminIds": [ ... ]
  }
}
```

---

## Endpoint: Verification Stats (Delayed)

### Request
**`GET /api/v1/admin/verification/delayed-stats`**

Get statistics on membership requests that have been pending for longer than the threshold (7 days).

**Authentication**: Required (Super Admin)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "total": 5,
  "notified": 3,
  "notNotified": 2
}
```

---

## Endpoint: Trigger Verification Delay Check

### Request
**`POST /api/v1/admin/verification/check-delays`**

Manually trigger the background process to check for delayed membership requests.

**Authentication**: Required (Super Admin)

### Response
**Status Code**: `200 OK`
```json
{
  "message": "Delay check completed",
  "processed": 5,
  "errors": 0
}
```

---

## Endpoint: Deactivate Chapter

### Request
**`DELETE /api/v1/admin/chapters/:id`**

Soft delete/deactivate a chapter.

**Authentication**: Required (Super Admin)

### Response
**Status Code**: `200 OK`
```json
{
  "message": "Chapter deactivated successfully"
}
```

---

## Endpoint: Reactivate Chapter

### Request
**`POST /api/v1/admin/chapters/:id/reactivate`**

Reactivate a previously deactivated chapter.

**Authentication**: Required (Super Admin)

### Response
**Status Code**: `200 OK`
```json
{
  "message": "Chapter reactivated successfully"
}
```

---

## Endpoint: Remove Chapter Admin

### Request
**`DELETE /api/v1/admin/chapters/:id/admins/:userId`**

Remove admin privileges from a chapter member.

**Authentication**: Required (Super Admin)

### Response
**Status Code**: `200 OK`
```json
{
  "message": "Chapter admin removed successfully"
}
```

---

## Endpoint: Hide Post (Moderation)

### Request
**`PATCH /api/v1/admin/posts/:postId/hide`**

Hide a post from the public feed due to policy violations.

**Authentication**: Required (Admin)

#### Request Body
```json
{
  "reason": "This post violates community guidelines regarding respectful communication."
}
```
*Reason must be between 10 and 500 characters.*

### Response
**Status Code**: `200 OK`
```json
{
  "message": "Post hidden successfully"
}
```

---

## Endpoint: Unhide Post

### Request
**`PATCH /api/v1/admin/posts/:postId/unhide`**

Restore a previously hidden post.

**Authentication**: Required (Admin)

### Response
**Status Code**: `200 OK`
```json
{
  "message": "Post unhidden successfully"
}
```



---

## Endpoint: Realtime Monitoring

### Request
**`GET /api/v1/admin/monitoring/realtime`**

Get real-time system stats (WebSocket connections, message throughput).

**Authentication**: Required (Super Admin)

### Response
**Status Code**: `200 OK`
```json
{
  "websocket": {
    "activeConnections": 247,
    "activeUsers": 198
  },
  "messaging": {
    "throughputPerMinute": 52
  },
  "system": {
    "uptime": 86400
  }
}
```

