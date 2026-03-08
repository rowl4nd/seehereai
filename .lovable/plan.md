

## Plan: Add FounderStory page + Blog/Router integration

### Changes

**1. Create `src/pages/FounderStory.tsx`**
- Reconstruct the full JSX using the existing blog page pattern (from TalkingToSomeone.tsx) combined with all the text content you provided
- Includes: header with logo + back link, hero section with Ce's photo + intro, the full story text with blockquote, credentials list, CTA section, footer
- Uses `cePhoto` from `@/assets/ce-photo.jpg`
- Uses DisclosureModal for the "Try SeeHere free" CTA (matching other blog pages)

**2. Update `src/App.tsx`**
- Add import for FounderStory
- Add route: `/blog/our-story`

**3. Update `src/pages/Blog.tsx`**
- Add new post entry at the top of the `posts` array with slug `/blog/our-story`, title "Hi. I'm Ce — The Therapist Who Built SeeHere", tag "Our Story", 4 min read

