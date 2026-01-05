# Job Schema

## Job Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | String | Unique identifier for the job. |
| `title` | String | Job title. |
| `description` | String | HTML/Markdown content description of the role. |
| `role` | String | Category/Role (e.g., "Frontend Engineer"). |
| `location` | String | Location string (e.g., "Lagos, Nigeria"). |
| `isRemote` | Boolean | Whether the job is remote. |
| `employmentType` | String | Enum: `full-time`, `part-time`, `contract`, `internship`. |
| `companyName` | String | Name of the hiring company. |
| `salaryRange` | Object | Optional salary details. |
| `salaryRange.min` | Number | Minimum salary. |
| `salaryRange.max` | Number | Maximum salary. |
| `salaryRange.currency` | String | Currency code (e.g., "NGN"). |
| `applicationType` | String | `INTERNAL` (apply on platform) or `EXTERNAL` (redirect). |
| `applicationLink` | String | URL for external applications. |
| `status` | String | `ACTIVE`, `CLOSED`, `ARCHIVED`. |
| `createdAt` | Date | Timestamp of creation. |
