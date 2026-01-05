# Report Endpoints

## Submit a Report
`POST /api/v1/reports`

Allow any authenticated user to report content.

### Body
```json
{
  "targetType": "POST",
  "targetId": "64fa...",
  "reason": "Harassment",
  "description": "This post contains offensive language."
}
```

---

## Admin: List Reports
`GET /api/v1/admin/reports`

**Requires Admin Privileges.**
View list of reports.

### Query Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `status` | String | Filter by `OPEN` or `RESOLVED`. |
| `targetType` | String | Filter by entity type. |
| `page` | Integer | Pagination default 1. |
| `limit` | Integer | Pagination default 20. |

---

## Admin: Get Report Details
`GET /api/v1/admin/reports/:reportId`

**Requires Admin Privileges.**
Get details of a report, including the resolved target content (the post/comment content).

---

## Admin: Resolve Report
`PATCH /api/v1/admin/reports/:reportId/resolve`

**Requires Admin Privileges.**
Mark a report as resolved.

### Body
```json
{
  "resolutionNote": "Content removed and user warned."
}
```
