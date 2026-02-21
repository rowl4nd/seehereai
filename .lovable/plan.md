

# Fix sitemap.xml Domain URLs

The file `public/sitemap.xml` still has all URLs pointing to `https://seehereai.lovable.app`. All 7 `<loc>` entries need to be updated to `https://seehere.ai`.

## Changes

**File: `public/sitemap.xml`**

Replace the entire file contents, changing every `<loc>` from `seehereai.lovable.app` to `seehere.ai`:

- `https://seehereai.lovable.app/` → `https://seehere.ai/`
- `https://seehereai.lovable.app/mental-clarity` → `https://seehere.ai/mental-clarity`
- `https://seehereai.lovable.app/work-stress` → `https://seehere.ai/work-stress`
- `https://seehereai.lovable.app/support-alternative` → `https://seehere.ai/support-alternative`
- `https://seehereai.lovable.app/contact` → `https://seehere.ai/contact`
- `https://seehereai.lovable.app/terms` → `https://seehere.ai/terms`
- `https://seehereai.lovable.app/privacy` → `https://seehere.ai/privacy`

No other files affected.

