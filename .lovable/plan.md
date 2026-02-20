

# Inject Organization Schema via React (no new dependency)

## Why

Static JSON-LD in `index.html` may not be reliably picked up by all crawlers for client-side apps. Injecting it from the React component ensures it's in the DOM when the page renders.

## Approach

Instead of adding `react-helmet-async` (which also requires a provider wrapper), we'll use a simple `useEffect` in the Index page component to inject the `<script type="application/ld+json">` tag into `document.head` at mount time, and remove it on unmount. This is a common, lightweight pattern that achieves the same result without a new dependency.

## Changes

### `src/pages/Index.tsx`

Add a `useEffect` near the top of the component that:

1. Creates a `<script>` element with `type="application/ld+json"`
2. Sets its content to the Organization schema JSON
3. Appends it to `document.head`
4. Removes it on cleanup (unmount)

```tsx
useEffect(() => {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "SeeHere",
    "url": "https://seehere.ai",
    "logo": "https://seehere.ai/og-image.png",
    "sameAs": [
      "https://www.instagram.com/seehere.ai",
      "https://www.facebook.com/profile.php?id=61588016676425"
    ]
  });
  document.head.appendChild(script);
  return () => { document.head.removeChild(script); };
}, []);
```

### `index.html`

Remove the existing static JSON-LD block (since the React component now handles it), avoiding duplication.

## No new dependencies

This uses plain DOM APIs -- no `react-helmet-async` or other packages needed.

