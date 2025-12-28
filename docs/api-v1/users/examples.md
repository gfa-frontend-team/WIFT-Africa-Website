# Users Module - Usage Examples

## Overview
Examples for user profile management, including file uploads and privacy settings.

---

## Get My Profile

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

function useMyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/users/me/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setProfile(data);
      setLoading(false);
    });
  }, []);

  return { profile, loading };
}
```

---

## Update Profile

### Basic Usage (Axios)
```typescript
import axios from 'axios';

const updateProfile = async (updates) => {
  try {
    const response = await axios.patch('/api/v1/users/me/profile', updates, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Updated:', response.data.profile);
  } catch (err) {
    console.error('Update failed', err);
  }
};

// Usage
updateProfile({
  headline: 'Award Winning Producer',
  availabilityStatus: 'BUSY'
});
```

---

## Upload Profile Photo

### Javascript with FormData
```typescript
const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/v1/users/me/profile-photo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  if (data.photoUrl) {
    console.log('New ID:', data.photoUrl);
  }
};
```

---

## Update Username

### Error Handling Example
```typescript
const changeUsername = async (newUsername) => {
  try {
    const response = await fetch('/api/v1/users/me/username', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: newUsername })
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        throw new Error('Username taken');
      } else if (response.status === 429) {
        throw new Error(`Too many changes. Remaining: ${data.changesRemaining}`);
      } else {
        throw new Error(data.error.message);
      }
    }

    console.log('Success!', data.username);

  } catch (error) {
    alert(error.message);
  }
};
```

---

## View Public Profile

### Example
```typescript
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ProfilePage() {
  const { identifier } = useParams(); // username or ID
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/v1/profiles/${identifier}`)
      .then(res => {
        if (res.status === 403) throw new Error('Private Profile');
        if (res.status === 404) throw new Error('Not Found');
        return res.json();
      })
      .then(data => setData(data.profile))
      .catch(err => setError(err.message));
  }, [identifier]);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h1>{data.firstName} {data.lastName}</h1>
      <p>{data.headline}</p>
      {/* Conditionally render fields that might be hidden via privacy */}
      {data.email && <p>Contact: {data.email}</p>}
    </div>
  );
}
```
