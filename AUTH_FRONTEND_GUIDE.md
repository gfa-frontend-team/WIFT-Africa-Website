# Authentication System - Complete Frontend Development Guide

**Version:** 1.0  
**Last Updated:** February 10, 2026  
**Base URL:** `/api/v1/auth`

---

## Table of Contents

1. [Overview](#overview)
2. [Data Models](#data-models)
3. [Authentication Flows](#authentication-flows)
4. [API Reference](#api-reference)
5. [State Management](#state-management)
6. [UI/UX Guidelines](#uiux-guidelines)
7. [Error Handling](#error-handling)
8. [Security Best Practices](#security-best-practices)

---

## Overview

The WIFT Africa authentication system provides secure user registration, login, email verification, password management, and Google OAuth integration with role-based access control.

### Key Features

- ✅ Email/password registration and login
- ✅ Google OAuth authentication
- ✅ Email verification workflow
- ✅ Password reset functionality
- ✅ JWT token-based authentication
- ✅ Token refresh mechanism
- ✅ Role-based access control (4 account types)
- ✅ Onboarding system

---

## Data Models

### User

```typescript
interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
  username?: string;
  profileSlug: string;
  
  // Authentication
  authProvider: "LOCAL" | "GOOGLE" | "LINKEDIN";
  emailVerified: boolean;
  
  // Account
  accountType: "CHAPTER_MEMBER" | "HQ_MEMBER" | "CHAPTER_ADMIN" | "SUPER_ADMIN";
  membershipStatus: "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED";
  
  // Onboarding
  onboardingComplete: boolean;
  onboardingStep: number;
  termsAccepted: boolean;
  
  // Chapter
  chapterId?: string;
  memberType?: "NEW" | "EXISTING";
  
  // Privacy
  privacySettings: {
    profileVisibility: "PUBLIC" | "CHAPTER_ONLY" | "CONNECTIONS_ONLY" | "PRIVATE";
    showEmail: boolean;
    showPhone: boolean;
    showSocialLinks: boolean;
    showChapter: boolean;
    showRoles: boolean;
  };
  
  // Timestamps
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Auth Response

```typescript
interface AuthResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    emailVerified: boolean;
    onboardingComplete: boolean;
    onboardingStep: number;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}
```

### Account Types (Roles)

| Role | Description | Permissions |
|------|-------------|-------------|
| `CHAPTER_MEMBER` | Regular member | View content, apply for opportunities |
| `HQ_MEMBER` | Headquarters member | Same as chapter member |
| `CHAPTER_ADMIN` | Chapter administrator | Manage chapter content, approve members |
| `SUPER_ADMIN` | System administrator | Full system access |

### Membership Status

| Status | Description | Can Login? |
|--------|-------------|------------|
| `PENDING` | Awaiting approval | Yes (limited access) |
| `APPROVED` | Active member | Yes (full access) |
| `REJECTED` | Application rejected | No |
| `SUSPENDED` | Account suspended | No |

---

## Authentication Flows

### 1. Registration Flow

```
User fills form → Submit → Backend validates → Create user → Send verification email
                                                                      ↓
User clicks link in email → Verify token → Mark email as verified → Redirect to login
```

### 2. Login Flow

```
User enters credentials → Submit → Backend validates → Check email verified
                                                              ↓
                                                        Generate tokens
                                                              ↓
                                                    Store tokens in client
                                                              ↓
                                                    Redirect to dashboard/onboarding
```

### 3. Google OAuth Flow

```
User clicks "Sign in with Google" → Google popup → User authorizes
                                                          ↓
                                                    Google returns token
                                                          ↓
                                            Send token to backend → Verify with Google
                                                          ↓
                                            Find/create user → Generate tokens
                                                          ↓
                                                Return tokens to client
                                                          ↓
                                            Redirect to dashboard/onboarding
```

### 4. Password Reset Flow

```
User clicks "Forgot password" → Enter email → Submit → Backend sends reset email
                                                              ↓
User clicks link in email → Redirect to reset page → Enter new password
                                                              ↓
                                                    Submit → Backend validates token
                                                              ↓
                                                    Update password → Redirect to login
```

### 5. Token Refresh Flow

```
Access token expires → API returns 401 → Frontend intercepts
                                              ↓
                                    Send refresh token to /auth/refresh
                                              ↓
                                    Receive new access + refresh tokens
                                              ↓
                                    Update stored tokens → Retry original request
```

---

## API Reference

### 1. Register

**Endpoint:** `POST /api/v1/auth/register`  
**Auth Required:** No

#### Request Body

```typescript
{
  email: string;        // Required, valid email format
  password: string;     // Required, min 8 characters
  firstName: string;    // Required, min 2 characters, max 50
  lastName: string;     // Required, min 2 characters, max 50
}
```

#### Example Request

```bash
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "jane.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

#### Success Response (201)

```json
{
  "message": "Registration successful. Please check your email to verify your account.",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe"
  }
}
```

#### Error Responses

```json
// 400 - Validation Error
{
  "error": "Password must be at least 8 characters"
}

// 409 - Email Already Exists
{
  "error": "Email already registered"
}
```

#### Frontend Implementation

```typescript
async function register(data: RegisterData) {
  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const result = await response.json();
    
    // Show success message
    showNotification('success', result.message);
    
    // Redirect to verification pending page
    router.push('/auth/verify-email-sent');
    
  } catch (error) {
    showNotification('error', error.message);
  }
}
```

#### UI Components

**Registration Form:**
```
┌─────────────────────────────────────────┐
│ Create Your Account                     │
├─────────────────────────────────────────┤
│ First Name                              │
│ ┌─────────────────────────────────────┐ │
│ │ Jane                                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Last Name                               │
│ ┌─────────────────────────────────────┐ │
│ │ Doe                                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Email                                   │
│ ┌─────────────────────────────────────┐ │
│ │ jane.doe@example.com                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Password                                │
│ ┌─────────────────────────────────────┐ │
│ │ ••••••••••••                        │ │
│ └─────────────────────────────────────┘ │
│ ✓ At least 8 characters                │
│                                         │
│ [Create Account]                        │
│                                         │
│ ─────────── OR ───────────              │
│                                         │
│ [🔵 Continue with Google]               │
│                                         │
│ Already have an account? [Sign In]     │
└─────────────────────────────────────────┘
```

---

### 2. Login

**Endpoint:** `POST /api/v1/auth/login`  
**Auth Required:** No

#### Request Body

```typescript
{
  email: string;        // Required, valid email format
  password: string;     // Required
}
```

#### Example Request

```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "jane.doe@example.com",
  "password": "SecurePass123!"
}
```

#### Success Response (200)

```json
{
  "message": "Login successful",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "jane.doe@example.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "emailVerified": true,
    "onboardingComplete": false,
    "onboardingStep": 2
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

```json
// 401 - Invalid Credentials
{
  "error": "Invalid email or password"
}

// 403 - Email Not Verified
{
  "error": "Please verify your email before logging in"
}
```

#### Frontend Implementation

```typescript
async function login(email: string, password: string) {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const { user, tokens } = await response.json();
    
    // Store tokens
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    
    // Store user data
    localStorage.setItem('user', JSON.stringify(user));
    
    // Redirect based on onboarding status
    if (!user.onboardingComplete) {
      router.push(`/onboarding/step-${user.onboardingStep}`);
    } else {
      router.push('/dashboard');
    }
    
  } catch (error) {
    showNotification('error', error.message);
  }
}
```

#### UI Components

**Login Form:**
```
┌─────────────────────────────────────────┐
│ Welcome Back                            │
├─────────────────────────────────────────┤
│ Email                                   │
│ ┌─────────────────────────────────────┐ │
│ │ jane.doe@example.com                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Password                                │
│ ┌─────────────────────────────────────┐ │
│ │ ••••••••••••                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Forgot password?]                      │
│                                         │
│ [Sign In]                               │
│                                         │
│ ─────────── OR ───────────              │
│                                         │
│ [🔵 Continue with Google]               │
│                                         │
│ Don't have an account? [Sign Up]       │
└─────────────────────────────────────────┘
```

---

### 3. Google OAuth

**Endpoint:** `POST /api/v1/auth/google`  
**Auth Required:** No

#### Request Body

```typescript
{
  idToken: string;  // Google ID token from OAuth flow
}
```

#### Example Request

```bash
POST /api/v1/auth/google
Content-Type: application/json

{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjE4MmU0..."
}
```

#### Success Response (200)

```json
{
  "message": "Google authentication successful",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "jane.doe@gmail.com",
    "firstName": "Jane",
    "lastName": "Doe",
    "emailVerified": true,
    "onboardingComplete": false,
    "onboardingStep": 1
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Frontend Implementation

```typescript
// Using @react-oauth/google or similar
import { GoogleLogin } from '@react-oauth/google';

function GoogleAuthButton() {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('/api/v1/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: credentialResponse.credential })
      });
      
      if (!response.ok) {
        throw new Error('Google authentication failed');
      }
      
      const { user, tokens } = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect
      if (!user.onboardingComplete) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
      
    } catch (error) {
      showNotification('error', error.message);
    }
  };
  
  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => showNotification('error', 'Google sign-in failed')}
    />
  );
}
```

---

### 4. Verify Email

**Endpoint:** `POST /api/v1/auth/verify-email`  
**Auth Required:** No

#### Request Body

```typescript
{
  token: string;  // Verification token from email link
}
```

#### Example Request

```bash
POST /api/v1/auth/verify-email
Content-Type: application/json

{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
}
```

#### Success Response (200)

```json
{
  "message": "Email verified successfully",
  "user": {
    "id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "email": "jane.doe@example.com",
    "emailVerified": true
  }
}
```

#### Error Responses

```json
// 400 - Invalid or Expired Token
{
  "error": "Invalid or expired verification token"
}
```

#### Frontend Implementation

```typescript
// Email verification page (e.g., /verify-email?token=xxx)
async function verifyEmail(token: string) {
  try {
    const response = await fetch('/api/v1/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const result = await response.json();
    
    // Show success message
    showNotification('success', 'Email verified! You can now log in.');
    
    // Redirect to login
    setTimeout(() => router.push('/login'), 2000);
    
  } catch (error) {
    showNotification('error', error.message);
  }
}

// Usage in component
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (token) {
    verifyEmail(token);
  }
}, []);
```

#### UI Components

**Verification Success:**
```
┌─────────────────────────────────────────┐
│ ✅ Email Verified!                      │
├─────────────────────────────────────────┤
│ Your email has been successfully        │
│ verified. You can now log in to your    │
│ account.                                │
│                                         │
│ Redirecting to login...                 │
│                                         │
│ [Go to Login]                           │
└─────────────────────────────────────────┘
```

---

### 5. Refresh Tokens

**Endpoint:** `POST /api/v1/auth/refresh`  
**Auth Required:** No

#### Request Body

```typescript
{
  refreshToken: string;  // Current refresh token
}
```

#### Example Request

```bash
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Success Response (200)

```json
{
  "message": "Tokens refreshed successfully",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Error Responses

```json
// 401 - Invalid or Expired Refresh Token
{
  "error": "Invalid refresh token"
}
```

#### Frontend Implementation

```typescript
// Axios interceptor for automatic token refresh
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1'
});

// Request interceptor - add access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }
        
        // Request new tokens
        const response = await fetch('/api/v1/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });
        
        if (!response.ok) {
          throw new Error('Token refresh failed');
        }
        
        const { tokens } = await response.json();
        
        // Update stored tokens
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

---

### 6. Logout

**Endpoint:** `POST /api/v1/auth/logout`  
**Auth Required:** Yes

#### Request Headers

```
Authorization: Bearer <accessToken>
```

#### Request Body

```typescript
{
  refreshToken: string;  // Current refresh token
}
```

#### Example Request

```bash
POST /api/v1/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Success Response (200)

```json
{
  "message": "Logout successful"
}
```

#### Frontend Implementation

```typescript
async function logout() {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ refreshToken })
      });
    }
    
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local storage regardless of API response
    localStorage.clear();
    
    // Redirect to login
    router.push('/login');
  }
}
```

---

### 7. Forgot Password

**Endpoint:** `POST /api/v1/auth/forgot-password`  
**Auth Required:** No

#### Request Body

```typescript
{
  email: string;  // User's email address
}
```

#### Example Request

```bash
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "jane.doe@example.com"
}
```

#### Success Response (200)

```json
{
  "message": "If the email exists, a password reset link has been sent"
}
```

**Note:** Always returns success to prevent email enumeration.

#### Frontend Implementation

```typescript
async function requestPasswordReset(email: string) {
  try {
    const response = await fetch('/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    
    const result = await response.json();
    
    // Show success message
    showNotification('success', result.message);
    
    // Show email sent confirmation
    setShowEmailSentMessage(true);
    
  } catch (error) {
    showNotification('error', 'Something went wrong. Please try again.');
  }
}
```

#### UI Components

**Forgot Password Form:**
```
┌─────────────────────────────────────────┐
│ Reset Your Password                     │
├─────────────────────────────────────────┤
│ Enter your email address and we'll     │
│ send you a link to reset your password.│
│                                         │
│ Email                                   │
│ ┌─────────────────────────────────────┐ │
│ │ jane.doe@example.com                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Send Reset Link]                       │
│                                         │
│ [← Back to Login]                       │
└─────────────────────────────────────────┘
```

**Email Sent Confirmation:**
```
┌─────────────────────────────────────────┐
│ ✉️ Check Your Email                     │
├─────────────────────────────────────────┤
│ If an account exists with that email,  │
│ we've sent password reset instructions.│
│                                         │
│ Didn't receive the email?               │
│ • Check your spam folder                │
│ • Make sure you entered the correct     │
│   email address                         │
│                                         │
│ [Resend Email] [Back to Login]          │
└─────────────────────────────────────────┘
```

---

### 8. Reset Password

**Endpoint:** `POST /api/v1/auth/reset-password`  
**Auth Required:** No

#### Request Body

```typescript
{
  token: string;        // Reset token from email link
  newPassword: string;  // New password (min 8 characters)
}
```

#### Example Request

```bash
POST /api/v1/auth/reset-password
Content-Type: application/json

{
  "token": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "newPassword": "NewSecurePass123!"
}
```

#### Success Response (200)

```json
{
  "message": "Password reset successful. Please login with your new password."
}
```

#### Error Responses

```json
// 400 - Invalid or Expired Token
{
  "error": "Invalid or expired reset token"
}

// 400 - Weak Password
{
  "error": "Password must be at least 8 characters"
}
```

#### Frontend Implementation

```typescript
async function resetPassword(token: string, newPassword: string) {
  try {
    const response = await fetch('/api/v1/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const result = await response.json();
    
    // Show success message
    showNotification('success', result.message);
    
    // Redirect to login
    setTimeout(() => router.push('/login'), 2000);
    
  } catch (error) {
    showNotification('error', error.message);
  }
}
```

#### UI Components

**Reset Password Form:**
```
┌─────────────────────────────────────────┐
│ Create New Password                     │
├─────────────────────────────────────────┤
│ New Password                            │
│ ┌─────────────────────────────────────┐ │
│ │ ••••••••••••                        │ │
│ └─────────────────────────────────────┘ │
│ ✓ At least 8 characters                │
│                                         │
│ Confirm Password                        │
│ ┌─────────────────────────────────────┐ │
│ │ ••••••••••••                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Reset Password]                        │
└─────────────────────────────────────────┘
```

---

### 9. Change Password

**Endpoint:** `POST /api/v1/auth/change-password`  
**Auth Required:** Yes

#### Request Headers

```
Authorization: Bearer <accessToken>
```

#### Request Body

```typescript
{
  currentPassword: string;  // Current password
  newPassword: string;      // New password (min 8 characters)
}
```

#### Example Request

```bash
POST /api/v1/auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewSecurePass123!"
}
```

#### Success Response (200)

```json
{
  "message": "Password changed successfully"
}
```

**Note:** All sessions are invalidated after password change (user must re-login on all devices).

#### Error Responses

```json
// 401 - Incorrect Current Password
{
  "error": "Current password is incorrect"
}

// 400 - Password Reuse
{
  "error": "New password must be different from current password"
}
```

#### Frontend Implementation

```typescript
async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const accessToken = localStorage.getItem('accessToken');
    
    const response = await fetch('/api/v1/auth/change-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ currentPassword, newPassword })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    
    const result = await response.json();
    
    // Show success message
    showNotification('success', result.message);
    
    // Clear tokens (user will be logged out)
    localStorage.clear();
    
    // Redirect to login
    setTimeout(() => router.push('/login'), 2000);
    
  } catch (error) {
    showNotification('error', error.message);
  }
}
```

---

### 10. Check Email Availability

**Endpoint:** `GET /api/v1/auth/check-email`  
**Auth Required:** No

#### Query Parameters

```
?email=jane.doe@example.com
```

#### Example Request

```bash
GET /api/v1/auth/check-email?email=jane.doe@example.com
```

#### Success Response (200)

```json
{
  "exists": true
}
```

#### Frontend Implementation

```typescript
// Debounced email check
import { debounce } from 'lodash';

const checkEmailAvailability = debounce(async (email: string) => {
  if (!email || !isValidEmail(email)) return;
  
  try {
    const response = await fetch(
      `/api/v1/auth/check-email?email=${encodeURIComponent(email)}`
    );
    
    const { exists } = await response.json();
    
    if (exists) {
      setEmailError('This email is already registered');
    } else {
      setEmailError(null);
    }
    
  } catch (error) {
    console.error('Email check failed:', error);
  }
}, 500);

// Usage in form
<input
  type="email"
  value={email}
  onChange={(e) => {
    setEmail(e.target.value);
    checkEmailAvailability(e.target.value);
  }}
/>
```

---

## State Management

### Recommended State Structure

```typescript
interface AuthState {
  // User data
  user: User | null;
  isAuthenticated: boolean;
  
  // Tokens
  accessToken: string | null;
  refreshToken: string | null;
  
  // UI state
  loading: boolean;
  error: string | null;
  
  // Onboarding
  onboardingStep: number;
  onboardingComplete: boolean;
}
```

### Actions

```typescript
// Auth actions
login(email, password)
loginWithGoogle(idToken)
register(data)
logout()
verifyEmail(token)
refreshTokens()

// Password actions
requestPasswordReset(email)
resetPassword(token, newPassword)
changePassword(currentPassword, newPassword)

// User actions
updateUser(data)
checkEmailExists(email)
```

### Example: Redux Toolkit

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: LoginData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error);
      }
      
      return await response.json();
    } catch (error) {
      return rejectWithValue('Network error');
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.clear();
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.tokens.accessToken;
        state.refreshToken = action.payload.tokens.refreshToken;
        state.isAuthenticated = true;
        
        // Persist to localStorage
        localStorage.setItem('accessToken', action.payload.tokens.accessToken);
        localStorage.setItem('refreshToken', action.payload.tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { logout, setTokens } = authSlice.actions;
export default authSlice.reducer;
```

---

## UI/UX Guidelines

### Design Principles

1. **Clear Feedback**
   - Show loading states during API calls
   - Display success/error messages
   - Validate inputs in real-time

2. **Security Visibility**
   - Show password strength indicator
   - Display password requirements
   - Confirm password changes

3. **Accessibility**
   - Use semantic HTML
   - Provide ARIA labels
   - Support keyboard navigation
   - Maintain color contrast

4. **Mobile-First**
   - Responsive layouts
   - Touch-friendly buttons (min 44x44px)
   - Optimized for small screens

### Password Strength Indicator

```typescript
function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return { score, label: 'Weak', color: 'red' };
  if (score <= 3) return { score, label: 'Fair', color: 'orange' };
  if (score <= 4) return { score, label: 'Good', color: 'yellow' };
  return { score, label: 'Strong', color: 'green' };
}
```

### Form Validation

```typescript
const validationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters'
    }
  },
  firstName: {
    required: 'First name is required',
    minLength: {
      value: 2,
      message: 'First name must be at least 2 characters'
    },
    maxLength: {
      value: 50,
      message: 'First name must be less than 50 characters'
    }
  }
};
```

---

## Error Handling

### Error Types

| Status Code | Meaning | User Message |
|-------------|---------|--------------|
| 400 | Bad Request | "Please check your input and try again" |
| 401 | Unauthorized | "Invalid credentials" |
| 403 | Forbidden | "Please verify your email to continue" |
| 404 | Not Found | "User not found" |
| 409 | Conflict | "Email already registered" |
| 500 | Server Error | "Something went wrong. Please try again later" |

### Error Display Component

```typescript
function ErrorMessage({ error }: { error: string | null }) {
  if (!error) return null;
  
  return (
    <div className="error-message" role="alert">
      <span className="error-icon">⚠️</span>
      <span>{error}</span>
    </div>
  );
}
```

---

## Security Best Practices

### 1. Token Storage

**DO:**
- ✅ Store tokens in `localStorage` or `sessionStorage`
- ✅ Clear tokens on logout
- ✅ Implement automatic token refresh

**DON'T:**
- ❌ Store tokens in cookies (unless httpOnly)
- ❌ Expose tokens in URLs
- ❌ Log tokens to console in production

### 2. Password Handling

**DO:**
- ✅ Validate password strength client-side
- ✅ Show password requirements
- ✅ Implement "show password" toggle
- ✅ Clear password fields after submission

**DON'T:**
- ❌ Store passwords in state longer than necessary
- ❌ Log passwords
- ❌ Auto-fill passwords without user consent

### 3. HTTPS Only

**Always use HTTPS in production** to prevent token interception.

### 4. XSS Protection

```typescript
// Sanitize user input before rendering
import DOMPurify from 'dompurify';

function SafeUserContent({ content }: { content: string }) {
  const sanitized = DOMPurify.sanitize(content);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### 5. CSRF Protection

```typescript
// Include CSRF token in requests (if implemented)
const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;

fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken
  },
  body: JSON.stringify(data)
});
```

---

## Complete Authentication Flow Example

### React + TypeScript Implementation

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      
      const { user, tokens } = await response.json();
      
      // Store tokens
      localStorage.setItem('accessToken', tokens.accessToken);
      localStorage.setItem('refreshToken', tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Redirect based on onboarding
      if (!user.onboardingComplete) {
        navigate(`/onboarding/step-${user.onboardingStep}`);
      } else {
        navigate('/dashboard');
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      <h1>Welcome Back</h1>
      
      {error && <ErrorMessage error={error} />}
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
      
      <a href="/forgot-password">Forgot password?</a>
    </form>
  );
}
```

---

## Testing Checklist

### Authentication Flow
- [ ] Register new user
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Login with unverified email
- [ ] Google OAuth login
- [ ] Verify email with valid token
- [ ] Verify email with expired token
- [ ] Logout

### Password Management
- [ ] Request password reset
- [ ] Reset password with valid token
- [ ] Reset password with expired token
- [ ] Change password (authenticated)
- [ ] Prevent password reuse

### Token Management
- [ ] Access token expires and auto-refreshes
- [ ] Refresh token expires and redirects to login
- [ ] Logout invalidates tokens

### Edge Cases
- [ ] Network errors handled gracefully
- [ ] Concurrent requests don't cause issues
- [ ] Token refresh race conditions handled
- [ ] Multiple tabs/windows sync auth state

---

**End of Documentation**

For questions or clarifications, please contact the backend team.
