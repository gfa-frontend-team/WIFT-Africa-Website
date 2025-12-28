# Messages Module - Usage Examples

## Overview
Messaging system supporting direct peer-to-peer chats and administrator broadcast announcements.

---

## Conversation List

### React Example
```typescript
import { useEffect, useState } from 'react';

const Inbox = ({ token }) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    fetch('/api/v1/messages/conversations?limit=20', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setConversations(data.conversations));
  }, []);

  return (
    <div className="inbox">
      {conversations.map(conv => (
        <div key={conv.id} className="conversation-item">
          {conv.type === 'DIRECT' ? (
             <h4>{conv.otherParticipant.firstName}</h4>
          ) : (
             <h4>📢 {conv.title}</h4>
          )}
          <p>{conv.lastMessage?.content}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## Send Message

### Direct Message
```typescript
const sendMessage = async (receiverId, text) => {
  const response = await fetch('/api/v1/messages', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      receiverId,
      content: text
    })
  });
  
  return await response.json();
};
```

---

## Send Broadcast (Admin Only)

### Broadcast to Chapter
```typescript
const sendChapterAnnouncement = async (chapterId, title, message) => {
  const response = await fetch('/api/v1/messages/broadcast', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      recipientType: 'CHAPTER',
      chapterId,
      title,
      content: message,
      description: 'Important Chapter Update'
    })
  });
  
  const result = await response.json();
  console.log(`Sent to ${result.data.recipientCount} members`);
};
```

---

## Polling Unread Counts

### React Hook Example
```typescript
const useUnreadCount = (token) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('/api/v1/messages/unread-count', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => setCount(data.total));
    }, 60000); // Poll every minute

    return () => clearInterval(interval);
  }, [token]);

  return count;
};
```
