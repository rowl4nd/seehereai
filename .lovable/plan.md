

## Plan: Two-stage email refusal in GuestChat

### Change

In `src/pages/GuestChat.tsx`, replace the current single-refusal-then-disable flow with a two-stage approach:

**First refusal** — Instead of ending the session, inject a "last chance" assistant message:
> "No problem at all. If you change your mind, just type your email address below — otherwise feel free to close this tab whenever you're ready."

Keep `awaitingEmail = true` and add a new state `finalChance = true`. The input stays enabled and only accepts email addresses.

**Second refusal** (non-email typed while `finalChance` is true) — Now end the session with the existing warm closing message and disable input.

### Technical detail

- Add `const [finalChance, setFinalChance] = useState(false)` (+ persist in sessionStorage like `awaitingEmail`)
- In `handleSend`, when `awaitingEmail && !authenticated`:
  - If email → signup (unchanged)
  - If not email AND `!finalChance` → inject last-chance message, set `finalChance = true`, keep `awaitingEmail = true`
  - If not email AND `finalChance` → call existing `handleEmailRefusal()` to end session
- Update placeholder text for `finalChance` state: "Enter your email address or type to close..."

### Files
- `src/pages/GuestChat.tsx` — only file changed

