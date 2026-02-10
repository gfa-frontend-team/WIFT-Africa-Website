
# Messaging System Analysis

## Overview
The WIFT Africa messaging system supports both direct (1-on-1) and broadcast (1-to-many) communication. It is built on a MongoDB schema that supports rich media attachments and real-time delivery via Socket.IO.

## Attachment Capabilities

**Yes, the system currently supports attaching documents to messages.**

### 1. Data Model Support
The `Message` schema explicitly defines a `media` field which is an array of objects. This structure supports multiple attachments per message.

```typescript
// src/models/Message.ts
media: [{
  type: { 
    type: String, 
    enum: ['image', 'video', 'document'], // Explicit support for documents
    required: true 
  },
  url: { type: String, required: true },
  filename: { type: String }, // Stores original filename
}]
```

### 2. Supported Attachment Types
The system allows three types of media:
1.  **Image:** (`image/jpeg`, `image/png`, etc.)
2.  **Video:** (`video/mp4`, etc.)
3.  **Document:** (`application/pdf`, `.doc`, `.docx`, etc.)

### 3. Usage in Messaging Flow

#### sending Logic
When sending a message (via `MessageService.sendMessage` or `MessageService.sendBroadcastMessage`), the payload accepts a `media` array.

```typescript
// Payload Interface
interface SendMessageInput {
  // ...
  media?: Array<{
    type: "image" | "video" | "document";
    url: string;
    filename?: string;
  }>;
}
```

#### Frontend Implementation Requirement
To attach a document, the frontend must:
1.  **Upload:** Call the upload endpoint (likely `/api/v1/upload`) to upload the file to cloud storage (Azure/S3).
2.  **Get URL:** Receive the public URL of the uploaded file.
3.  **Send Message:** Include this URL, the file type (`document`), and the `filename` in the `media` array when calling the `sendMessage` endpoint.

## Messaging Architecture

### A. Conversation Types
1.  **Direct:** 1-on-1 chats. Unique constraint ensures only one direct conversation exists between any two users.
2.  **Broadcast:** Admin-created announcements targeted at:
    *   **All Users:** Super Admin only.
    *   **Chapter Members:** Chapter Admin only.
    *   **Custom:** Specific list of user IDs.

### B. Real-Time Delivery
*   **Socket.IO:** Used for instant delivery.
*   **Events:**
    *   `new:message`: Sent to specific user room.
    *   `message:read`: Updates read status indicators.
    *   `broadcast`: Uses specialized rooms (`chapter:{id}`, `broadcast:all`) for efficient mass delivery.

### C. Data Retention
*   **Messages:** Stored indefinitely unless deleted.
*   **Soft Delete:** Supported (`isDeleted: true`).
    *   **Unsend:** Sender can delete for everyone (within limits/logic).
    *   **Delete for Me:** User can hide messages from their own view (`deletedFor` array).
*   **Editing:** Supported within a 15-minute window for the sender.

## Recommendations for Document Attachments

1.  **Upload Endpoint:** Ensure the generic upload endpoint supports document MIME types (PDF, DOCX) and returns the correct `url`.
    *   *Check:* Verify `src/middleware/upload.ts` generic filter allows these types. (Confirmed: `genericFileFilter` allows everything).
2.  **UI/UX:**
    *   Add a "paperclip" icon to the chat input.
    *   Display attached documents with a file icon and the `filename`.
    *   Clicking the attachment should verify the URL (or download it).

## Summary
The backend is **fully ready** for document attachments. No schema or service changes are required. The feature depends on the frontend correctly uploading the file first and passing the metadata to the message API.
