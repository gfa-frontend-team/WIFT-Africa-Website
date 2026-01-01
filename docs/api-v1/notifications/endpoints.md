## Endpoint: List Notifications

### Request
**`GET /api/v1/notifications`**

Retrieve the user's recent notifications, paginated.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 20) |
| unreadOnly | boolean | Show only unread items (default: false) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "notifications": [
    {
      "_id": "679f...",
      "type": "NEW_MESSAGE",
      "title": "New Message",
      "message": "Alice sent you a message",
        "_id": "...",
        "firstName": "Alice",
        "lastName": "Smith",
        "username": "alicesmith",
        "profilePhoto": "..."
      },
      "isRead": false,
      "actionUrl": "/messages/123",
      "createdAt": "2024-03-05T14:30:00.000Z"
    }
  ],
  "total": 50,
  "unreadCount": 5,
  "pages": 3
}
```

---

## Endpoint: Get Unread Count

### Request
**`GET /api/v1/notifications/unread-count`**

Quickly check the number of unread notifications.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "count": 5
}
```

---

## Endpoint: Mark as Read

### Request
**`PATCH /api/v1/notifications/:notificationId/read`**

Mark a single notification as read.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| notificationId | string | ID of the notification |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Notification marked as read"
}
```

---

## Endpoint: Mark All as Read

### Request
**`POST /api/v1/notifications/mark-all-read`**

Mark all unread notifications as read at once.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "All notifications marked as read",
  "count": 12
}
```

---

## Endpoint: Delete Notification

### Request
**`DELETE /api/v1/notifications/:notificationId`**

Remove a notification permanently.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Notification deleted"
}
```

---

## Endpoint: Get Preferences

### Request
**`GET /api/v1/notifications/preferences`**

Retrieve user's settings for email, push, and in-app notifications.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "preferences": {
    "emailEnabled": true,
    "pushEnabled": true,
    "inAppEnabled": true,
    "postNotifications": true,
    "messageNotifications": true,
    "emailDigestFrequency": "instant"
  }
}
```

---

## Endpoint: Update Preferences

### Request
**`PUT /api/v1/notifications/preferences`**

Update notification settings.

**Authentication**: Required

#### Request Body
```json
{
  "emailEnabled": false,
  "pushEnabled": true,
  "emailDigestFrequency": "weekly"
}
```

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Preferences updated successfully",
  "preferences": { ... }
}
```

---

## Endpoint: Register Push Token

### Request
**`POST /api/v1/notifications/push-tokens`**

Register a device token (FCM/APNS) for push notifications.

**Authentication**: Required

#### Request Body
```json
{
  "token": "ExponentPushToken[...]",
  "deviceType": "ios",
  "deviceId": "unique-device-id"
}
```

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Push token registered successfully"
}
```

---

## Endpoint: Unregister Push Token

### Request
**`DELETE /api/v1/notifications/push-tokens/:token`**

Remove a device token (e.g., on logout).

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Push token unregistered successfully"
}
```
