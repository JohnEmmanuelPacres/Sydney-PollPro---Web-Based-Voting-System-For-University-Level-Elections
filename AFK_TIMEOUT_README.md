# AFK Timeout Feature (2024 Update)

## Overview
The AFK (Away From Keyboard) timeout feature automatically logs out inactive users to enhance security and session management. Users are warned before being logged out and can extend their session.

## Features

- **2-minute inactivity timeout** for all users (admin and voter)
- **Warning modal** appears at 30 seconds left, always visible and centered above all content
- **Live countdown** in the modal, updates every second
- **"Stay Logged In" button** resets the timer and closes the warning
- **Automatic logout**: User is signed out from Supabase and redirected to the landing page (`/`) on timeout
- **Global**: Applies to all pages via the main layout

## Implementation

### Core Components

#### 1. **useAFKTimeout Hook** (`src/utils/useAFKTimeout.ts`)
```typescript
const { remaining, isWarningActive, resetTimeout } = useAFKTimeout({
  timeoutMinutes: 2,
  warningSeconds: 30,
  onTimeout: async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
});
```
- Tracks user activity (mouse, keyboard, scroll, etc.)
- Triggers warning at 30 seconds left
- Triggers logout at 0

#### 2. **AFKWarningModal Component** (`src/components/AFKWarningModal.tsx`)
- Shows a warning message and live countdown
- Always visible above all content (high z-index)
- "Stay Logged In" button resets the timer

### Integration

- Both the hook and modal are used in the main layout (`ClientLayout.tsx`)
- The modal is shown when `isWarningActive` is true
- The timer and modal work globally on all pages

## Usage Example

**In your main layout (e.g., `ClientLayout.tsx`):**
```typescript
import AFKWarningModal from '@/components/AFKWarningModal';
import { useAFKTimeout } from '@/utils/useAFKTimeout';
import { supabase } from '@/utils/supabaseClient';

const { remaining, isWarningActive, resetTimeout } = useAFKTimeout({
  timeoutMinutes: 2,
  warningSeconds: 30,
  onTimeout: async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  }
});

return (
  <>
    <AFKWarningModal isOpen={isWarningActive} remaining={remaining} onStay={resetTimeout} />
    {/* ...rest of your layout... */}
  </>
);
```

## User Experience

- **After 90 seconds of inactivity**, a warning modal appears with a live countdown.
- **If the user clicks "Stay Logged In"** or interacts with the page, the timer resets.
- **If the timer reaches 0**, the user is signed out and redirected to the landing page.
- **Works on all pages** (admin and voter) as long as the layout is used.

## Security Benefits
- Prevents unauthorized access by logging out inactive users
- Reduces risk of session hijacking
- Ensures compliance for secure voting systems

## Limitations
- Supabase sessions persist in localStorage by default; browser close sign-out is a best-effort workaround, not 100% reliable
- For true session-only persistence, wait for Supabase to add this feature

## Troubleshooting
- If the modal does not appear, ensure the hook and modal are included in your main layout
- If users are not logged out, check that `supabase.auth.signOut()` is called in the `onTimeout` callback

---

_Last updated: 2024-07-03_ 