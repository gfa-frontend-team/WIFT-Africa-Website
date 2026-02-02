# Frontend Implementation Guide: Posts Feature (Enhanced with Likes)

This guide covers the implementation details for the Posts feature, with a detailed focus on the **Like** system (Toggling & Viewing).

## 1. Data Models (`types.ts`)

Ensure your frontend types match these backend responses.

```typescript
// types/post.ts

export interface UserBasic {
  _id: string; // or id, depending on your normalizer
  firstName: string;
  lastName: string;
  username: string;
  profilePhoto?: string;
  headline?: string; // Newly added to population
}

export interface Post {
  _id: string;
  author: UserBasic;
  content: string;
  media: Array<{ type: 'image' | 'video'; url: string }>;
  
  // Engagement
  likesCount: number;
  commentsCount: number;
  isLiked: boolean; // Computed field from backend
  isSaved: boolean; // Computed field from backend

  createdAt: string;
  updatedAt: string;
}
```

---

## 2. API Hooks (React Query)

We use `tanstack/react-query` for caching and optimistic updates.

### A. Toggle Like Hook
**Endpoint**: `POST /posts/:id/like`
**Response**: `{ liked: boolean }`

This hook should **optimistically** update the UI so the user sees the "Heart" turn red instantly.

```typescript
// hooks/useToggleLike.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useToggleLike = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { data } = await api.post(`/posts/${postId}/like`);
      return data; // { liked: true/false }
    },
    onMutate: async (postId) => {
      // cancel outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['posts'] });

      // Snapshot previous value
      const previousPosts = queryClient.getQueryData(['posts']);

      // Optimistically update to the new value
      queryClient.setQueryData(['posts'], (old: any) => {
         if (!old) return old;
         // Note: If paginated, 'old' is { pages: [...], pageParams: [...] }
         // You need to map through pages and posts to find the specific post
         return {
           ...old,
           pages: old.pages.map((page: any) => ({
             ...page,
             posts: page.posts.map((post: any) => {
               if (post._id === postId) {
                 const wasLiked = post.isLiked;
                 return {
                   ...post,
                   isLiked: !wasLiked,
                   likesCount: wasLiked ? post.likesCount - 1 : post.likesCount + 1
                 };
               }
               return post;
             })
           }))
         };
      });

      return { previousPosts };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['posts'], context?.previousPosts);
    },
    onSettled: () => {
      // Invalidate to refetch true state
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};
```

### B. Get Post Likes (Likers List)
**Endpoint**: `GET /posts/:id/likes`
**Params**: `page`, `limit`

Use this for the "Liked By" modal.

```typescript
// hooks/usePostLikes.ts
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const usePostLikes = (postId: string, isOpen: boolean) => {
  return useQuery({
    queryKey: ['post-likes', postId],
    queryFn: async () => {
      const { data } = await api.get(`/posts/${postId}/likes`);
      return data; // { users: UserBasic[], total: number }
    },
    enabled: isOpen, // Only fetch when modal is open
    staleTime: 1000 * 30, // 30 seconds
  });
};
```

---

## 3. UI Implementation Strategy

### The "Like" Button
1.  **Icon**: Use `HeartIcon` (Outline when `!isLiked`, Solid Red when `isLiked`).
2.  **Count Display**:
    *   Display `likesCount`.
    *   Make the **count clickable**. Clicking it opens the "Liked By" modal.
    *   Clicking the **icon** toggles the like.

### The "Liked By" Modal
1.  **Trigger**: Clicking the likes count (e.g., "15 likes").
2.  **Component**: A simple Dialog/Modal.
3.  **Content**:
    *   Header: "Likes"
    *   Body: List of users.
    *   **Loading**: Skeleton list items.
    *   **Empty**: "No likes yet" (though logically if they clicked '0 likes' this shouldn't verify, but good fallback).
4.  **User Item**:
    *   Avatar (Circle)
    *   Name (Bold)
    *   Headline (Gray, smaller)
    *   **Action**: "Connect" or "View Profile" button (Optional, keep simple for v1).

### Code Snippet (MemberCard style)
```tsx
const LikedUserRow = ({ user }) => (
  <div className="flex items-center gap-3 py-2">
    <Avatar src={user.profilePhoto} alt={user.username} className="w-10 h-10" />
    <div className="flex-1">
      <h4 className="font-semibold text-sm">{user.firstName} {user.lastName}</h4>
      <p className="text-xs text-gray-500 truncate">{user.headline}</p>
    </div>
    {/* Optional: Add Follow/Connect button here */}
  </div>
);
```

## 4. Summary of Endpoints

| Feature | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Feed** | `GET` | `/posts/feed` | Main feed with mixed content (Following, Chapter, etc) |
| **Create** | `POST` | `/posts` | Create new post |
| **Get** | `GET` | `/posts/:id` | Get single post details |
| **Delete** | `DELETE` | `/posts/:id` | Delete own post |
| **Toggle Like** | `POST` | `/posts/:id/like` | Like/Unlike |
| **Get Likes** | `GET` | `/posts/:id/likes` | **[NEW]** Get list of likers |
| **Comments** | `GET` | `/posts/:id/comments` | Get comments |
| **Add Comment** | `POST` | `/posts/:id/comments` | Add comment |
