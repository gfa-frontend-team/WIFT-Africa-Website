# Application Endpoints

## Get My Applications
`GET /api/v1/application/me`

Retrieve a paginated list of applications made by the authenticated user.

### Query Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `status` | String | Filter by status (`RECEIVED`, `SHORTLISTED`, etc.). |
| `page` | Integer | Page number (default 1). |
| `limit` | Integer | Items per page (default 20). |

---

## Get Application Detail
`GET /api/v1/application/:applicationId`

Get full details of a specific application.

---

## Admin: List Applications for Job
`GET /api/v1/application/admin/jobs/:jobId/applications`

**Requires Admin Privileges.**
View all candidates who applied for a specific job.

### Query Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `status` | String | Filter candidates by status. |
| `page` | Integer | Pagination. |

---

## Admin: Update Application Status
`PATCH /api/v1/application/admin/:applicationId/status`

**Requires Admin Privileges.**
Move an application through the hiring pipeline.

### Body
```json
{
  "status": "SHORTLISTED"
}
```
### Valid Statuses
*   `RECEIVED`
*   `SHORTLISTED`
*   `REJECTED`
*   `HIRED`
