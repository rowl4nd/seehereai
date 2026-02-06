

# Move "End Session" Button to the Bottom Bar

## What Changes

The "End session" button will be moved from the top header down to the footer area, next to the timer progress bar. This keeps it always visible and within easy reach, and simplifies the header to just show the logo.

## Layout After the Change

```text
+----------------------------------+
| see here                         |  <-- Header (logo only)
+----------------------------------+
|                                  |
|        Chat messages             |
|                                  |
+----------------------------------+
| [===progress bar===]  12:34      |  <-- Timer row
|              End session         |  <-- End session button below timer
+----------------------------------+
| [Type here...         ] [Send]   |  <-- Input area
+----------------------------------+
```

## Technical Details

Single file change: `src/pages/Mirror.tsx`

1. **Remove the "End session" button from the header** (lines 277-284) -- the header will just contain the "see here" logo link.

2. **Add the "End session" button into the footer timer area** -- placed below the progress bar, right-aligned, as a small ghost button. When there is no timer visible yet, the button will still appear at the top of the footer so it is always accessible.

3. **No logic changes** -- the `handleEndSession` function and all session behaviour remain exactly the same. This is purely a layout adjustment.

