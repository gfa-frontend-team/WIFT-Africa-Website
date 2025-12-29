# Azure Blob Storage Implementation Guide

This guide details how to replace the current local file storage with **Azure Blob Storage** for handling user profiles, post images, and videos.

## 1. Azure Portal Setup

Before writing code, you need to set up the resources in Azure.

1.  **Create Storage Account**:
    *   Go to Azure Portal -> **Storage accounts** -> **Create**.
    *   **Performance**: Såtandard (sufficient for most web apps).
    *   **Redundancy**: LRS (Locally-redundant storage) is cheapest for dev/staging.
2.  **Create Containers**:
    *   Go to your new Storage Account -> **Data storage** -> **Containers**.
    *   Create two containers:
        *   `images` (for profiles and post photos).
        *   `videos` (for post videos).
    *   **Access Level**: Set to **Blob** (anonymous read access for blobs only) so users can view images without signed URLs (unless you want strict privacy).
3.  **Get Credentials**:
    *   Go to **Security + networking** -> **Access keys**.
    *   Copy the **Connection string**.

---

## 2. Project Configuration

### A. Install Dependencies
Run this command in your terminal:
```bash
npm install @azure/storage-blob uuid
npm install --save-dev @types/uuid
```

### B. Environment Variables
Add these to your [.env](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/.env) file:
```env
# Azure Storage
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=...;AccountKey=...;EndpointSuffix=core.windows.net"
AZURE_CONTAINER_IMAGES="images"
AZURE_CONTAINER_VIDEOS="videos"
```

---

## 3. Implementation Code

We will create a `StorageService` to handle uploads. We recommend **server-side upload** for small files (images) and **SAS Tokens (Direct Upload)** for large files (videos) to reduce server load.

### A. Create `src/services/storage.service.ts`

```typescript
import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || "";
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

export class StorageService {
  private imageContainer = process.env.AZURE_CONTAINER_IMAGES || "images";
  private videoContainer = process.env.AZURE_CONTAINER_VIDEOS || "videos";

  /**
   * Upload a file buffer (Image/Doc) directly to Azure
   */
  async uploadFile(
    buffer: Buffer,
    originalName: string,
    mimeType: string,
    folder: "profiles" | "posts" | "cvs"
  ): Promise<string> {
    const extension = path.extname(originalName);
    const fileName = `${folder}/${uuidv4()}${extension}`;
    
    // Get container client
    const containerClient = blobServiceClient.getContainerClient(this.imageContainer);
    
    // Get block blob client
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Upload
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: mimeType }
    });

    return blockBlobClient.url;
  }

  /**
   * Delete a file from Azure
   */
  async deleteFile(fileUrl: string): Promise<void> {
    try {
      // Extract container and blob name from URL
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const containerName = pathParts[1];
      const blobName = pathParts.slice(2).join('/'); // joins rest of path

      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
      
      await blockBlobClient.deleteIfExists();
    } catch (error) {
      console.error("Error deleting file from Azure:", error);
    }
  }

  /**
   * Generate a SAS Token for Direct Client Upload (Best for Videos)
   * This allows the frontend to upload directly to Azure, adhering to security policies.
   */
  async generateVideoUploadSas(userId: string, originalName: string) {
    const containerClient = blobServiceClient.getContainerClient(this.videoContainer);
    const extension = path.extname(originalName);
    const blobName = `user-${userId}/${uuidv4()}${extension}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Generate SAS (Shared Access Signature)
    // Detailed implementation requires importing GenerateBlobSASQueryParameters 
    // and setting permissions (Write/Create).
    // ...
    
    return {
      uploadUrl: blockBlobClient.url, // + SAS query string
      blobName
    };
  }
}

export const storageService = new StorageService();
```

### B. Integrate into [src/middleware/upload.ts](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/middleware/upload.ts)
Modify the existing multer setup to use memory storage instead of disk storage, so we can pass the buffer to Azure.

```typescript
// src/middleware/upload.ts
import multer from 'multer';

// Use MemoryStorage to keep file in memory (req.file.buffer)
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for general files
  },
  fileFilter: (req, file, cb) => {
    // ... existing filter logic
    cb(null, true);
  }
});
```

### C. Create Upload Endpoint (New)

Create a dedicated controller `src/modules/upload/upload.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { storageService } from '../../services/storage.service';

export class UploadController {
  
  // POST /api/v1/uploads/image
  async uploadImage(req: Request, res: Response) {
    if (!req.file) return res.status(400).json({ error: "No file provided" });

    const url = await storageService.uploadFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      "posts" // or determine dynamically based on query param
    );

    res.json({ url, type: 'image' });
  }
}
```

---

## 4. Workflow for Posts

1.  **Frontend**: User selects an image.
2.  **Frontend**: Calls `POST /api/v1/uploads/image` with the file.
3.  **Backend**: `UploadController` receives file -> Calls `storageService.uploadFile` -> Returns Azure URL.
4.  **Frontend**: Receives URL (e.g., `https://myapp.blob.core.windows.net/images/posts/abc.jpg`).
5.  **Frontend**: Calls `POST /api/v1/posts` sending `content: "..."` and `media: [{ type: 'image', url: '...' }]`.
6.  **Backend**: The [PostService](file:///Users/khalidsalman-yusuf/Documents/Unleashified/Active/WIFT-Africa-Backend/src/services/post.service.ts#36-885) saves the post with the URL.

## 5. Benefits of this Approach
*   **Scalability**: App servers don't store state. You can scale to 10 instances effortlessly.
*   **Performance**: Specialized storage serves files faster than your API server.
*   **Cost**: Blob storage is cheaper than the disk space on premium hosting services.
