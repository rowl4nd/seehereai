

## Lighten Placeholder Text in Beta Signup Form

The email input and textarea placeholders in the beta signup form appear too dark, making them look like typed text. Adding the same `placeholder:text-muted-foreground/30` class used on the Auth page will fix this.

### Technical Details

**File: `src/pages/Index.tsx`**

- **Email input (~line 487)**: Add `placeholder:text-muted-foreground/30` to its className
- **Textarea (~line 499)**: Add `placeholder:text-muted-foreground/30` to its className

