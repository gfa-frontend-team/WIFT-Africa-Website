## Endpoint: List Connections

### Request
**`GET /api/v1/connections`**

Retrieve a list of the authenticated user's confirmed connections.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "connections": [
    {
      "id": "678d...",
      "user": {
        "id": "UserA...",
        "firstName": "Alice",
        "lastName": "Smith",
        "profilePhoto": "..."
      },
      "connectedAt": "2024-03-01T10:00:00.000Z"
    }
  ],
  "total": 42,
  "pages": 3
}
```

---

## Endpoint: Send Connection Request

### Request
**`POST /api/v1/connections/requests`**

Send a request to connect with another user.

**Authentication**: Required

#### Request Body
```json
{
  "receiverId": "UserB...",
  "message": "Hi, I'd like to join your network!"
}
```

**Field Descriptions**:
- `receiverId` (string, required): ID of the user to connect with.
- `message` (string, optional): Intro message (max 300 chars).

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "request": {
    "id": "Req123...",
    "sender": "UserMe...",
    "receiver": "UserB...",
    "status": "PENDING",
    "expiresAt": "..."
  },
  "message": "Connection request sent"
}
```
**Error Codes**:
- `400`: Already connected or request pending.
- `403`: User blocked.

---

## Endpoint: Get Connection Requests

### Request
**`GET /api/v1/connections/requests`**

Get a list of pending connection requests.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | `incoming`, `outgoing`, or `all` (default: `all`) |
| page | number | Page number |
| limit | number | Items per page |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "requests": [
    {
      "id": "Req123...",
      "sender": { "firstName": "Bob" },
      "status": "PENDING",
      "createdAt": "..."
    }
  ],
  "total": 5
}
```

---

## Endpoint: Accept/Decline/Cancel Request

### Request
**`PATCH /api/v1/connections/requests/:requestId/{action}`**

Handle a connection request. `action` can be `accept`, `decline`, or `cancel`.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| requestId | string | ID of the request |
| action | string | `accept`, `decline`, or `cancel` |

#### Request Body (for Decline only)
```json
{
  "reason": "Not interested right now"
}
```

### Response

#### Success Response (Accept)
**Status Code**: `200 OK`
```json
{
  "connection": {
    "id": "ConnNew...",
    "user1": "...",
    "user2": "..."
  },
  "message": "Connection request accepted"
}
```

---

## Endpoint: Remove Connection

### Request
**`DELETE /api/v1/connections/:connectionId`**

Remove an existing connection.

**Authentication**: Required

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "message": "Connection removed successfully"
}
```

---

## Endpoint: Block User

### Request
**`POST /api/v1/connections/block`**

Block a user, preventing further messaging or connection requests.

**Authentication**: Required

#### Request Body
```json
{
  "userId": "UserBad...",
  "reason": "Spamming"
}
```

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "message": "User blocked successfully"
}
```

---

## Endpoint: Unblock User

### Request
**`DELETE /api/v1/connections/block/:blockedUserId`**

Unblock a previously blocked user.

**Authentication**: Required

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "message": "User unblocked successfully"
}
```

---

## Endpoint: Get Connection Stats

### Request
**`GET /api/v1/connections/stats`**

Get counts for connections and pending requests.

**Authentication**: Required

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "connectionsCount": 150,
  "pendingIncoming": 5,
  "pendingOutgoing": 2
}
```

---

## Endpoint: Check Connection Status

### Request
**`GET /api/v1/connections/check/:targetUserId`**

Check if the current user is connected to a specific target user.

**Authentication**: Required

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "connected": true
}
```
