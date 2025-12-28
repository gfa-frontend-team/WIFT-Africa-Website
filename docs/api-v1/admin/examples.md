# Admin Module - Usage Examples

## Overview
Super Admin operations for global chapter management and system oversight.

---

## List Chapters

### React Example with Filtering
```typescript
import { useState, useEffect } from 'react';

const ChaptersTable = ({ token }) => {
  const [chapters, setChapters] = useState([]);
  const [filters, setFilters] = useState({ page: 1, limit: 10 });

  useEffect(() => {
    const params = new URLSearchParams(filters);
    
    fetch(`/api/v1/admin/chapters?${params}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => setChapters(data.chapters));
  }, [filters, token]);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Status</th>
          <th>Members</th>
        </tr>
      </thead>
      <tbody>
        {chapters.map(chapter => (
          <tr key={chapter.id}>
            <td>{chapter.name}</td>
            <td>{chapter.code}</td>
            <td>{chapter.isActive ? 'Active' : 'Inactive'}</td>
            <td>{chapter.memberCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
```

---

## Create Chapter

### Basic Usage
```typescript
const createChapter = async (chapterData) => {
  try {
    const response = await fetch('/api/v1/admin/chapters', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chapterData)
    });

    if (response.status === 409) {
      alert('Chapter code or name already exists');
      return;
    }

    const data = await response.json();
    console.log('Chapter Created:', data.chapter.id);
  } catch (err) {
    console.error(err);
  }
};
```

---

## Add Chapter Admin

### Basic Usage
```typescript
const promoteUser = async (chapterId, userId) => {
  const response = await fetch(`/api/v1/admin/chapters/${chapterId}/admins`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ userId })
  });

  const data = await response.json();
  if (response.ok) {
    alert('User promoted to Chapter Admin');
  } else {
    alert(data.error.message);
  }
};
```
