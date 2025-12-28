# Chapters Module - Usage Examples

## Overview
Administrative operations for managing chapter memberships. These endpoints require `CHAPTER_ADMIN` or `SUPER_ADMIN` privileges.

---

## Get Pending Requests

### React Example
```typescript
import { useEffect, useState } from 'react';

const PendingRequestsList = ({ chapterId, token }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetch(`/api/v1/chapters/${chapterId}/membership-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => setRequests(data.requests))
    .catch(console.error);
  }, [chapterId, token]);

  return (
    <ul>
      {requests.map(req => (
        <li key={req.id}>
          {req.user.firstName} - {req.memberType} Member
        </li>
      ))}
    </ul>
  );
};
```

---

## Approve Request

### Basic Usage
```typescript
const approveMember = async (chapterId, requestId, notes) => {
  const response = await fetch(
    `/api/v1/chapters/${chapterId}/membership-requests/${requestId}/approve`,
    {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ notes })
    }
  );
  
  return await response.json();
};
```

---

## Reject Request

### Basic Usage
```typescript
const rejectMember = async (chapterId, requestId, reason) => {
  const response = await fetch(
    `/api/v1/chapters/${chapterId}/membership-requests/${requestId}/reject`,
    {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        reason,
        canReapply: true
      })
    }
  );
  
  if (response.ok) {
    alert('Request rejected');
  }
};
```

---

## Get Chapter Members

### Axios Example
```typescript
import axios from 'axios';

const fetchMembers = async (chapterId) => {
  try {
    const { data } = await axios.get(`/api/v1/chapters/${chapterId}/members`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Found ${data.members.length} members`);
  } catch (err) {
    console.error('Failed to fetch members', err);
  }
};
```
