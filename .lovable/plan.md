

# Add structured data (JSON-LD) to index.html

Add the provided Organization schema markup into the `<head>` of `index.html`, right before the closing `</head>` tag. This helps search engines understand the site's identity, logo, and social profiles.

## What changes

**`index.html`** -- insert the JSON-LD script block after the existing Twitter meta tags and before `</head>`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "SeeHere",
  "url": "https://seehere.ai",
  "logo": "https://seehere.ai/og-image.png",
  "sameAs": [
    "https://www.instagram.com/seehere.ai",
    "https://www.facebook.com/profile.php?id=61588016676425"
  ]
}
</script>
```

No other files are affected.

