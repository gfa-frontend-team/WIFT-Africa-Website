# Posts Module - Usage Examples

## Overview
Examples for creating posts, interacting with the feed, and managing comments.

---

## Get Feed

### React Example (Infinite Scroll)
```typescript
import { useEffect, useState } from 'react';

const NewsFeed = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/posts/feed?page=${page}&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setPosts(prev => [...prev, ...data.posts]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page]); // Re-fetch when page changes

  return (
    <div className="feed">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      <button onClick={() => setPage(p => p + 1)} disabled={loading}>
        Load More
      </button>
    </div>
  );
};
```

---

## Interact (Like/Comment)

### Like Function
```typescript
const toggleLike = async (postId, token) => {
  const response = await fetch(`/api/v1/posts/${postId}/like`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.liked; // returns updated status
};
```

### Add Comment
```typescript
const addComment = async (postId, text, token) => {
  const response = await fetch(`/api/v1/posts/${postId}/comments`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content: text })
  });
  return await response.json();
};
```

---

## Share Post

### Basic Usage
```typescript
const sharePost = async (originalPostId, comment) => {
  const response = await fetch(`/api/v1/posts/${originalPostId}/share`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      shareComment: comment,
      visibility: 'PUBLIC'
    })
  });
  
  if (response.ok) {
    alert('Shared successfully!');
  }
};
```
