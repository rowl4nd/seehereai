

## Plan: Add Blog Section Structure

Create two empty page files and wire up routing + footer link.

### Changes

1. **Create `src/pages/Blog.tsx`** — placeholder component returning `<div>Blog</div>`

2. **Create `src/pages/NHSWaitingList.tsx`** — placeholder component returning `<div>NHS Waiting List</div>`

3. **Update `src/App.tsx`** — add imports for both pages and two new routes:
   - `/blog` → `<Blog />`
   - `/blog/nhs-waiting-list` → `<NHSWaitingList />`

4. **Update `src/pages/Index.tsx`** — add `{ href: "/blog", label: "Journal" }` above the existing Mental Clarity link in the footer

You can then paste your actual code directly into the two new files.

