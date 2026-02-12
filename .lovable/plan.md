

## Make Auth Tab Buttons Double-Line

### What changes
Update the two tab triggers on the Auth page so each displays two lines of text:
- **Left tab**: "Nice to See you again" on line 1, "Sign in" on line 2
- **Right tab**: "First time Here?" on line 1, "Create account" on line 2

### Technical Details

**File: `src/pages/Auth.tsx`**

Replace the two `TabsTrigger` elements so each contains a flex-column layout with two lines:

```tsx
<TabsTrigger value="login" className="flex-1 text-sm flex flex-col items-center py-2">
  <span>Nice to <span style={{ color: '#709474', fontWeight: 700 }}>See</span> you again</span>
  <span className="text-xs text-muted-foreground">Sign in</span>
</TabsTrigger>

<TabsTrigger value="signup" className="flex-1 text-sm flex flex-col items-center py-2">
  <span>First time <span style={{ color: '#8775aa', fontWeight: 700 }}>Here</span>?</span>
  <span className="text-xs text-muted-foreground">Create account</span>
</TabsTrigger>
```

**File: `src/components/ui/tabs.tsx`**

Update the `TabsList` height from `h-10` to `h-auto` (or `h-14`) so it accommodates the taller two-line buttons without clipping.

No other files are affected.

