# Profiles Module - Usage Examples

## Overview
Examples for fetching public user profiles. This endpoint supports both authenticated and unauthenticated access, with different data visibility levels.

---

## Get Public Profile

### Basic Fetch (Unauthenticated)
```typescript
const getProfile = async (username) => {
  try {
    const response = await fetch(`/api/v1/profiles/${username}`);
    
    if (response.status === 404) {
      console.log('Profile not found');
      return;
    }
    
    if (response.status === 403) {
      console.log('This profile is private');
      return;
    }

    const data = await response.json();
    console.log('Public Profile:', data.profile);
    
  } catch (error) {
    console.error('Fetch error:', error);
  }
};
```

### Authenticated Request (For more access)
If the user is logged in, include the token. This allows viewing `CHAPTER_ONLY` profiles if you share the same chapter.

```typescript
const getProfileAuthenticated = async (identifier, token) => {
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api/v1/profiles/${identifier}`, {
    headers
  });

  const data = await response.json();
  return data.profile;
};
```

### React Component Example
```typescript
import { useEffect, useState } from 'react';

const PublicProfileView = ({ match }) => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const username = match.params.username;

  useEffect(() => {
    // Check if we have a token in store
    const token = localStorage.getItem('accessToken');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    fetch(`/api/v1/profiles/${username}`, { headers })
      .then(async (res) => {
         if (!res.ok) {
           const err = await res.json();
           throw new Error(err.error?.message || 'Failed to load');
         }
         return res.json();
      })
      .then(data => setProfile(data.profile))
      .catch(err => setError(err.message));
  }, [username]);

  if (error) return <div className="error">{error}</div>;
  if (!profile) return <div className="loading">Loading...</div>;

  return (
    <div className="profile-card">
      <img src={profile.profilePhoto || '/default-avatar.png'} alt={profile.username} />
      <h2>{profile.firstName} {profile.lastName}</h2>
      <h3>{profile.headline}</h3>
      
      <div className="tags">
        {profile.roles?.map(role => (
          <span key={role} className="badge">{role}</span>
        ))}
      </div>
      
      {/* Contact info will only render if visible */}
      {profile.email && (
        <a href={`mailto:${profile.email}`}>Contact Me</a>
      )}
    </div>
  );
};
```
