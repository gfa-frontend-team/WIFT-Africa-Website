# Application Schema

## JobApplication Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | String | Unique identifier. |
| `job` | ObjectId | Reference to the `Job`. |
| `applicant` | ObjectId | Reference to the `User`. |
| `status` | String | Enum: `received`, `shortlisted`, `rejected`, `hired`. |
| `resumeUrl` | String | URL to the resume file. |
| `coverLetter` | String | Text content of cover letter. |
| `jobTitleSnapshot` | String | Title of job at time of application. |
| `companyNameSnapshot` | String | Company name at time of application. |
| `createdAt` | Date | Submission timestamp. |
