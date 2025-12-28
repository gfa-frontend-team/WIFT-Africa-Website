# Auth Module - Usage Examples

## Overview
Practical examples for integrating Auth Module endpoints into your frontend application.

---

## Register User

### Basic Usage (Fetch API)
```typescript
const response = await fetch('/api/v1/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'jane.doe@example.com',
    password: 'Password123!',
    firstName: 'Jane',
    lastName: 'Doe'
  })
});

const data = await response.json();
console.log(data);
```

### React Hook Example
```typescript
import { useState } from 'react';

function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle validation errors specifically
        if (response.status === 400 && errorData.error?.details) {
          throw new Error(`Validation failed: ${errorData.error.details[0].message}`);
        }
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}
```

---

## Login

### Basic Usage (Axios)
```typescript
import axios from 'axios';

try {
  const response = await axios.post('/api/v1/auth/login', {
    email: 'jane.doe@example.com',
    password: 'Password123!'
  });

  const { user, tokens } = response.data;
  
  // Store tokens securely
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  
  console.log('Welcome', user.firstName);
  
} catch (error) {
  if (error.response?.status === 401) {
    console.error('Invalid credentials');
  } else if (error.response?.status === 403) {
    console.error('Please verify your email');
  } else {
    console.error('Login failed:', error.message);
  }
}
```

---

## Token Refresh (Axios Interceptor)

### Automatic Refresh pattern
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1'
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');
      
      try {
        const { data } = await axios.post('/api/v1/auth/refresh', {
          refreshToken
        });
        
        localStorage.setItem('accessToken', data.tokens.accessToken);
        localStorage.setItem('refreshToken', data.tokens.refreshToken);
        
        api.defaults.headers.common['Authorization'] = `Bearer ${data.tokens.accessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed - logout user
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

---

## Logout

### Basic Usage
```typescript
const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');
  
  try {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refreshToken })
    });
  } catch (err) {
    console.error('Logout error', err);
  } finally {
    // Clear local state regardless of server response
    localStorage.clear();
    window.location.href = '/login';
  }
};
```
