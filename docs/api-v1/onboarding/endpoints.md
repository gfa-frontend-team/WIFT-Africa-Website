## Endpoint: Get Onboarding Progress

### Request
**`GET /api/v1/onboarding/progress`**

Retrieve the current state of the user's onboarding journey, including completed steps and saved data.

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
  "currentStep": 3,
  "isComplete": false,
  "emailVerified": true,
  "steps": {
    "roleSelection": true,
    "specialization": true,
    "chapterSelection": false,
    "profileSetup": false,
    "termsAccepted": false
  },
  "data": {
    "roles": ["DIRECTOR", "WRITER"],
    "primaryRole": "DIRECTOR",
    "specializations": {
      "writer": "FILM",
      "crew": [],
      "business": []
    },
    "chapterId": null,
    "membershipStatus": "PENDING"
  }
}
```

**Response Fields**:
- `currentStep` (number): The currentactive step (1-5)
- `isComplete` (boolean): Whether onboarding is fully finished
- `emailVerified` (boolean): Verification status of user's email
- `steps` (object): detailed completion status of each step
- `data` (object): Summary of data saved so far

#### Error Responses

##### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized"
  }
}
```

---

## Endpoint: Submit Role Selection (Step 1)

### Request
**`POST /api/v1/onboarding/roles`**

Save the user's roles and primary role. This is the first step of onboarding.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "roles": ["DIRECTOR", "WRITER"],
  "primaryRole": "DIRECTOR"
}
```

**Field Descriptions**:
- `roles` (array of strings, required): List of roles the user identifies with. Allowed values: `PRODUCER`, `DIRECTOR`, `WRITER`, `ACTRESS`, `CREW`, `BUSINESS`.
- `primaryRole` (string, required): The main role associated with the profile. Must be one of the selected `roles`.

#### Validation Rules
- `roles`: Must be a non-empty array of valid Role enums
- `primaryRole`: Must be present in the `roles` array

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Roles saved successfully",
  "nextStep": 2,
  "needsSpecialization": true
}
```

**Response Fields**:
- `message` (string): Success message
- `nextStep` (number): The number of the next step to navigate to
- `needsSpecialization` (boolean): `true` if selected roles require further specialization (Writer, Crew, Business)

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Primary role must be one of the selected roles"
  }
}
```

---

## Endpoint: Submit Specializations (Step 2)

### Request
**`POST /api/v1/onboarding/specializations`**

Save detailed specializations for Writer, Crew, or Business roles. Required only if these roles were selected in Step 1.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "writerSpecialization": "FILM",
  "crewSpecializations": ["CINEMATOGRAPHER"],
  "businessSpecializations": ["FINANCE"]
}
```

**Field Descriptions**:
- `writerSpecialization` (string, optional): Required if `WRITER` role selected. Values: `TV`, `FILM`, `BOTH`.
- `crewSpecializations` (array of strings, optional): Required if `CREW` role selected. Values: `CINEMATOGRAPHER`, `EDITOR`, `COMPOSER`, `SOUND_DESIGNER`, `PRODUCTION_DESIGNER`, `COSTUME_DESIGNER`, `MAKEUP_ARTIST`, `GAFFER`.
- `businessSpecializations` (array of strings, optional): Required if `BUSINESS` role selected. Values: `ENTERTAINMENT_LAW`, `DISTRIBUTION`, `FINANCE`, `MARKETING`, `REPRESENTATION`, `PUBLIC_RELATIONS`.

#### Validation Rules
- Fields are required conditionally based on the roles selected in Step 1.

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Specializations saved successfully",
  "nextStep": 3
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Writer specialization is required"
  }
}
```

---

## Endpoint: Get Available Chapters (Step 3)

### Request
**`GET /api/v1/onboarding/chapters`**

Fetch a list of all active chapters that a user can join.

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
  "chapters": [
    {
      "id": "676ac5...",
      "name": "WIFT Africa HQ",
      "code": "HQ",
      "country": "South Africa",
      "description": "The headquarters chapter.",
      "memberCount": 150,
      "requiresApproval": false
    },
    {
      "id": "676bd2...",
      "name": "WIFT Nigeria",
      "code": "NG",
      "country": "Nigeria",
      "description": "Nigeria chapter...",
      "memberCount": 45,
      "requiresApproval": true
    }
  ]
}
```

---

## Endpoint: Select Chapter (Step 3)

### Request
**`POST /api/v1/onboarding/chapter`**

Select a chapter to join. For new members, this might trigger an approval request.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "chapterId": "676ac5...",
  "memberType": "NEW",
  "membershipId": "WIFT-123",
  "phoneNumber": "+1234567890",
  "additionalInfo": "Returning member"
}
```

**Field Descriptions**:
- `chapterId` (string, required): ID of the selected chapter
- `memberType` (string, required): `NEW` or `EXISTING`
- `membershipId` (string, optional): Required if `memberType` is `EXISTING`.
- `phoneNumber` (string, optional): Contact number
- `additionalInfo` (string, optional): Max 500 chars

#### Validation Rules
- `membershipId` is strictly required if `memberType` is `EXISTING`.

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "You have joined WIFT Africa HQ with full access",
  "nextStep": 4,
  "requiresApproval": false,
  "membershipStatus": "APPROVED",
  "expectedReviewDate": null
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Membership ID is required for existing members"
  }
}
```

---

## Endpoint: Setup Profile (Step 4)

### Request
**`POST /api/v1/onboarding/profile`**

Update user profile details and optionally upload a CV/Resume.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | multipart/form-data | Yes |

#### Request Body (Multipart/Form-Data)
| Field | Type | Description |
|-------|------|-------------|
| displayName | string | Public display name (max 100 chars) |
| bio | string | User bio (max 1000 chars) |
| headline | string | Professional headline (max 255 chars) |
| location | string | City/Country (max 100 chars) |
| website | string | Personal website URL |
| imdbUrl | string | IMDb profile URL |
| linkedinUrl | string | LinkedIn profile URL |
| instagramHandle | string | Instagram username |
| twitterHandle | string | Twitter handle |
| availabilityStatus | string | `AVAILABLE`, `BUSY`, or `NOT_LOOKING` |
| cv | file | Optional CV file (PDF, DOC/DOCX, max 10MB) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Profile and CV updated successfully",
  "nextStep": 5,
  "cvUploaded": true
}
```

---

## Endpoint: Accept Terms & Complete (Step 5)

### Request
**`POST /api/v1/onboarding/accept-terms`**

Final step to accept terms and complete the onboarding process.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
*None* (Empty object)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Onboarding completed successfully! Welcome to WIFT Africa.",
  "onboardingComplete": true,
  "membershipStatus": "APPROVED"
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Please complete previous steps first"
  }
}
```
