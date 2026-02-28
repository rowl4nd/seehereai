

# Convert SeeHere to a Progressive Web App (PWA)

## Overview
Transform SeeHere into an installable PWA that feels like a native app when launched from the home screen -- no browser chrome, calm offline states, and safe-area-aware layouts.

## Phase 1: Core PWA Infrastructure

### 1.1 Install vite-plugin-pwa and configure
- Add `vite-plugin-pwa` dependency
- Configure in `vite.config.ts` with:
  - Manifest: name "SeeHere", short_name "SeeHere", display "standalone", orientation "portrait", background_color "#f8f6f3", theme_color "#4a7a4f"
  - Icon references: `/icons/icon-192.png` and `/icons/icon-512.png` (with `any maskable` purpose)
  - Workbox runtime caching: network-first for API/edge-function calls, cache-first for static assets
  - `navigateFallbackDenylist: [/^\/~oauth/]` so OAuth redirects are never cached
  - Offline fallback page

### 1.2 Create PWA icon assets
- Generate `public/icons/icon-192.png` and `public/icons/icon-512.png` from the existing SeeHere logo
- These will be used for home screen icons and splash screens

### 1.3 Update index.html
- Add `<link rel="manifest" href="/manifest.webmanifest">`
- Add iOS-specific meta tags:
  ```
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="default">
  <meta name="apple-mobile-web-app-title" content="SeeHere">
  <link rel="apple-touch-icon" href="/icons/icon-192.png">
  ```
- Update viewport: `width=device-width, initial-scale=1, viewport-fit=cover`
- Add `<meta name="theme-color" content="#4a7a4f">`

## Phase 2: Offline Experience

### 2.1 Offline fallback page
- Create a minimal offline fallback component that shows:
  - SeeHere logo centred on `#f8f6f3` background
  - Calm message: "It looks like you've lost connection. Your words are safe. Reconnect when you're ready."
  - No red error states or alarming language

### 2.2 Offline detection in the app
- Add a lightweight `useOnlineStatus` hook using `navigator.onLine` + event listeners
- Show a subtle top banner on the home/dashboard: "You're offline. Connect to start a session."
- Disable the chat input gracefully when offline (greyed out, not broken)
- Past session history remains browsable if cached

## Phase 3: Native-Feel UX Improvements

### 3.1 Safe area handling (index.css)
- Add `padding-top: env(safe-area-inset-top)` and `padding-bottom: env(safe-area-inset-bottom)` to the app shell
- Ensure chat input and nav sit above the iPhone home indicator

### 3.2 Remove browser feel (index.css)
- `user-select: none` on buttons, nav, labels (not chat content)
- `touch-action: manipulation` on interactive elements (removes 300ms tap delay)
- `overscroll-behavior: none` on chat containers to prevent pull-to-refresh
- `-webkit-touch-callout: none` on images/buttons to prevent long-press context menus
- `-webkit-overflow-scrolling: touch` on scrollable containers

### 3.3 Input and keyboard behaviour
- Ensure all input/textarea fields have `font-size: 16px` minimum (prevents iOS auto-zoom)
- Chat scroll adjusts when keyboard opens (existing `scrollIntoView` logic should handle this, will verify)

## Phase 4: Custom Install Prompt

### 4.1 Install prompt component
- Create an `InstallPrompt` component as a bottom-sheet style card (not a blocking modal)
- Copy: "Add SeeHere to your home screen for a quieter, more private experience."
- Sage green "Add to home screen" button + "Maybe later" text link
- On iOS (where `beforeinstallprompt` is unavailable), show instructional text: "Tap the share icon below, then 'Add to Home Screen'"

### 4.2 Trigger logic
- Listen for the `beforeinstallprompt` event and store it
- Show the prompt after the user completes their first session (on session end)
- Store "maybe later" in `localStorage` so it doesn't repeat
- Never show on first visit or mid-session

## Phase 5: Performance

### 5.1 Font loading
- Add `font-display: swap` to Google Fonts link (already uses `display=swap` -- confirmed)

### 5.2 Image lazy loading
- Add `loading="lazy"` to below-the-fold images on the landing page
- Above-the-fold hero images keep eager loading

## Deferred (Not in this implementation)

### Push Notifications
- The notification system (service worker push, backend scheduling, account settings toggle) is a significant feature that should be implemented separately
- This plan focuses on the installable PWA foundation first

---

## Technical Details

### Files to create:
- `public/icons/icon-192.png` -- PWA icon (generated from existing logo)
- `public/icons/icon-512.png` -- PWA icon (generated from existing logo)
- `src/hooks/useOnlineStatus.ts` -- online/offline detection hook
- `src/components/OfflineBanner.tsx` -- subtle offline notification banner
- `src/components/InstallPrompt.tsx` -- custom install prompt component
- `src/hooks/useInstallPrompt.ts` -- beforeinstallprompt event handler

### Files to modify:
- `package.json` -- add `vite-plugin-pwa` dependency
- `vite.config.ts` -- configure PWA plugin with manifest, workbox, and offline fallback
- `index.html` -- add iOS meta tags, viewport-fit=cover, theme-color, apple-touch-icon
- `src/index.css` -- safe area padding, user-select, touch-action, overscroll-behavior
- `src/App.tsx` -- integrate OfflineBanner and InstallPrompt components
- `src/pages/Mirror.tsx` -- disable input when offline, add overscroll-behavior to chat container
- `src/pages/GuestChat.tsx` -- disable input when offline, add overscroll-behavior to chat container

