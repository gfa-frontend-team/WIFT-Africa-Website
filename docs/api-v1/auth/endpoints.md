## Endpoint: Register User

### Request
**`POST /api/v1/auth/register`**

Register a new user account with email and password. Triggers a verification email.

**Authentication**: Not Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "email": "jane.doe@example.com",
  "password": "Password123!",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Field Descriptions**:
- `email` (string, required): Valid email address
- `password` (string, required): User's password
- `firstName` (string, required): First name of the user
- `lastName` (string, required): Last name of the user

#### Validation Rules
- `email`: Must be a valid email format
- `password`: Must be at least 8 characters
- `firstName`: Must be between 2 and 50 characters
- `lastName`: Must be between 2 and 50 characters

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "_id": "676ac5...",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe"
  }
}
```

**Response Fields**:
- `message` (string): Success message
- `user.id` (string): Unique user identifier
- `user.email` (string): Registered email
- `user.firstName` (string): First name
- `user.lastName` (string): Last name

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ]
  }
}
```

##### 409 Conflict
```json
{
  "success": false,
  "error": {
    "code": "CONFLICT",
    "message": "Email already registered"
  }
}
```

##### 500 Internal Server Error
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

### Notes
- A verification email is sent immediately after successful registration.
- The user cannot log in until they verify their email.

---

## Endpoint: Login

### Request
**`POST /api/v1/auth/login`**

Authenticate a user with email and password to receive access tokens.

**Authentication**: Not Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "email": "jane.doe@example.com",
  "password": "Password123!"
}
```

**Field Descriptions**:
- `email` (string, required): Registered email address
- `password` (string, required): Account password

#### Validation Rules
- `email`: Must be a valid email format
- `password`: Required (min 1 character)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Login successful",
  "user": {
    "_id": "676ac5...",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "emailVerified": true,
    "onboardingComplete": false,
    "onboardingStep": 1
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response Fields**:
- `message` (string): Success message
- `user` (object): User profile details
- `tokens.accessToken` (string): Short-lived JWT for API access
- `tokens.refreshToken` (string): Long-lived token to refresh access token

#### Error Responses

##### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid email or password"
  }
}
```

##### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Please verify your email before logging in"
  }
}
```

---

## Endpoint: Google Authentication

### Request
**`POST /api/v1/auth/google`**

Login or register using a Google ID token.

**Authentication**: Not Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIs..."
}
```

**Field Descriptions**:
- `idToken` (string, required): JWT ID token received from Google Identity Services

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Google authentication successful",
  "user": {
    "_id": "676ac5...",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "emailVerified": true,
    "onboardingComplete": false,
    "onboardingStep": 1
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Response Fields**:
- `message` (string): Success message
- `user` (object): User profile details
- `tokens` (object): Pair of access and refresh tokens

#### Error Responses

##### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid Google token"
  }
}
```

---

## Endpoint: Verify Email

### Request
**`POST /api/v1/auth/verify-email`**

Verify a user's email address using the token sent via email.

**Authentication**: Not Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "token": "7bdd3e5d..."
}
```

**Field Descriptions**:
- `token` (string, required): Verification token from the email link

#### Validation Rules
- `token`: Required (min 1 character)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Email verified successfully",
  "user": {
    "_id": "676ac5...",
    "email": "jane.doe@example.com",
    "emailVerified": true
  }
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid or expired verification token"
  }
}
```

---

## Endpoint: Refresh Tokens

### Request
**`POST /api/v1/auth/refresh`**

Obtain a new access token using a valid refresh token.

**Authentication**: Not Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Field Descriptions**:
- `refreshToken` (string, required): The refresh token issued during login

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Tokens refreshed successfully",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### Error Responses

##### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid refresh token"
  }
}
```

---

## Endpoint: Request Password Reset

### Request
**`POST /api/v1/auth/forgot-password`**

Initiate the password reset process by sending an email with a reset token.

**Authentication**: Not Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "email": "jane.doe@example.com"
}
```

**Field Descriptions**:
- `email` (string, required): The email address of the account to reset

#### Validation Rules
- `email`: Must be a valid email format

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "If the email exists, a password reset link has been sent"
}
```

### Notes
- This endpoint always returns 200 OK even if the email doesn't exist to prevent email enumeration.

---

## Endpoint: Reset Password

### Request
**`POST /api/v1/auth/reset-password`**

Set a new password using a valid reset token.

**Authentication**: Not Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "token": "a1b2c3d4...",
  "newPassword": "NewPassword123!"
}
```

**Field Descriptions**:
- `token` (string, required): The reset token from the email
- `newPassword` (string, required): The new password to set

#### Validation Rules
- `token`: Required
- `newPassword`: Must be at least 8 characters

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Password reset successful. Please login with your new password."
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Invalid or expired reset token"
  }
}
```


---

## Endpoint: Change Password

### Request
**`POST /api/v1/auth/change-password`**

Change the password for the currently authenticated user.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!"
}
```

**Field Descriptions**:
- `currentPassword` (string, required): The user's current password
- `newPassword` (string, required): The new password to set

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Password changed successfully"
}
```

#### Error Responses

##### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Unauthorized or incorrect current password"
  }
}
```

---

## Endpoint: Check Email Availability

### Request
**`GET /api/v1/auth/check-email`**

Check if an email address is already registered in the system.

**Authentication**: Not Required

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| email | string | Yes | - | Email address to check |

#### Validation Rules
- `email`: Must be a valid email format

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "exists": true
}
```

**Response Fields**:
- `exists` (boolean): `true` if email is already registered, `false` otherwise

---

## Endpoint: Logout

### Request
**`POST /api/v1/auth/logout`**

Logout by invalidating the refresh token.

**Authentication**: Required

#### Headers
| Header | Value | Required |
|--------|-------|----------|
| Authorization | Bearer \<token\> | Yes |
| Content-Type | application/json | Yes |

#### Request Body
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Field Descriptions**:
- `refreshToken` (string, required): The refresh token to invalidate

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Logout successful"
}
```

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
