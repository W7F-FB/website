# Error Prevention Utilities

This document explains how to prevent client-side exceptions from happening in the first place.

## Available Utilities

### 1. `useSafeAsync` Hook

Use this hook instead of manual `useEffect` + async functions to automatically catch and log errors.

**Before:**
```tsx
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch('/api/data');
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  fetchData();
}, []);
```

**After:**
```tsx
import { useSafeAsync } from '@/hooks/use-safe-async';

useSafeAsync(
  async () => {
    const response = await fetch('/api/data');
    if (!response.ok) throw new Error('Failed to fetch');
    const data = await response.json();
    setData(data);
  },
  [],
  {
    onError: (error) => {
      // Optional: handle error (already logged automatically)
    },
    onSuccess: (data) => {
      // Optional: handle success
    },
    enabled: true, // Optional: conditionally enable
  }
);
```

### 2. `ErrorBoundary` Component

Wrap components that might throw errors to prevent them from crashing the entire app.

```tsx
import { ErrorBoundary } from '@/components/website-base/error-boundary';

<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>Error: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    // Optional: additional error handling
  }}
>
  <YourComponent />
</ErrorBoundary>
```

### 3. Safe Access Utilities

Use these utilities to safely access nested properties or call functions.

```tsx
import { safeAccess, safeGet, safeCall, safeAsync } from '@/lib/safe-access';

// Safe property access
const value = safeAccess(
  user,
  (u) => u.profile.address.city,
  'Unknown',
  'user-city-access'
);

// Safe object property access
const name = safeGet(user, 'name', 'Anonymous');

// Safe function call
const result = safeCall(someFunction, arg1, arg2);

// Safe async operation
const data = await safeAsync(
  fetch('/api/data').then(r => r.json()),
  null,
  'fetch-data'
);
```

### 4. `dev.error()` Function

Use this for manual error logging with context.

```tsx
import { dev } from '@/lib/dev';

try {
  // risky operation
} catch (error) {
  dev.error(error, {
    source: 'component-name',
    additionalContext: 'value',
  });
}
```

## Best Practices

1. **Wrap risky components** with `ErrorBoundary` at strategic points
2. **Use `useSafeAsync`** for all async operations in `useEffect`
3. **Use safe access utilities** when accessing nested data structures
4. **Always provide fallbacks** for safe access functions
5. **Add context** to error logs to make debugging easier

## Example: Complete Component

```tsx
'use client';

import { useState } from 'react';
import { ErrorBoundary } from '@/components/website-base/error-boundary';
import { useSafeAsync } from '@/hooks/use-safe-async';
import { safeAccess, safeAsync } from '@/lib/safe-access';
import { dev } from '@/lib/dev';

function DataComponent() {
  const [data, setData] = useState(null);

  useSafeAsync(
    async () => {
      const result = await safeAsync(
        fetch('/api/data').then(r => r.json()),
        null,
        'fetch-user-data'
      );
      
      if (result) {
        const name = safeAccess(
          result,
          (r) => r.user.profile.name,
          'Unknown',
          'user-name-access'
        );
        setData({ ...result, displayName: name });
      }
    },
    [],
    {
      onError: (error) => {
        dev.error(error, { source: 'DataComponent' });
      },
    }
  );

  return <div>{data?.displayName || 'Loading...'}</div>;
}

export default function Page() {
  return (
    <ErrorBoundary>
      <DataComponent />
    </ErrorBoundary>
  );
}
```

