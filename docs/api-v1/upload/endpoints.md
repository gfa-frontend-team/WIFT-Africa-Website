# Uploads API Documentation

## Endpoint: Upload File

### Request
**`POST /api/v1/uploads`**

Upload a generic file (image or document) to the server/cloud storage.
The file is uploaded using `multipart/form-data`.

**Authentication**: Required

#### Request Body (Multipart)
| Field | Type | Description |
|-------|------|-------------|
| file | File | The file to upload (Required). Max 5MB for images, 10MB for documents. |
| type | string | Optional context: `post`, `profile`, `cv` |

### Response

#### Success Response

**Status Code**: `201 Created`
```json
{
  "message": "File uploaded successfully",
  "file": {
    "url": "https://storage.azure.com/container/filename.jpg",
    "filename": "filename.jpg",
    "mimetype": "image/jpeg",
    "size": 102400
  }
}
```

#### Error Responses

- **400 Bad Request**: No file uploaded or invalid file type/size.
- **401 Unauthorized**: User not logged in.

---

## Endpoint: Sign Video Upload (SAS Token)

### Request
**`POST /api/v1/uploads/video/sign`**

Generate a Shared Access Signature (SAS) token to allow the client to upload a video file directly to Azure Blob Storage. This bypasses the server for large video files.

**Authentication**: Required

#### Request Body
```json
{
  "fileName": "my-video.mp4"
}
```
**Field Descriptions**:
- `fileName` (string, required): The name of the file to be uploaded.

### Response

#### Success Response

**Status Code**: `200 OK`
```json
{
  "uploadUrl": "https://accountname.blob.core.windows.net/videos/unique-name.mp4?sv=...",
  "blobName": "unique-name.mp4",
  "expiresOn": "2024-03-01T10:15:00Z"
}
```
*The client should then use `PUT` request to the `uploadUrl` with the video file binary body.*

#### Error Responses

- **400 Bad Request**: Missing file name.
