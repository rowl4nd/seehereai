

## Lighten Auth Form Placeholder Text

The placeholder text ("you@example.com" and "••••••••") on the login/signup form currently appears too dark, making it look like pre-filled text rather than hints.

### The Change

**File: `src/pages/Auth.tsx`**

Add a custom className or inline style to both `<Input>` elements to make their placeholder text a lighter color. This will be done by adding a Tailwind `placeholder:` modifier:

- Email input (line ~139): Add `placeholder:text-muted-foreground/30` to the className
- Password input (line ~150): Add `placeholder:text-muted-foreground/30` to the className

This uses the existing muted foreground color at 30% opacity, making the placeholders clearly distinguishable from actual typed text while still being readable as hints.

