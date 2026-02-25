

# Add Meta Pixel to All Pages

## Overview
Add the Meta (Facebook) Pixel tracking code to the `<head>` of the site so it loads on every page.

## Approach
Since this is a single-page app (SPA), the pixel only needs to be added once in `index.html`. Every route will automatically include it.

## Changes (1 file)

### `index.html`
- Insert the Meta Pixel `<script>` and `<noscript>` snippet into the `<head>` section, right before the closing `</head>` tag.
- Pixel ID: `850083951412164`
- This covers all pages since the entire app is served from this single HTML file.

