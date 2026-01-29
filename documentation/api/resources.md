# Resources Module API

## Overview
The Resources module allows Super Admins to manage learning resources (videos, PDFs) for users.

## Base URL
`/api/v1/resources`

## Authentication
- **Type:** Bearer Token (JWT)
- **Header:** `Authorization: Bearer <access_token>`

---

## Endpoints

### 1. Create Resource (Super Admin)
**Method:** `POST`
**Path:** `/api/v1/resources`
**Access:** Super Admin only
**Description:** Upload and create a new learning resource.

#### Request
**Content-Type:** `multipart/form-data`

**Body:**
- `title` (string, required): Title of the resource.
- `description` (string, optional): Description.
- `resourceType` (string, required): `VIDEO` or `PDF`.
- `file` (file, required): The file to upload.

#### Response
**Success (201 Created)**
```json
{
  "message": "Resource created successfully",
  "data": { ...resourceData }
}
```

---

### 2. List Resources
**Method:** `GET`
**Path:** `/api/v1/resources`
**Access:** All authenticated users
**Description:** Get a list of all resources.

#### Response
**Success (200 OK)**
```json
{
  "data": [ ...arrayOfResources ]
}
```

---

### 3. Get Resource Details
**Method:** `GET`
**Path:** `/api/v1/resources/:resourceId`
**Access:** All authenticated users
**Description:** Get details of a specific resource.

#### Request
**Path Parameters:**
- `resourceId`: ID of the resource.

#### Response
**Success (200 OK)**
```json
{
  "data": { ...resourceData }
}
```

---

### 4. Update Resource (Super Admin)
**Method:** `PATCH`
**Path:** `/api/v1/resources/:resourceId`
**Access:** Super Admin only
**Description:** Update a resource.

#### Request
**Content-Type:** `multipart/form-data`

**Path Parameters:**
- `resourceId`: ID of the resource.

**Body:**
- `title` (string, optional)
- `description` (string, optional)
- `status` (string, optional): `DRAFT` or `PUBLISHED`
- `file` (file, optional): New file to replace existing.

#### Response
**Success (200 OK)**
```json
{
  "message": "Resource updated",
  "data": { ...updatedResourceData }
}
```

---

### 5. Delete Resource (Super Admin)
**Method:** `DELETE`
**Path:** `/api/v1/resources/:resourceId`
**Access:** Super Admin only
**Description:** Delete a resource.

#### Request
**Path Parameters:**
- `resourceId`: ID of the resource.

#### Response
**Success (200 OK)**
```json
{
  "message": "Resource deleted"
}
```
