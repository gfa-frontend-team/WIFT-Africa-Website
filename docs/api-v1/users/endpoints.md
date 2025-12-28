## Endpoint: Get Current User

### Request
**`GET /api/v1/users/me`**

Retrieve basic information about the currently authenticated user.

**Authentication**: Required

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
  "user": {
    "id": "676ac5...",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "profilePhoto": "https://...",
    "emailVerified": true,
    "accountType": "CHAPTER_MEMBER",
    "membershipStatus": "APPROVED",
    "onboardingComplete": true,
    "onboardingStep": 5,
    "chapter": {
      "id": "676bd2...",
      "name": "WIFT Africa HQ",
      "code": "HQ",
      "country": "South Africa"
    },
    "memberType": "NEW",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastLoginAt": "2024-01-05T12:00:00.000Z"
  }
}
```

---

## Endpoint: Get My Profile

### Request
**`GET /api/v1/users/me/profile`**

Get the user's complete profile, including roles, specializations, social links, and completion status.

**Authentication**: Required

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
  "user": {
    "id": "676ac5...",
    "email": "jane.doe@example.com",
     "chapter": {
      "id": "676bd2...",
      "name": "WIFT Africa HQ"
    }
  },
  "profile": {
    "roles": ["DIRECTOR", "WRITER"],
    "primaryRole": "DIRECTOR",
    "isMultihyphenate": true,
    "writerSpecialization": "FILM",
    "crewSpecializations": [],
    "businessSpecializations": [],
    "headline": "Award-winning Director",
    "bio": "Passionate filmmaker...",
    "location": "Lagos, Nigeria",
    "availabilityStatus": "AVAILABLE",
    "website": "https://janedoe.com",
    "imdbUrl": "https://imdb.com/name/nm1234567",
    "linkedinUrl": null,
    "instagramHandle": "janedoe_films",
    "twitterHandle": null,
    "completeness": {
      "completionPercentage": 85,
      "missingFields": ["linkedinUrl"],
      "isComplete": false
    }
  }
}
```

---

## Endpoint: Update Profile

### Request
**`PATCH /api/v1/users/me/profile`**

Update user profile details such as bio, headline, and social links.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "bio": "Updated bio text...",
  "headline": "New Headline",
  "location": "Cape Town, SA",
  "website": "https://newwebsite.com",
  "imdbUrl": "",
  "linkedinUrl": "https://linkedin.com/in/jane",
  "instagramHandle": "jane_updated",
  "twitterHandle": "jane_tweets",
  "availabilityStatus": "BUSY"
}
```

**Field Descriptions**:
- `bio` (string, optional): Max 1000 chars
- `headline` (string, optional): Max 255 chars
- `location` (string, optional): Max 100 chars
- `website` (string, optional): Valid URL or empty string
- `imdbUrl` (string, optional): Valid URL or empty string
- `linkedinUrl` (string, optional): Valid URL or empty string
- `instagramHandle` (string, optional): Max 50 chars
- `twitterHandle` (string, optional): Max 50 chars
- `availabilityStatus` (string, optional): `AVAILABLE`, `BUSY`, or `NOT_LOOKING`

#### Validation Rules
- URLs must be valid format
- Field lengths are enforced

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Profile updated successfully",
  "profile": {
    "headline": "New Headline",
    "bio": "Updated bio text...",
    "location": "Cape Town, SA",
    "availabilityStatus": "BUSY",
    "website": "https://newwebsite.com",
    "imdbUrl": null,
    "linkedinUrl": "https://linkedin.com/in/jane",
    "instagramHandle": "jane_updated",
    "twitterHandle": "jane_tweets"
  }
}
```

---

## Endpoint: Upload Profile Photo

### Request
**`POST /api/v1/users/me/profile-photo`**

Upload a new profile photo. Replaces any existing photo.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | multipart/form-data | Yes |

#### Request Body (Multipart/Form-Data)
| Field | Type | Description |
|-------|------|-------------|
| photo | file | Image file (JPG, PNG, WebP, max 5MB) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Profile photo uploaded successfully",
  "photoUrl": "https://storage.example.com/uploads/photo.jpg"
}
```

---

## Endpoint: Delete Profile Photo

### Request
**`DELETE /api/v1/users/me/profile-photo`**

Remove the current profile photo.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Profile photo deleted successfully"
}
```

---

## Endpoint: Update Username

### Request
**`PUT /api/v1/users/me/username`**

