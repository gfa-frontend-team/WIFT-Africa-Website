# Reporting API

The Reporting module provides safety mechanisms for the platform, allowing users to report content or other users that violate community guidelines.

## Base URL
*   **User Actions**: `/api/v1/reports`
*   **Admin Actions**: `/api/v1/admin/reports`

## Key Features
- **Submit Report**: Users can report Posts, Comments, Job Postings, or other Users.
- **Admin Resolution**: Admins can review open reports and mark them as resolved.

## Target Types
Reports can be filed against the following entity types:
*   `POST`
*   `COMMENT`
*   `USER`
*   `JOB`
