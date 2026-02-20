
# Replace all "Beta" wording with "Early"

A straightforward find-and-replace across two files.

## Changes in `src/pages/Index.tsx`

| Location | Current text | New text |
|----------|-------------|----------|
| Line 116 (comment) | `Beta Access Banner` | `Early Access Banner` |
| Line 119 | `Beta Testing Phase` | `Early Access Phase` |
| Line 120 | `#beta-signup` link | `#early-access` |
| Line 210 | `"Request beta access"` | `"Request early access"` |
| Line 258-260 | `#beta-signup` + `"Request beta access"` | `#early-access` + `"Request early access"` |
| Line 381-383 | `#beta-signup` + `"Request beta access"` | `#early-access` + `"Request early access"` |
| Line 497 (comment) | `Beta Access Signup` | `Early Access Signup` |
| Line 498 | `id="beta-signup"` | `id="early-access"` |
| Line 502 | `Join Our Beta` | `Join Early Access` |
| Line 534 | `htmlFor="beta-email"` | `htmlFor="early-email"` |
| Line 538 | `id="beta-email"` | `id="early-email"` |
| Line 549 | `htmlFor="beta-reason"` | `htmlFor="early-reason"` |
| Line 553 | `id="beta-reason"` | `id="early-reason"` |
| Line 566 | `"Request Beta Access"` | `"Request Early Access"` |
| Lines 46-48 | State vars `betaEmail`, `betaReason`, `betaSending`, `betaSent` | Rename to `earlyEmail`, `earlyReason`, `earlySending`, `earlySent` |
| Lines 53-56 | `#beta-signup` hash check | `#early-access` |
| Line 60 | `handleBetaSubmit` | `handleEarlySubmit` |

## Changes in `src/pages/Auth.tsx`

| Location | Current text | New text |
|----------|-------------|----------|
| Line 101 (comment) | `Beta Access Banner` | `Early Access Banner` |
| Line 104 | `Beta Testing Phase` | `Early Access Phase` |
| Line 105 | `/#beta-signup` | `/#early-access` |

## Technical notes

- All variable/function renames are internal -- no database or backend changes needed
- The `grant-beta-access` edge function name stays the same (it's a backend detail, not user-facing)
- The `allowed_testers` table name also stays the same
- Only user-visible text and code identifiers in the two page files are updated
