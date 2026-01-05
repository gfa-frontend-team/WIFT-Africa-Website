# Job Endpoints

## List Jobs
`GET /api/v1/jobs`

Fetch a list of active job postings.

### Query Parameters
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `location` | String | Filter by location name. |
| `role` | String | Filter by job role. |
| `remote` | Boolean | Filter for remote jobs only (`true`). |

### Response
```json
{
  "status": "success",
  "message": "Jobs retrieved successfully",
  "results": 10,
  "data": [
    {
      "_id": "64fa...",
      "title": "Frontend Engineer",
      "companyName": "Tech Corp",
      "location": "Lagos",
      "isRemote": true
    }
  ]
}
```

---

## Get Job Details
`GET /api/v1/jobs/:jobId`

Get full details for a specific job.

### Response
```json
{
  "status": "success",
  "data": {
    "_id": "64fa...",
    "title": "Frontend Engineer",
    "description": "..."
  }
}
```

---

## Create Job (Admin)
`POST /api/v1/jobs`

Create a new job posting. Requires Chapter Admin privileges.

### Body
```json
{
  "title": "Senior Designer",
  "role": "Designer",
  "description": "We are looking for...",
  "location": "Accra, Ghana",
  "employmentType": "full-time",
  "isRemote": false,
  "companyName": "WIFT Africa",
  "salaryRange": {
    "min": 500000,
    "max": 800000,
    "currency": "NGN"
  }
}
```

---

## Update Job (Admin)
`PATCH /api/v1/jobs/:jobId`

Update specific fields of a job.

### Body
```json
{
  "status": "CLOSED"
}
```

---

## Archive Job (Admin)
`DELETE /api/v1/jobs/:jobId`

Soft-delete (archive) a job posting.

---

## Apply for Job
`POST /api/v1/jobs/:jobId/apply`

Submit an internal application for a job.
*Note: This creates a `JobApplication` record.*

### Body
```json
{
  "coverLetter": "I am interested...",
  "resumeFileId": "file_id_..."
}
```
