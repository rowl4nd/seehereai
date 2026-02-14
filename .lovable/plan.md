
# Disable Voice Mode (Keep Code, Hide UI)

## Summary
Hide the voice mode microphone button from the Mirror session UI so users cannot activate it. All voice-related code stays in place for future re-enabling.

## Change

### `src/pages/Mirror.tsx`
1. **Hide the mic toggle button** -- Wrap the mic `<Button>` (around lines 721-730) in a condition that prevents rendering. The simplest approach: wrap with `{false && (...)}` or add a `VOICE_ENABLED` flag set to `false`.
2. **Hide the voice-mode listening UI** -- The block at lines 688-718 that renders the listening/processing state when `voiceModeEnabled` is true will never activate since the button is hidden, but for safety we can guard it the same way.

No other files need changes. The hooks, edge functions, and all voice infrastructure remain untouched and ready to re-enable by flipping the flag to `true`.

## Technical Details

A `const VOICE_FEATURE_ENABLED = false;` constant will be added near the top of the component. The mic button and voice-mode input area will be conditionally rendered only when this flag is `true`. To re-enable later, simply change it to `true`.
