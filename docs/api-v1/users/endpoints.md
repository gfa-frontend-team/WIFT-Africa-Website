# Users API Documentation

## Endpoint: Get Current User

### Request
**`GET /api/v1/users/me`**

Get basic information about the currently authenticated user.

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
  "user": {
    "userId": "usr_123456789",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "role": "MEMBER",
    "profilePhotoUrl": "https://example.com/photo.jpg",
    "isEmailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Fields**:
- `user.userId` (string): Unique user identifier
- `user.email` (string): User's email address
- `user.firstName` (string): First name
- `user.lastName` (string): Last name
- `user.username` (string): Unique username
- `user.role` (string): User role (e.g., MEMBER, ADMIN)
- `user.profilePhotoUrl` (string): URL to profile photo
- `user.isEmailVerified` (boolean): Whether email is verified
- `user.createdAt` (string): Account creation timestamp

#### Error Responses

##### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

---

## Endpoint: Get Complete Profile

### Request
**`GET /api/v1/users/me/profile`**

Get the user's complete profile including roles, specializations, and additional details.

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
  "user": {
    "userId": "usr_123456789",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "username": "johndoe"
  },
  "profile": {
    "id": "prf_123456789",
    "bio": "Film enthusiast and producer",
    "headline": "Independent Producer",
    "location": "Nairobi, Kenya",
    "website": "https://johndoe.com",
    "imdbUrl": "https://imdb.com/name/nm1234567",
    "linkedinUrl": "https://linkedin.com/in/johndoe",
    "instagramHandle": "johndoe_film",
    "twitterHandle": "johndoe_tweets",
    "availabilityStatus": "AVAILABLE",
    "profileVisibility": "PUBLIC",
    "cvUrl": "https://example.com/cv.pdf",
    "completeness": {
      "completionPercentage": 85,
      "missingFields": ["bio", "location"],
      "isComplete": false
    }
  }
}
```

#### Error Responses

##### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

##### 404 Not Found
```json
{
  "description": "Profile not found"
}
```

---

## Endpoint: Update Profile

### Request
**`PATCH /api/v1/users/me/profile`**

Update the user's public profile information.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "bio": "New bio content...",
  "headline": "Senior Director",
  "location": "Lagos, Nigeria",
  "website": "https://newsite.com",
  "availabilityStatus": "BUSY",
  "twitterHandle": "new_handle"
}
```

**Field Descriptions**:
- `bio` (string, optional): User biography (max 1000 chars)
- `headline` (string, optional): Professional headline (max 255 chars)
- `location` (string, optional): City/Country (max 100 chars)
- `website` (string, optional): Personal website URL
- `imdbUrl` (string, optional): IMDb profile URL
- `linkedinUrl` (string, optional): LinkedIn profile URL
- `instagramHandle` (string, optional): Instagram username (max 50 chars)
- `twitterHandle` (string, optional): Twitter username (max 50 chars)
- `availabilityStatus` (string, optional): Work availability status

#### Validation Rules
- `bio`: Max 1000 characters
- `headline`: Max 255 characters
- `location`: Max 100 characters
- `website`, `imdbUrl`, `linkedinUrl`: Must be valid URLs or empty string
- `instagramHandle`, `twitterHandle`: Max 50 characters
- `availabilityStatus`: Must be one of `AVAILABLE`, `BUSY`, `NOT_LOOKING`

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "id": "prf_123456789",
  "bio": "New bio content...",
  "headline": "Senior Director",
  "location": "Lagos, Nigeria",
  "website": "https://newsite.com",
  "availabilityStatus": "BUSY",
  "updatedAt": "2024-03-15T10:30:00.000Z"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": "ZodError",
  "message": "Validation error"
}
```

##### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

---

## Endpoint: Upload Profile Photo

### Request
**`POST /api/v1/users/me/profile-photo`**

Upload a new profile photo.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | multipart/form-data | Yes |

#### Request Body
Form Data:
- `photo`: File (Required) - JPG, PNG, or WebP image (max 5MB)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Photo uploaded successfully",
  "photoUrl": "https://storage.example.com/uploads/users/photo_123.jpg"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": "No file uploaded"
}
```

##### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

---

## Endpoint: Delete Profile Photo

### Request
**`DELETE /api/v1/users/me/profile-photo`**

Remove the current profile photo and revert to default.

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
  "message": "Photo deleted successfully"
}
```

#### Error Responses

##### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

---

## Endpoint: Update Username

### Request
**`PUT /api/v1/users/me/username`**

Change the user's unique username.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "username": "new-username"
}
```

#### Validation Rules
- `username`:
  - Length: 3-30 characters
  - Pattern: Lowercase letters, numbers, and hyphens only (`^[a-z0-9-]+$`)
  - Must be unique

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Username updated successfully",
  "username": "new-username"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": "Validation error"
}
```

##### 409 Conflict
```json
{
  "error": "Username already taken"
}
```

##### 429 Too Many Requests
```json
{
  "error": "Too many username changes (max 3 per month)"
}
```

---

## Endpoint: Check Username Availability

### Request
**`GET /api/v1/users/me/username/check`**

Check if a username is available for use.

**Authentication**: Not specified (implied public or user context)

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| username | string | Yes | - | Username to check |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "available": true,
  "username": "requested-username"
}
```
OR
```json
{
  "available": false,
  "username": "requested-username",
  "error": "Username is already taken"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": "Username is required"
}
```

---

## Endpoint: Get Username Suggestions

### Request
**`GET /api/v1/users/me/username/suggestions`**

Get a list of available username suggestions based on the user's name.

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
  "suggestions": [
    "johndoe123",
    "john-doe-official",
    "thejohndoe"
  ]
}
```

---

## Endpoint: Get Privacy Settings

### Request
**`GET /api/v1/users/me/privacy`**

Get the user's current privacy configuration.

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

Update the user's privacy settings.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "profileVisibility": "CONNECTIONS_ONLY",
  "showEmail": false,
  "showPhone": false
}
```

**Field Descriptions**:
- `profileVisibility` (string, optional): Who can view the profile
- `showEmail` (boolean, optional): Whether to display email publicly
- `showPhone` (boolean, optional): Whether to display phone publicly
- `showSocialLinks` (boolean, optional): Whether to display social links
- `showChapter` (boolean, optional): Whether to display chapter affiliation
- `showRoles` (boolean, optional): Whether to display roles

#### Validation Rules
- `profileVisibility`: Must be one of `PUBLIC`, `CHAPTER_ONLY`, `CONNECTIONS_ONLY`, `PRIVATE`

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Privacy settings updated successfully",
  "privacySettings": {
    "profileVisibility": "CONNECTIONS_ONLY",
    "showEmail": false,
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

Get a direct link to share the user's profile.

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
  "url": "https://app.example.com/in/johndoe",
  "username": "johndoe",
  "profileSlug": "johndoe"
}
```

---

## Endpoint: Upload CV

### Request
**`POST /api/v1/users/me/cv`**

Upload a CV or Resume document.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | multipart/form-data | Yes |

#### Request Body
Form Data:
- `cv`: File (Required) - PDF, DOC, or DOCX (max 10MB)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "CV uploaded successfully",
  "cvFileName": "john-doe-resume.pdf",
  "cvUploadedAt": "2024-03-15T10:30:00.000Z"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": "No file uploaded"
}
```

---

## Endpoint: Delete CV

### Request
**`DELETE /api/v1/users/me/cv`**

Delete the currently stored CV.

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
  "message": "CV deleted successfully"
}
```

#### Error Responses

##### 404 Not Found
```json
{
  "error": "No CV found"
}
```

---

## Endpoint: Download CV

### Request
**`GET /api/v1/users/me/cv/download`**

Download the user's stored CV file.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |

### Response

#### Success Response

**Status Code**: `200 OK`
**Content-Type**: `application/pdf`, `application/msword`, or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

(Binary File Content)

#### Error Responses

##### 404 Not Found
```json
{
  "error": "CV not found"
}
```

### Notes
- Profile updates are partial updates; only provided fields will be changed.
- Username changes may have rate limits applied (e.g., 3 times per month).
- File uploads have size limits: Profile Photo (5MB), CV (10MB).
