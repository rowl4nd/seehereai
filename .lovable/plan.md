
## Fix Hash Scroll to Beta Signup Form

When clicking the "Join our first 50 testers" link on the Auth page, the browser navigates to the homepage but doesn't scroll to the `#beta-signup` section. This happens because in a single-page app, React renders the content after navigation, so the target element doesn't exist yet when the browser tries to scroll.

### Fix

**File: `src/pages/Index.tsx`**

Add a `useEffect` hook that checks for the `#beta-signup` hash in the URL on mount. If present, wait a short delay (e.g. 500ms) for the page to fully render, then scroll the element into view smoothly.

```
useEffect(() => {
  if (window.location.hash === '#beta-signup') {
    setTimeout(() => {
      document.getElementById('beta-signup')?.scrollIntoView({ behavior: 'smooth' });
    }, 500);
  }
}, []);
```

This ensures the scroll works whether the user arrives from the Auth page or any external link containing the `#beta-signup` anchor.
