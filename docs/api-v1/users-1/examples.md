# Users Module - Usage Examples

## Overview
Practical examples for integrating Users module endpoints into your frontend application.

---

## Get Current User

### Basic Usage (Fetch API)
```typescript
const response = await fetch('/api/v1/users/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log('User:', data.user);
```

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/api/v1/users/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) throw new Error('Failed to fetch user');
        
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [token]);

  return { user, loading, error };
}
```

---

## Update user Profile

### Basic Usage (Axios)
```typescript
import axios from 'axios';

const updateProfile = async (profileData) => {
  try {
    const response = await axios.patch('/api/v1/users/me/profile', profileData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 400) {
      console.error('Validation Error:', error.response.data.message);
    }
    throw error;
  }
};

// Usage
updateProfile({
  bio: 'Filmmaker based in Lagos',
  headline: 'Director | Producer',
  availabilityStatus: 'AVAILABLE'
});
```

---

## Upload Profile Photo

### Basic Usage (Fetch API)
```typescript
const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append('photo', file);

  const response = await fetch('/api/v1/users/me/profile-photo', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
      // Note: Content-Type is automatically set with boundary for FormData
    },
    body: formData
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return await response.json();
};
```

---

## Update Username

### React Handler with Error Checking
```typescript
const handleUsernameChange = async (newUsername) => {
  try {
    const response = await fetch('/api/v1/users/me/username', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username: newUsername })
    });

    if (response.status === 409) {
      alert('Username is already taken');
      return;
    }

    if (response.status === 429) {
      alert('Too many username changes. Please try again next month.');
      return;
    }

    if (!response.ok) throw new Error('Failed to update');

    const result = await response.json();
    console.log('New username:', result.username);
    
  } catch (error) {
    console.error(error);
  }
};
```

---

## Check Username Availability

### Debounced Check Example
```typescript
import { useState, useEffect } from 'react';
import { debounce } from 'lodash';

function UsernameInput() {
  const [username, setUsername] = useState('');
  const [isAvailable, setIsAvailable] = useState(null);

  const checkAvailability = async (value) => {
    if (value.length < 3) return;
    
    const response = await fetch(`/api/v1/users/me/username/check?username=${value}`);
    const data = await response.json();
    setIsAvailable(data.available);
  };

  // Create debounced function once
  const debouncedCheck = debounce(checkAvailability, 500);

  const handleChange = (e) => {
    const val = e.target.value;
    setUsername(val);
    if (val) debouncedCheck(val);
    else setIsAvailable(null);
  };

  return (
    <div>
      <input value={username} onChange={handleChange} />
      {isAvailable === true && <span style={{color: 'green'}}>Available</span>}
      {isAvailable === false && <span style={{color: 'red'}}>Taken</span>}
    </div>
  );
}
```

---

## Get Privacy Settings

### Usage
```typescript
const getPrivacy = async () => {
  const response = await fetch('/api/v1/users/me/privacy', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const { privacySettings } = await response.json();
  
  if (privacySettings.profileVisibility === 'PRIVATE') {
    console.log('Profile is currently private');
  }
};
```

---

## Upload CV

### Usage
```typescript
const uploadCV = async (fileInput) => {
  const file = fileInput.files[0];
  if (file.size > 10 * 1024 * 1024) {
    alert('File too large (max 10MB)');
    return;
  }

  const formData = new FormData();
  formData.append('cv', file);

  try {
    const response = await fetch('/api/v1/users/me/cv', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    
    const result = await response.json();
    console.log('CV uploaded:', result.cvFileName);
  } catch (error) {
    console.error('Upload error:', error);
  }
};
```

### Common Errors

#### 400 Bad Request
**Cause**: Validation failed (e.g., username regex mismatch, bio too long).
**Solution**: Check input against validation rules in `endpoints.md`.

#### 401 Unauthorized
**Cause**: Missing or invalid Bearer token.
**Solution**: Ensure user is logged in and token is attached to headers.

#### 404 Not Found
**Cause**: Resource (like a profile or CV) does not exist for this user.
**Solution**: Ensure the user has created a profile/CV before accessing.
