# Mentorships Module API

## Overview
The Mentorships module manages mentorship programs, allowing mentors to create offers and mentees (via other flows) to interact with them. It supports physical, virtual, and hybrid mentorship formats.

## Base URL
`/api/v1/mentorships`

## Authentication
- **Type:** Bearer Token (JWT)
- **Header:** `Authorization: Bearer <access_token>`

## Schemas

### Mentorship
```typescript
{
  mentorName: string;
  mentorRole: string;
  areasOfExpertise: string[];
  mentorshipFormat: 'Virtual' | 'Physical' | 'Hybrid';
  availability: string;
  duration: string;
  description: string;
  eligibility: string; // optional
  chapterId: string;   // optional
  status: 'Open' | 'Closed'; // optional
}
```

---

## Endpoints

### 1. Create Mentorship Offer
**Method:** `POST`
**Path:** `/api/v1/mentorships`
**Description:** Create a new mentorship offer.

#### Request
**Body:**
```json
{
  "mentorName": "John Doe",
  "mentorRole": "Director",
  "areasOfExpertise": ["Script Development", "Career Growth"],
  "mentorshipFormat": "Virtual",
  "availability": "Weekly",
  "duration": "3 months",
  "description": "Mentorship for aspiring directors.",
  "status": "Open"
}
```

#### Response
**Success (201 Created)**
```json
{
  "message": "Mentorship created",
  "data": { ...mentorshipData }
}
```

---

### 2. List Mentorships
**Method:** `GET`
**Path:** `/api/v1/mentorships`
**Description:** Retrieve a list of mentorship offers.

#### Request
**Query Parameters:**
- `chapterId` (optional): Filter by chapter ID.

#### Response
**Success (200 OK)**
```json
{
  "data": [ ...arrayOfMentorships ]
}
```

---

### 3. Get Mentorship Details
**Method:** `GET`
**Path:** `/api/v1/mentorships/:mentorshipId`
**Description:** Retrieve details of a specific mentorship offer.

#### Request
**Path Parameters:**
- `mentorshipId`: ID of the mentorship.

#### Response
**Success (200 OK)**
```json
{
  "data": { ...mentorshipData }
}
```

---

### 4. Update Mentorship
**Method:** `PATCH`
**Path:** `/api/v1/mentorships/:mentorshipId`
**Description:** Update an existing mentorship offer.

#### Request
**Path Parameters:**
- `mentorshipId`: ID of the mentorship.

**Body:** (Partial Mentorship object)
```json
{
  "status": "Closed"
}
```

#### Response
**Success (200 OK)**
```json
{
  "message": "Mentorship updated successfully",
  "data": { ...updatedMentorshipData }
}
```

---

### 5. Delete Mentorship
**Method:** `DELETE`
**Path:** `/api/v1/mentorships/:mentorshipId`
**Description:** Delete a mentorship offer.

#### Request
**Path Parameters:**
- `mentorshipId`: ID of the mentorship.

#### Response
**Success (200 OK)**
```json
{
  "message": "Mentorship deleted successfully"
}
```