Change the user's username. Limited to 3 changes per month.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "username": "jane-filmmaker"
}
```

**Field Descriptions**:
- `username` (string, required): New username (3-30 chars, lowercase alphanumeric + hyphens)

#### Validation Rules
- Must match regex: `^[a-z0-9-]+$`
- Must differ from current username
- Must be unique across system

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Username updated successfully",
  "username": "jane-filmmaker",
  "changesRemaining": 2
}
```

#### Error Responses

##### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Username is already taken"
  }
}
```

##### 429 Too Many Requests
```json
{
  "success": false,
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Too many username changes"
  }
}
```

---

## Endpoint: Check Username Availability

### Request
**`GET /api/v1/users/me/username/check`**

Check if a username satisfies validation rules and is available.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| username | string | Yes | Username to test |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "available": true,
  "username": "jane-filmmaker"
}
```
*Note: If `available` is false, an `error` field may explain why (e.g., "Username is already taken").*

---

## Endpoint: Get Privacy Settings

### Request
**`GET /api/v1/users/me/privacy`**

Get the current privacy configuration for the user.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "privacySettings": {
    "profileVisibility": "PUBLIC",
    "showEmail": false,
    "showPhone": false,
    "showSocialLinks": true,
    "showChapter": true,
    "showRoles": true
  }
}
```

---

## Endpoint: Update Privacy Settings

### Request
**`PATCH /api/v1/users/me/privacy`**

Modify privacy preferences.

**Authentication**: Required

#### Request Body
```json
{
  "profileVisibility": "CHAPTER_ONLY",
  "showEmail": true,
  "showPhone": false
}
```

**Field Descriptions**:
- `profileVisibility` (string): `PUBLIC`, `CHAPTER_ONLY`, `CONNECTIONS_ONLY`, or `PRIVATE`
- `showEmail` (boolean): Whether to show email to allowed viewers
- `showPhone` (boolean): Whether to show phone number
- `showSocialLinks` (boolean): Whether to show social media links
- `showChapter` (boolean): Whether to show chapter affiliation
- `showRoles` (boolean): Whether to show professional roles

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Privacy settings updated successfully",
  "privacySettings": {
    "profileVisibility": "CHAPTER_ONLY",
    "showEmail": true,
    "showPhone": false,
    "showSocialLinks": true,
    "showChapter": true,
    "showRoles": true
  }
}
```

---

## Endpoint: Get Share Link

### Request
**`GET /api/v1/users/me/share-link`**

Get a direct link to the user's public profile.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "url": "https://member.wiftafrica.org/profile/jane-doe",
  "username": "jane-doe",
  "profileSlug": "jane-doe-123"
}
```

---

## Endpoint: Upload CV

### Request
**`POST /api/v1/users/me/cv`**

Upload a CV/Resume document. Replaces existing CV.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | multipart/form-data | Yes |

#### Request Body (Multipart/Form-Data)
| Field | Type | Description |
|-------|------|-------------|
| cv | file | Document (PDF, DOC, DOCX, max 10MB) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "CV uploaded successfully",
  "cvFileName": "MyResume.pdf",
  "cvUploadedAt": "2024-01-05T12:30:00.000Z"
}
```

---

## Endpoint: Download CV

### Request
**`GET /api/v1/users/me/cv/download`**

Download the user's uploaded CV.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
- Helper triggers file download (binary content) with appropriate `Content-Type` headers (e.g., `application/pdf`).

#### Error Responses

##### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "No CV found"
  }
}
```

---

## Endpoint: Delete CV

### Request
**`DELETE /api/v1/users/me/cv`**

Remove the user's uploaded CV.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "CV deleted successfully"
}
```

---

## Endpoint: Get Public Profile (Profiles Module)

### Request
**`GET /api/v1/profiles/:identifier`**

Get the public profile of another user by their username or User ID. The amount of data returned depends on the owner's privacy settings and the viewer's relationship (same chapter, authenticated, public).

**Authentication**: Optional (supports public view)

#### Path Parameters
| Parameter | Type | description |
|-----------|------|-------------|
| identifier | string | Username (e.g., `jane-doe`) or User ID |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "profile": {
    "firstName": "Jane",
    "lastName": "Doe",
    "username": "jane-doe",
    "headline": "Award-winning Director",
    "bio": "Passionate filmmaker...",
    "primaryRole": "DIRECTOR",
    "location": "Lagos, Nigeria",
    "roles": ["DIRECTOR", "WRITER"],
    "chapter": {
      "id": "...",
      "name": "WIFT Africa HQ"
    }
    // Other fields depend on privacy settings
  }
}
```

#### Error Responses

##### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "This profile is private"
  }
}
```

##### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Profile not found"
  }
}
```
