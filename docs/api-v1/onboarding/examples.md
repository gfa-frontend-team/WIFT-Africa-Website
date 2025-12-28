# Onboarding Module - Usage Examples

## Overview
Practical examples for integrating Onboarding Module endpoints into your frontend application.
**Note**: All endpoints require a valid Bearer token in the `Authorization` header.

---

## Get Progress

### React Hook Example
```typescript
import { useState, useEffect } from 'react';

function useOnboardingProgress() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/v1/onboarding/progress', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setData(data);
      setLoading(false);
    });
  }, []);

  return { data, loading };
}
```

---

## Submit Roles (Step 1)

### Basic Usage (Fetch)
```typescript
const submitRoles = async (roles, primaryRole) => {
  const response = await fetch('/api/v1/onboarding/roles', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      roles,
      primaryRole
    })
  });
  
  return await response.json();
};

// Usage
submitRoles(['DIRECTOR', 'WRITER'], 'DIRECTOR');
```

---

## Submit Specializations (Step 2)

### Basic Usage (Axios)
```typescript
import axios from 'axios';

const submitSpecializations = async (data) => {
  try {
    const response = await axios.post('/api/v1/onboarding/specializations', data, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Saved:', response.data);
  } catch (error) {
    console.error('Error saving specializations:', error.response.data);
  }
};

// Usage
submitSpecializations({
  writerSpecialization: 'FILM',
  crewSpecializations: ['CINEMATOGRAPHER']
});
```

---

## Select Chapter (Step 3)

### Basic Usage
```typescript
const joinChapter = async (chapterId, memberType, membershipId) => {
  const body = {
    chapterId,
    memberType, // 'NEW' or 'EXISTING'
    ...(memberType === 'EXISTING' && { membershipId })
  };

  const response = await fetch('/api/v1/onboarding/chapter', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const result = await response.json();
  if (result.requiresApproval) {
    alert('Your request is pending approval.');
  }
};
```

---

## Setup Profile (Step 4 - with File Upload)

### Code Example
```typescript
const updateProfile = async (profileData, cvFile) => {
  const formData = new FormData();
  
  // Append text fields
  Object.keys(profileData).forEach(key => {
    if (profileData[key]) {
      formData.append(key, profileData[key]);
    }
  });

  // Append file if exists
  if (cvFile) {
    formData.append('cv', cvFile);
  }

  try {
    const response = await fetch('/api/v1/onboarding/profile', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type here, browser sets it with boundary
      },
      body: formData
    });
    
    return await response.json();
  } catch (error) {
    console.error('Upload failed', error);
  }
};
```

---

## Complete Onboarding (Step 5)

### Basic Usage
```typescript
const completeOnboarding = async () => {
  const response = await fetch('/api/v1/onboarding/accept-terms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({}) // Empty body
  });
  
  const result = await response.json();
  if (result.onboardingComplete) {
    window.location.href = '/dashboard';
  }
};
```
