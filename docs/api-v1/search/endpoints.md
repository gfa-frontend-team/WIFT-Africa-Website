## Endpoint: Search Users

### Request
**`GET /api/v1/search/users`**

Search for users with various filters. Returns a paginated list of results with a `matchScore`.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| query | string | Text search (name, username, headline) |
| role | string | Filter by primary role (e.g., `PRODUCER`) |
| roles | array | Filter by multiple roles |
| skills | array | Filter by skills (e.g., `?skills[]=editing`) |
| location | string | Filter by location |
| chapter | string | Filter by Chapter ID |
| availability | string | `AVAILABLE`, `BUSY`, or `NOT_LOOKING` |
| isMultihyphenate | boolean | Filter by multihyphenate status |
| excludeConnected | boolean | Exclude existing connections |
| sortBy | string | `relevance`, `name`, `recent`, `connections` |
| page | number | Page number |
| limit | number | Items per page |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "users": [
    {
      "_id": "678e...",
      "firstName": "Sarah",
      "lastName": "Connor",
      "username": "sconnor",
      "headline": "Director & Writer",
      "primaryRole": "DIRECTOR",
      "roles": ["DIRECTOR", "WRITER"],
      "location": "Nairobi, Kenya",
      "profileSlug": "sarah-connor",
      "profilePhoto": "...",
      "chapter": {
        "_id": "...",
        "name": "WIFT Kenya",
        "code": "KE"
      },
      "isConnected": false,
      "connectionStatus": "none",
      "matchScore": 85
    }
  ],
  "total": 50,
  "pages": 5,
  "filters": {
    "availableRoles": ["PRODUCER", "DIRECTOR"],
    "locationSuggestions": ["Lagos", "Nairobi"]
  }
}
```

---

## Endpoint: Get Recommendations

### Request
**`GET /api/v1/recommendations/users`**

Get user recommendations based on shared chapter, similar roles, or location.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Max results (default: 10) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "recommendations": [
    {
      "_id": "679f...",
      "firstName": "Jane",
      "lastName": "Doe",
      "username": "janedoe",
      "profileSlug": "jane-doe",
      "headline": "Actress",
      "primaryRole": "ACTRESS",
      "recommendationReason": "Same chapter",
      "score": 10
    }
  ],
  "total": 3
}
```

---

## Endpoint: Get Popular Skills

### Request
**`GET /api/v1/search/skills`**

Get a list of popular skills, useful for autocomplete or tag clouds.

**Authentication**: Required

#### Query Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Max results (default: 20) |

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "skills": ["Acting", "Video Editing", "Screenwriting"]
}
```

---

## Endpoint: Get Search Filters

### Request
**`GET /api/v1/search/filters`**

Get static and dynamic filter options (available roles, top chapters, top locations).

**Authentication**: Required

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "availableRoles": ["PRODUCER", "DIRECTOR", "..."],
  "availableChapters": [
    { "_id": "...", "name": "WIFT Nigeria", "memberCount": 150 }
  ],
  "locationSuggestions": ["Lagos", "Accra", "Cape Town"]
}
```
