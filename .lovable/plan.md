

# Simplify Install Prompt: Dashboard Button

## Approach
Remove the auto-triggering install prompt overlay and replace it with a clear, on-brand "Add to Home Screen" card on the Dashboard. This is simpler, more reliable, and gives the user control.

## Changes

### 1. Dashboard.tsx -- Add install card
- Import `useInstallPrompt` hook
- Add a card below the "Purchase sessions" button (and above "Past Sessions") that shows only when the app is installable and not already in standalone mode
- On Android/desktop (where `beforeinstallprompt` fires): show a sage green "Add to home screen" button that triggers the native install
- On iOS/iPad: show gentle instructions ("Tap the share icon, then 'Add to Home Screen'")
- Include a small dismiss "x" or "Not now" link that hides it via localStorage
- Card styling matches the existing Dashboard aesthetic -- subtle, not pushy

### 2. useInstallPrompt.ts -- Fix iPad detection, remove auto-show
- Fix iPad detection: add `(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)` check
- Remove the auto-show-on-mount logic (no more localStorage session flag checks)
- Keep `showPrompt` but default it to `true` when installable and not dismissed -- let the Dashboard card handle visibility
- Keep `dismissPrompt` to store the "don't show again" preference

### 3. App.tsx -- Remove the floating InstallPrompt component
- Remove `<InstallPrompt />` from the app shell since the prompt now lives on the Dashboard

### 4. Cleanup
- Delete `src/components/InstallPrompt.tsx` (no longer needed as a floating overlay)
- Remove `has-completed-session` localStorage calls from Mirror.tsx and GuestChat.tsx (no longer needed for triggering)

## Result
Users see a calm, optional "Add to home screen" card on their Dashboard. One tap to install, or dismiss it. No timing bugs, no missed triggers, no floating overlays.

