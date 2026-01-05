# Report Schema

## Report Object

| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | String | Unique identifier. |
| `reporter` | ObjectId | Reference to the `User` who submitted the report. |
| `targetType` | String | Enum: `POST`, `COMMENT`, `USER`, `JOB`. |
| `targetId` | ObjectId | ID of the entity being reported. |
| `reason` | String | Short reason/category (max 100 chars). |
| `description` | String | Detailed explanation (max 500 chars). |
| `status` | String | Enum: `OPEN`, `RESOLVED`. |
| `resolvedBy` | ObjectId | Reference to Admin `User`. |
| `resolvedAt` | Date | Timestamp of resolution. |
| `resolutionNote` | String | Admin's note on the resolution. |
| `createdAt` | Date | Timestamp of creation. |
