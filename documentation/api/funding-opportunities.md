# Funding Opportunities Module API

## Overview
The Funding Opportunities module allows Chapter Admins to manage grants and funding opportunities.

## Base URL
`/api/v1/funding-opportunities`

## Authentication
- **Type:** Bearer Token (JWT)
- **Header:** `Authorization: Bearer <access_token>`

---

## Endpoints

### 1. Create Funding Opportunity (Admin)
**Method:** `POST`
**Path:** `/api/v1/funding-opportunities`
**Access:** Chapter Admin only
**Description:** Create a new funding opportunity.

#### Request
**Body:**
```json
{
  "role": "Producer",
  "fundingType": "Grant", // Enum: [Grant, Fund]
  "name": "Film Production Grant",
  "description": "Grant for independent filmmakers.",
  "deadline": "2024-12-31T23:59:59Z",
  "region": "West Africa",
  "applicationType": "Redirect", // Enum: [Redirect, Internal]
  "applicationLink": "https://example.com/apply" // Required if applicationType is Redirect
}
```

#### Response
**Success (201 Created)**

---

### 2. List Funding Opportunities
**Method:** `GET`
**Path:** `/api/v1/funding-opportunities`
**Access:** All authenticated users
**Description:** List available funding opportunities.

#### Response
**Success (200 OK)**

---

### 3. Get Funding Opportunity Details
**Method:** `GET`
**Path:** `/api/v1/funding-opportunities/:fundingId`
**Access:** All authenticated users
**Description:** Get details of a specific funding opportunity.

#### Request
**Path Parameters:**
- `fundingId`: ID of the funding opportunity.

#### Response
**Success (200 OK)**

---

### 4. Update Funding Opportunity (Admin)
**Method:** `PATCH`
**Path:** `/api/v1/funding-opportunities/:fundingId`
**Access:** Chapter Admin only
**Description:** Update a funding opportunity.

#### Request
**Path Parameters:**
- `fundingId`: ID of the funding opportunity.

**Body:** (Partial update)
```json
{
  "name": "Updated Grant Name",
  "deadline": "2025-01-01T00:00:00Z"
}
```

#### Response
**Success (200 OK)**

---

### 5. Delete Funding Opportunity (Admin)
**Method:** `DELETE`
**Path:** `/api/v1/funding-opportunities/:fundingId`
**Access:** Chapter Admin only
**Description:** Remove a funding opportunity.

#### Request
**Path Parameters:**
- `fundingId`: ID of the funding opportunity.

#### Response
**Success (200 OK)**
