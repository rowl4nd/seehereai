

# Fix Meta Pixel Build Error

## Problem
Vite's HTML parser (parse5) disallows `<img>` elements inside `<noscript>` when it's in the `<head>`. This causes the build to fail.

## Solution (1 file)

### `index.html`
- **Keep** the Meta Pixel `<script>` in the `<head>` (lines 35-47) -- no change needed there.
- **Move** the `<noscript>` block (lines 48-50) from `<head>` into the `<body>`, right after the opening `<body>` tag.
- Remove the closing comment from `<head>` and add it after the `<noscript>` in `<body>`.

Result:
```text
  </head>

  <body>
    <noscript><img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=850083951412164&ev=PageView&noscript=1"
    /></noscript>
    <!-- End Meta Pixel Code -->
    <div id="root"></div>
    ...
  </body>
```

This is the standard workaround for Vite/SPA projects and doesn't affect pixel functionality.

