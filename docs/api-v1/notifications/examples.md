# Notifications Module - Usage Examples

## Overview
Manage in-app, push, and email notifications. Register devices and handle user preferences.

---

## Displaying Notifications

### List View (React)
```typescript
const NotificationList = ({ token }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch('/api/v1/notifications?limit=20', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setNotifications(data.notifications));
  }, []);

  const handleRead = async (id) => {
    // Optimistic update
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
    
    // API call
    await fetch(`/api/v1/notifications/${id}/read`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
  };

  return (
    <ul>
      {notifications.map(note => (
        <li 
          key={note.id} 
          onClick={() => handleRead(note.id)}
          style={{ fontWeight: note.isRead ? 'normal' : 'bold' }}
        >
          <h4>{note.title}</h4>
          <p>{note.message}</p>
          <small>{new Date(note.createdAt).toLocaleDateString()}</small>
        </li>
      ))}
    </ul>
  );
};
```

---

## Push Notifications

### Device Registration (Mobile)
```typescript
// Call this on app launch or login
const registerDevice = async (pushToken, deviceId) => {
  const deviceType = Platform.OS === 'ios' ? 'ios' : 'android';
  
  await fetch('/api/v1/notifications/push-tokens', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      token: pushToken,
      deviceType,
      deviceId
    })
  });
};
```

---

## Preferences

### Updating Settings
```typescript
const toggleEmailNotifications = async (enabled) => {
  const response = await fetch('/api/v1/notifications/preferences', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      emailEnabled: enabled
    })
  });
  
  return await response.json();
};
```
