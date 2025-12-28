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
