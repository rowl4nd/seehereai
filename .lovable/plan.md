

## Add Beta Access Signup Section

Add a beta signup form section just above the crisis/safety banner (before line 421). The form will collect email and an optional reason, then send the data via the existing `send-contact-email` edge function (which already uses Resend to forward to hello@seehere.ai). The `#beta-signup` anchor in the header banner will link to this section.

### Technical Details

**File: `src/pages/Index.tsx`**

1. Add `useState` import from React at the top
2. Import `Input` from `@/components/ui/input`, `Textarea` from `@/components/ui/textarea`, and `supabase` from `@/integrations/supabase/client`, and `toast` from `sonner`
3. Add state variables inside the `Index` component: `betaEmail`, `betaReason`, `betaSending`, `betaSent`
4. Add a submit handler that invokes the `send-contact-email` edge function with the beta signup data (name: "Beta Signup Request", email, message containing the reason)
5. Insert the following section before the safety notice (line 421), with `id="beta-signup"` so the banner link scrolls to it:

```
section with id="beta-signup"
  ScrollSection wrapper
    Centered container (max-w-lg)
      "Join Our Beta" heading (font-serif)
      Description paragraph about first 50 testers / 16 free sessions
      Form with:
        - Email input (required)
        - Optional textarea for "Why would you like to try SeeHere?"
        - Submit button (bg-[#4a7a4f])
      Success state: swap form for a thank-you message
      Footer text: "We'll review your request and send access within 24-48 hours."
```

**No new edge function needed** -- reuses the existing `send-contact-email` function, sending the beta signup as a contact email with a clear subject line ("Beta Signup Request").

