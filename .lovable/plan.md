

## Change "Create Account" Button to Lavender

When the user switches to the signup tab, the button text changes to "Create account". The button should also change its background color from the default sage green to lavender to match the purple branding of the "Here" tab.

### Technical Details

**File: `src/pages/Auth.tsx`**

Update the `<Button>` element (around line 173) to conditionally apply a lavender background when in signup mode:

- Current: `className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"`
- Updated: Add a conditional class so that when `mode === "signup"`, the button uses lavender (`#b9a3e0`) instead of the default green primary color
- The className will become: `cn("w-full text-white", mode === "signup" ? "bg-[#b9a3e0] hover:bg-[#a48fd0]" : "bg-primary hover:bg-primary/90")`
- Import `cn` from `@/lib/utils` (if not already imported)

This keeps the green button for "Sign in" and "Send reset link", and switches to lavender only for "Create account" -- matching the purple accent used on the "First time Here?" tab.

