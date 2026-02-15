

## Restore Light Placeholder Text on Auth Inputs

The `placeholder:text-muted-foreground/30` class that was added earlier got lost during the button color update. Both the email and password inputs need it re-added.

### Technical Details

**File: `src/pages/Auth.tsx`**

- **Email input (line 158)**: Change className from `"bg-card border-border/50 focus:border-primary/50"` to `"bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"`
- **Password input (line 175)**: Change className from `"bg-card border-border/50 focus:border-primary/50"` to `"bg-card border-border/50 focus:border-primary/50 placeholder:text-muted-foreground/30"`

This restores the light, subtle placeholder appearance so "you@example.com" and the dots don't look like typed text.

