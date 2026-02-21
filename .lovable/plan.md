

# Generate Static `sitemap.xml`

Create a new file `public/sitemap.xml` listing all public routes for search engine crawlers.

## New file: `public/sitemap.xml`

Include the following URLs with the published domain `https://seehereai.lovable.app`:

- `/` (homepage) -- highest priority (1.0), daily changefreq
- `/mental-clarity` -- priority 0.7, monthly
- `/work-stress` -- priority 0.7, monthly
- `/support-alternative` -- priority 0.7, monthly
- `/terms` -- priority 0.3, yearly
- `/privacy` -- priority 0.3, yearly
- `/contact` -- priority 0.5, monthly

Auth-gated pages (dashboard, mirror, onboarding, etc.) will be excluded since they require login and aren't useful for crawlers.

No other file changes needed -- Vite automatically serves files from the `public/` folder at the root path, so it will be accessible at `/sitemap.xml`.

