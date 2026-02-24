

# Scale Down Auth Page by 20%

## Overview
Reduce all sizing on the auth page -- fonts, spacing, padding, input fields, buttons, and icons -- by roughly 20% so it breathes properly at 100% browser zoom.

---

## Changes (1 file)

### `src/pages/Auth.tsx`

| Element | Current | New (~80%) |
|---------|---------|------------|
| Container max-width | `max-w-sm` (384px) | `max-w-xs` (320px) |
| Container spacing | `space-y-8` | `space-y-6` |
| Title heading | `text-6xl` | `text-5xl` |
| Title top margin | `-mt-4` | `-mt-3` |
| Title block spacing | `space-y-3` | `space-y-2` |
| Forgot subtitle | `text-sm` | `text-xs` |
| Form spacing | `space-y-6` | `space-y-4` |
| Field group spacing | `space-y-4` | `space-y-3` |
| Field label/input gap | `space-y-2` | `space-y-1.5` |
| Labels | `text-sm` | `text-xs` |
| Input fields | default `h-10 text-base` | `h-8 text-sm` (via className) |
| Forgot password link | `text-sm` | `text-xs` |
| "or" divider text | `text-xs` | `text-[10px]` |
| All buttons | default `h-10 text-sm` | `h-8 text-xs` (via className) |
| OAuth icon SVGs | `h-5 w-5` | `h-4 w-4` |
| Beta banner text | `text-sm` | `text-xs` |
| Beta banner padding | `py-1.5 px-6` | `py-1 px-4` |
| Header padding | `px-4 py-2` | `px-3 py-1.5` |
| Main padding | `px-6` | `px-4` |
| Back to sign in link | `text-sm` | `text-xs` |

All changes are isolated to `Auth.tsx` using Tailwind utility overrides on existing components -- no global component changes needed.

