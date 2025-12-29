## Endpoint: Get Pending Membership Requests

### Request
**`GET /api/v1/chapters/:chapterId/membership-requests`**

Retrieve a list of pending membership applications for a specific chapter. 
**Note**: Only accessible by Chapter Admins of the target chapter or Super Admins.

**Authentication**: Required (Admin Role)

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| chapterId | string | ID of the chapter |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "requests": [
    {
      "id": "676e1a...",
      "user": {
        "id": "676ac5...",
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jane@example.com",
        "profilePhoto": "..."
      },
      "chapter": {
        "id": "676bd2...",
        "name": "WIFT Africa HQ"
      },
      "memberType": "NEW",
      "membershipId": null,
      "phoneNumber": "+1234567890",
      "additionalInfo": "Referral from Sarah",
      "expectedReviewDate": "2024-02-15T00:00:00.000Z",
      "isDelayed": false,
      "daysWaiting": 2,
      "createdAt": "2024-02-10T14:30:00.000Z"
    }
  ]
}
```

#### Error Responses

##### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not authorized to view this chapter's requests"
  }
}
```

---

## Endpoint: Approve Membership Request

### Request
**`POST /api/v1/chapters/:chapterId/membership-requests/:requestId/approve`**

Approve a pending membership request. This grants the user full member access to the chapter.

**Authentication**: Required (Admin Role)

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| chapterId | string | ID of the chapter |
| requestId | string | ID of the membership request |

#### Request Body
```json
{
  "notes": "Verified ID and payment status."
}
```

**Field Descriptions**:
- `notes` (string, optional): Internal notes about the approval (max 500 chars).

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Membership request approved successfully",
  "request": {
    "id": "676e1a...",
    "status": "APPROVED",
    "reviewedAt": "2024-02-12T10:00:00.000Z"
  }
}
```

---

## Endpoint: Reject Membership Request

### Request
**`POST /api/v1/chapters/:chapterId/membership-requests/:requestId/reject`**

Reject a pending membership request.

**Authentication**: Required (Admin Role)

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| chapterId | string | ID of the chapter |
| requestId | string | ID of the membership request |

#### Request Body
```json
{
  "reason": "Incomplete documentation.",
  "canReapply": true
}
```

**Field Descriptions**:
- `reason` (string, required): Explanation for rejection (min 10, max 500 chars).
- `canReapply` (boolean, optional): Whether the user can apply again (default: `true`).

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Membership request rejected",
  "request": {
    "id": "676e1a...",
    "status": "REJECTED",
    "reviewedAt": "2024-02-12T10:05:00.000Z",
    "canReapply": true,
    "reapplicationAllowedAt": "2024-03-14T10:05:00.000Z"
  }
}
```

---

## Endpoint: Get Chapter Members

### Request
**`GET /api/v1/chapters/:chapterId/members`**

Get a list of all approved members in the chapter.

**Authentication**: Required (Admin Role)

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| chapterId | string | ID of the chapter |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "members": [
    {
      "id": "676ac5...",
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "profilePhoto": "...",
      "accountType": "CHAPTER_MEMBER",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

---

## Endpoint: List Chapters (Public)

### Request
**`GET /api/v1/chapters`**

List all chapters with optional filtering.

**Authentication**: Public (or Authenticated)

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| country | string | Filter by country |
| city | string | Filter by city |

### Response
**Status Code**: `200 OK`
```json
{
  "chapters": [
    {
      "id": "676bd...",
      "name": "WIFT Africa HQ",
      "country": "Kenya",
      "city": "Nairobi"
    }
  ]
}
```

---

## Endpoint: Get Chapter Details
### Request
**`GET /api/v1/chapters/:chapterId`**

Retrieve details for a specific chapter.
**Note**: Only accessible by Chapter Admins of the target chapter or Super Admins.

**Authentication**: Required (Chapter Admin or Super Admin Role)

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| chapterId | string | ID of the chapter |

### Response
#### Success Response
**Status Code**: `200 OK`
```json
{
  "id": "676bd2...",
  "name": "WIFT Africa HQ",
  "code": "WA-HQ",
  "country": "Kenya",
  "city": "Nairobi",
  "description": "Headquarters chapter...",
  "missionStatement": "Empowering women...",
  "email": "hq@wiftafrica.org",
  "phone": "+254...",
  "website": "https://wiftafrica.org",
  "isActive": true
}
```

#### Error Responses
##### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "You are not authorized to view this chapter's details"
  }
}
```

---

## Endpoint: Update Chapter Details
### Request
**`PATCH /api/v1/chapters/:chapterId`**

Update editable details for a specific chapter.
**Note**: Only accessible by Chapter Admins of the target chapter or Super Admins.

**Authentication**: Required (Chapter Admin or Super Admin Role)

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| chapterId | string | ID of the chapter |

#### Request Body
```json
{
  "description": "New description...",
  "missionStatement": "New mission...",
  "email": "new-email@wift.org",
  "phone": "+1234567890",
  "website": "https://new-site.org",
  "facebookUrl": "...",
  "twitterHandle": "...",
  "instagramHandle": "...",
  "linkedinUrl": "..."
}
```
**Allowed Fields**: `description`, `missionStatement`, `email`, `phone`, `address`, `website`, `facebookUrl`, `twitterHandle`, `instagramHandle`, `linkedinUrl`.
**Restricted Fields**: `name`, `code`, `country`, `city`, `foundedDate`, `isActive` (cannot be changed via this endpoint).

### Response
#### Success Response
**Status Code**: `200 OK`
```json
{
  "id": "676bd2...",
  "name": "WIFT Africa HQ",
  "description": "New description...",
  ...
}
```
