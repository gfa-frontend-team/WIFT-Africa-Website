## Endpoint: Get Conversations

### Request
**`GET /api/v1/messages/conversations`**

Retrieve the user's list of conversations, sorted by the most recent message. Supports filtering by type (DIRECT/BROADCAST).

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| type | string | Filter: `DIRECT` or `BROADCAST` |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "conversations": [
    {
      "id": "677d...",
      "type": "DIRECT",
      "otherParticipant": {
        "firstName": "Jane",
        "lastName": "Doe",
        "profilePhoto": "..."
      },
      "lastMessage": {
        "content": "See you there!",
        "isRead": false,
        "createdAt": "2024-02-16T10:00:00.000Z"
      }
    },
    {
      "id": "678e...",
      "type": "BROADCAST",
      "title": "Monthly Newsletter",
      "description": "Updates for March",
      "creator": {
        "firstName": "Super",
        "lastName": "Admin",
        "profilePhoto": "..."
      },
      "participantCount": 150,
      "lastMessage": {
        "content": "Check this out",
        "sender": "...",
        "createdAt": "..."
      }
    }
  ],
  "total": 5
}
```

---

## Endpoint: Get Messages in Conversation

### Request
**`GET /api/v1/messages/conversations/:conversationId`**

Fetch messages within a specific conversation.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| conversationId | string | ID of the conversation |

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Messages per page |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "conversation": {
    "type": "DIRECT",
    "isBroadcast": false
  },
  "messages": [
    {
      "id": "677f...",
      "content": "Hello!",
      "sender": {
        "id": "...",
        "firstName": "John"
      },
      "isReadByMe": true,
      "createdAt": "2024-02-16T09:55:00.000Z"
    }
  ],
  "total": 50
}
```

---

## Endpoint: Send Direct Message

### Request
**`POST /api/v1/messages`**

Send a direct message to another user.

**Authentication**: Required

#### Request Body
```json
{
  "receiverId": "676ac...",
  "content": "Hey, are you going to the event?",
  "media": []
}
```

**Field Descriptions**:
- `receiverId` (string, required): User ID of recipient.
- `content` (string, required): Message text.
- `media` (object array, optional): Attachments.

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "message": {
    "id": "678a...",
    "content": "Hey, are you going to the event?",
    "receiver": "...",
    "createdAt": "..."
  },
  "conversation": {
    "id": "..."
  }
}
```

---

## Endpoint: Send Broadcast (Admin Only)

### Request
**`POST /api/v1/messages/broadcast`**

Send a message to multiple users (e.g., all members or specific chapter).

**Authentication**: Required (Admin Role)

#### Request Body
```json
{
  "title": "Urgent Update",
  "content": "Please check your email for the new policy.",
  "recipientType": "CHAPTER",
  "chapterId": "676bd...",
  "description": "Policy update notification"
}
```

**Field Descriptions**:
- `recipientType` (enum): `ALL` (Super Admin), `CHAPTER` (Chapter Admin), `CUSTOM`.
- `content` (string): Message body.
- `title` (string): Broadcast title.

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "message": "Broadcast sent successfully",
  "data": {
    "recipientCount": 150,
    "message": {
      "id": "...",
      "content": "Please check your email...",
      "createdAt": "..."
    },
    "conversation": {
      "id": "...",
      "title": "Urgent Update",
      "type": "BROADCAST"
    }
  }
}
```

---

## Endpoint: Mark as Read

### Request
**`POST /api/v1/messages/conversations/:conversationId/read`**

Mark all messages in a conversation as read.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Messages marked as read"
}
```

---

## Endpoint: Get Unread Count

### Request
**`GET /api/v1/messages/unread-count`**

Get total unread messages count.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "direct": 3,
  "broadcast": 1,
  "total": 4
}
```

---

## Endpoint: Get Broadcast Stats (Admin)

### Request
**`GET /api/v1/messages/broadcast/:conversationId/stats`**

Get read receipts and statistics for a broadcast.

**Authentication**: Required (Creator only)

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "conversation": {
    "id": "...",
    "title": "Urgent Update",
    "description": "Policy update notification",
    "creator": {
      "firstName": "Super",
      "lastName": "Admin"
    },
    "participantCount": 150,
    "createdAt": "2024-02-15T..."
  },
  "stats": [
    {
      "messageId": "...",
      "content": "Please check...",
      "recipientCount": 150,
      "readCount": 45,
      "readPercentage": "30.00",
      "sentAt": "2024-02-15T..."
    }
  ]
}
```

---

## Endpoint: Archive Conversation

### Request
**`POST /api/v1/messages/conversations/:conversationId/archive`**

Archive a conversation so it no longer appears in the main list.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| conversationId | string | ID of the conversation |

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "message": "Conversation archived"
}
```

---

## Endpoint: Delete Message

### Request
**`DELETE /api/v1/messages/:messageId`**

Delete a specific message.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| messageId | string | ID of the message |

### Response

#### Success Response
**Status Code**: `200 OK`
```json
{
  "message": "Message deleted"
}
```
