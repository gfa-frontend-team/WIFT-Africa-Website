## Endpoint: Get Posts Feed

### Request
**`GET /api/v1/posts/feed`**

Retrieve the main feed of posts, including regular posts from other users, chapter-specific posts, and admin announcements.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "posts": [
    {
      "id": "676f2...",
      "content": "Just finished filming my new documentary! #FilmLife",
      "author": {
        "firstName": "Sarah",
        "lastName": "Connor",
        "profilePhoto": "..."
      },
      "visibility": "PUBLIC",
      "media": [
        {
          "type": "image",
          "url": "https://storage.example.com/image.jpg"
        }
      ],
      "likesCount": 42,
      "commentsCount": 5,
      "sharesCount": 2,
      "savesCount": 1,
      "likes": ["UserId1", "UserId2"],
      "createdAt": "2024-02-15T12:00:00.000Z",
      "isAdminPost": false,
      "isPinned": false
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5
  }
}
```

---

## Endpoint: Create Post

### Request
**`POST /api/v1/posts`**

Create a new regular post.

**Authentication**: Required

#### Request Body
```json
{
  "content": "Excited to join WIFT Africa! 🌍",
  "visibility": "PUBLIC",
  "media": []
}
```

**Field Descriptions**:
- `content` (string, required): Text content (max 5000 chars).
- `visibility` (string): `PUBLIC`, `CHAPTER_ONLY`, `CONNECTIONS_ONLY` (default: `PUBLIC`).
- `media` (array): Optional list of media objects w/ `type` ("image"|"video") and `url`.

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "post": {
    "id": "676f3...",
    "content": "Excited to join WIFT Africa! 🌍",
    "visibility": "PUBLIC",
    "createdAt": "2024-02-15T12:05:00.000Z"
  }
}
```

---

## Endpoint: Like Post

### Request
**`POST /api/v1/posts/:id/like`**

Toggle like status on a post.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "liked": true
}
```

---

## Endpoint: Get Comments

### Request
**`GET /api/v1/posts/:id/comments`**

Get top-level comments for a post.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Limit per page |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "comments": [
    {
      "id": "676f4...",
      "content": "Welcome!",
      "author": { ... },
      "repliesCount": 0,
      "createdAt": "..."
    }
  ],
  "total": 1
}
```


---

## Endpoint: Get Comment Replies

### Request
**`GET /api/v1/posts/comments/:commentId/replies`**

Get nested replies for a specific comment.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Limit per page |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "comments": [
    {
      "id": "676f6...",
      "content": "I agree!",
      "author": { ... },
      "parentComment": "676f4...",
      "createdAt": "..."
    }
  ],
  "total": 1
}
```

---


## Endpoint: Add Comment

### Request
**`POST /api/v1/posts/:id/comments`**

Add a comment to a post.

**Authentication**: Required

#### Request Body
```json
{
  "content": "Great post!",
  "parentCommentId": "OptionalIDForReply"
}
```

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "comment": {
    "id": "676f5...",
    "content": "Great post!",
    "post": "PostId..."
  }
}
```

---

## Endpoint: Share Post

### Request
**`POST /api/v1/posts/:id/share`**

Share an existing post to your own feed.

**Authentication**: Required

#### Request Body
```json
{
  "shareComment": "This is a must-read!",
  "visibility": "PUBLIC"
}
```

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "message": "Post shared successfully",
  "post": {
    "id": "NewPostId...",
    "originalPost": { ... },
    "isShared": true
  }
}
```

---

## Endpoint: Save Post

### Request
**`POST /api/v1/posts/:id/save`**

Toggle saved status of a post.

**Authentication**: Required

#### Request Body
```json
{
  "collection": "Inspiration"
}
```

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "saved": true,
  "message": "Post saved"
}
```

---

## Endpoint: Admin Announcement (Admin Only)

### Request
**`POST /api/v1/posts/admin`**

Create a highlighted announcement post.

**Authentication**: Required (Chapter Admin or Super Admin)

#### Request Body
```json
{
  "content": "Meeting moved to 5 PM.",
  "isPinned": true,
  "targetChapters": ["ChapterId1"]
}
```

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "post": {
    "id": "...",
    "postType": "ADMIN_ANNOUNCEMENT",
    "isPinned": true
  },
  "message": "Announcement posted to 1 chapter(s)"
}
```
