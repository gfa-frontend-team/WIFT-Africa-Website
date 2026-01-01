## Endpoint: Get Public Profile

### Request
**`GET /api/v1/profiles/:identifier`**

Retrieve the public profile of a user by their username, profile slug, or User ID. The visibility of data depends on the profile owner's privacy settings and the viewer's relationship (Authentication status, Chapter membership).

**Authentication**: Optional

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | No |
| Content-Type | application/json | Yes |

#### Path Parameters
| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| identifier | string | Username or User ID | "jane-doe" or "65a1b..." |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "profile": {
    "_id": "usr_123456789",
    "firstName": "Jane",
    "lastName": "Doe",
    "username": "jane-doe",
    "profileSlug": "jane-doe-1234",
    "profilePhoto": "https://storage.example.com/photo.jpg",
    "headline": "Award-winning Director",
    "bio": "Passionate filmmaker with 10 years of experience...",
    "primaryRole": "DIRECTOR",
    "location": "Lagos, Nigeria",
    "availabilityStatus": "AVAILABLE",
    "roles": [
      "DIRECTOR",
      "WRITER"
    ],
    "isMultihyphenate": true,
    "writerSpecialization": "FILM",
    "chapter": {
      "_id": "676bd...",
      "name": "WIFT Africa HQ"
    },
    "website": "https://janedoe.com",
    "instagramHandle": "janedoe_films"
    // Other fields (email, phone) present only if allowed by privacy settings
  }
}
```

**Response Fields**:
- `profile.id` (string): User ID
- `profile.firstName` (string): First name
- `profile.lastName` (string): Last name
- `profile.username` (string): Unique username
- `profile.headline` (string): Professional headline
- `profile.bio` (string): Biography
- `profile.primaryRole` (string): Main role
- `profile.roles` (array string): All roles (if visible)
- `profile.location` (string): Location
- `profile.chapter` (object): Chapter affiliation (if visible)
- `profile.website` (string): Website URL (if visible)
- `profile.instagramHandle` (string): Instagram handle (if visible)
- `profile.email` (string): Email address (only if viewer is trusted/same chapter AND settings allow)

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

### Notes
- **Privacy Logic**:
  - `PUBLIC`: Visible to everyone.
  - `CHAPTER_ONLY`: Visible only to members of the same chapter.
  - `CONNECTIONS_ONLY`: Visible only to connected users (Future).
  - `PRIVATE`: Not visible to anyone except the owner.
- **Field-Level Privacy**:
  - Email, Phone, Social Links, Roles, and Chapter info are hidden based on individual boolean toggle settings (`showEmail`, `showRoles`, etc.) in the `Users` module.
