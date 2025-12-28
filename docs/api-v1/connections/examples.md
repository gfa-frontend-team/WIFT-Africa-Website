# Connections Module - Usage Examples

## Overview
Manage professional network connections: send requests, accept invites, and view your network.

---

## Connection Flow

### 1. Send Request
```typescript
const sendInvite = async (userId, customMessage) => {
  const response = await fetch('/api/v1/connections/requests', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      receiverId: userId,
      message: customMessage || "Let's connect!"
    })
  });
  return await response.json();
};
```

### 2. View Pending Requests (Incoming)
```typescript
const getIncomingRequests = async () => {
  const response = await fetch('/api/v1/connections/requests?type=incoming', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await response.json();
  return data.requests;
};
```

### 3. Accept Request
```typescript
const acceptInvite = async (requestId) => {
  const response = await fetch(`/api/v1/connections/requests/${requestId}/accept`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (response.ok) {
    console.log("You are now connected!");
  }
};
```

---

## Connection Management

### Remove a Connection
```typescript
const disconnect = async (connectionId) => {
  if (confirm("Are you sure you want to remove this connection?")) {
    await fetch(`/api/v1/connections/${connectionId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
};
```

### Check Status
```javascript
// Useful for UI buttons (Connect vs Pending vs Message)
const checkStatus = async (targetUserId) => {
  const res = await fetch(`/api/v1/connections/check/${targetUserId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const { connected } = await res.json();
  return connected;
};
```

---

## Blocking

### Block User
```typescript
const blockUser = async (userId, reason) => {
  await fetch('/api/v1/connections/block', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, reason })
  });
};
```
