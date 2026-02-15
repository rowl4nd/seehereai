

## Fix Layout Shift on Auth Page Tab Toggle

The "Welcome" title and form elements shift up/down when switching between Sign In and Create Account because the "Forgot your password?" link conditionally renders, changing the total content height within a vertically centered container.

### Fix

**File: `src/pages/Auth.tsx`**

Always render the "Forgot your password?" area (lines 193-203) regardless of mode, but use `invisible` to hide it when not in login mode. This reserves the vertical space so nothing above shifts.

Change from:
```jsx
{mode === "login" &&
  <div className="text-right -mt-2">
    <button ...>Forgot your password?</button>
  </div>
}
```

To:
```jsx
<div className={cn("text-right -mt-2", mode !== "login" && "invisible")}>
  <button ...>Forgot your password?</button>
</div>
```

This keeps the title, subtitle, tabs, and inputs perfectly still. The only thing that changes is the button label/color -- the "Forgot your password?" link just becomes invisible (but still occupies space) when on the Create Account tab.

