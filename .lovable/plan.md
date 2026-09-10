# Access model change: codes and contact only, no self-serve buying

Move SeeHere from "buy more sessions" to two routes beyond the 2 free sessions: an organisation
access code, or a personally arranged code obtained by contacting you. Payment pages stay alive
behind a direct link, but disappear from navigation and prompts.

## A. Dashboard (`src/pages/Dashboard.tsx`)

- Remove the "Purchase sessions" button for people who are not organisation users and hold no
  credit balance.
- In its place: keep the existing "Have an access code?" entry, and add below it a quiet link
  "Don't have a code? Contact us for personal access" going to `/contact`.
- People with a remaining credit balance keep their existing behaviour untouched, including the
  "Get more sessions" link in the out-of-sessions state (that state only applies to them now, so
  the copy there becomes the access-code + contact pair too).
- Nothing changes for organisation users.

## B. Cooldown page (`src/pages/Cooldown.tsx`)

- Read `org_access` from the profile (same pattern as the dashboard).
- Organisation users: warm message, no payment framing — "Your organisation gives you unlimited
  access — ready when you are."
- Everyone else after their second free session: replace the "£2 / See session options" block with
  the access-code entry plus "Don't have a code? Contact us for personal access" → `/contact`.
- Remove every link to `/credits` from this page.

## C. Homepage (`src/pages/Index.tsx`)

- Replace the Pricing section with an "Access" section, `id="access"`, keeping the existing
  section styling. Two cards:
  1. **Access through your organisation** — charities, universities and employers can offer
     SeeHere to their people; access-code entry point; plus "Interested in offering SeeHere to
     your community? Get in touch" → `/contact`.
  2. **Personal access** — no organisation? Contact us directly to arrange access → `/contact`.
- Written for an organisation decision-maker reading cold: clear, warm, no hard sell. Built as one
  self-contained section component so it can later be lifted into a dedicated `/organisations`
  page or per-partner routes without a rewrite.
- Add "For organisations" to the header next to FAQs and Blog.
- Update the "How much does it cost?" FAQ answer and the matching JSON-LD copy in the same file to
  describe the new model (2 free sessions, then an organisation or personal access code).

## D. Terms — draft only, needs sign-off

Rewrite Section 5 of `src/pages/Terms.tsx` to describe access codes and personally arranged
access, note that sessions are not sold directly to new users, and keep the existing wording that
already-held credits remain valid and non-refundable, with Stripe still named for anyone who
purchased previously.

**This is a legal change and is flagged for Jack/Ce sign-off before it should be treated as
final.** I will show the drafted wording in chat when I make the edit.

## E. RASA codes

Found three:

| Code | Label | Active | Redemptions |
|---|---|---|---|
| SEEHERE-RASA-2026 | Charity staff pilot | no | 1 |
| RASA-SEEHERE-2026 | RASA Staff Test Code | no | 1 |
| RASA-2026 | RASA Staff Testing | yes | 0 |

Action: delete `RASA-2026` (unredeemed); leave the two redeemed codes deactivated as they already
are. Note: the two people who already redeemed keep their unlimited access — say the word if you
want that revoked too.

## F. Sitewide sweep — found so far

- `src/pages/SupportAlternative.tsx` — comparison table lists SeeHere as "Free to try · from £2".
  Will change to free-to-try plus access-code wording.
- `src/pages/Mirror.tsx` — sends people to the payment page when out of credits; will send them to
  the dashboard instead.
- `src/pages/PaymentSuccess.tsx` — links back to the payment page; left as-is since it is only
  reached after a purchase.
- `src/pages/Credits.tsx` and the `/credits` route — untouched and still reachable by direct link.
- Blog and article pages mention the cost of *private therapy* (£60–£150), not SeeHere pricing —
  correct as-is, no change.
- `src/pages/Privacy.tsx` references Stripe for payment processing — still accurate for existing
  credit holders, no change.

## Not touched

Age gate, disclosure modal, consent flow, crisis signposting, access-code database tables and
functions, Stripe checkout backend.
