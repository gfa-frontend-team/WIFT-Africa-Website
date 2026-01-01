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
      "_id": "676f2...",
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
    }
  ],
  "total": 50,
  "pages": 5
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
    "_id": "676f3...",
    "content": "Excited to join WIFT Africa! 🌍",
    "visibility": "PUBLIC",
    "createdAt": "2024-02-15T12:05:00.000Z"
  }
}
```

---

## Endpoint: Get Single Post

### Request
**`GET /api/v1/posts/:id`**

Retrieve details of a single post.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | ID of the post |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "post": {
    "_id": "676f2...",
    "content": "Just finished filming...",
    "author": { ... }
    // ... typical post fields
  }
}
```

---

## Endpoint: Update Post

### Request
**`PATCH /api/v1/posts/:id`**

Update an existing post.

**Authentication**: Required (Author only)

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | ID of the post |

#### Request Body
```json
{
  "content": "Updated content...",
  "visibility": "CONNECTIONS_ONLY"
}
```

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "post": { ... }
}
```

---

## Endpoint: Delete Post

### Request
**`DELETE /api/v1/posts/:id`**

Delete a post.

**Authentication**: Required (Author or Admin)

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | ID of the post |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Post deleted successfully"
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
      "_id": "676f4...",
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
      "_id": "676f6...",
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
    "_id": "676f5...",
    "content": "Great post!",
    "post": "PostId..."
  }
}
```

---

## Endpoint: Delete Comment

### Request
**`DELETE /api/v1/posts/comments/:commentId`**

Delete a comment.

**Authentication**: Required (Author or Admin)

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| commentId | string | ID of the comment |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "message": "Comment deleted successfully"
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
    "_id": "NewPostId...",
    "originalPost": { ... },
    "isShared": true
  }
}
```

---

## Endpoint: Get Post Shares

### Request
**`GET /api/v1/posts/:id/shares`**

Get a list of users who shared a specific post.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | ID of the post |

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "shares": [
    {
      "_id": "ShareId...",
      "user": { ... },
      "createdAt": "..."
    }
  ],
  "total": 15
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

## Endpoint: Get Saved Posts

### Request
**`GET /api/v1/posts/saved`**

Retrieve posts saved by the current user.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| limit | number | Items per page |
| collection | string | Filter by collection name |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "posts": [ ... ],
  "total": 15
}
```

---

## Endpoint: Get Saved Collections

### Request
**`GET /api/v1/posts/saved/collections`**

Get a list of the user's saved post collections.

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "collections": [
    {
      "name": "Inspiration",
      "count": 5
    }
  ]
}
```

---

## Endpoint: Check if Post is Saved

### Request
**`GET /api/v1/posts/:id/is-saved`**

Check if a specific post is saved by the current user.

**Authentication**: Required

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | ID of the post |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "saved": true
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
    "_id": "...",
    "postType": "ADMIN_ANNOUNCEMENT",
    "isPinned": true
  },
  "message": "Announcement posted to 1 chapter(s)"
}
```

---

## Endpoint: Pin Post (Admin)

### Request
**`POST /api/v1/posts/:id/pin`**

Pin or unpin a post to the top of the feed.

**Authentication**: Required (Admin only)

#### Path Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | ID of the post |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "pinned": true,
  "message": "Post pinned successfully"
}
```
