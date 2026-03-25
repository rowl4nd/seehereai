

## Plan: Rotating placeholder prompts in hero textarea

**File:** `src/pages/Index.tsx`

### Changes

1. **Add `HERO_PLACEHOLDERS` array** above the `Index` component (after imports):
```ts
const HERO_PLACEHOLDERS = [
  "I keep replaying a conversation in my head...",
  "I'm feeling overwhelmed and can't switch off...",
  "Something happened and I need to talk it through...",
  "I feel stuck and don't know where to start...",
];
```

2. **Add state and effect** inside the `Index` component:
   - `const [placeholderIndex, setPlaceholderIndex] = useState(0);`
   - `useEffect` with `setInterval` cycling every 4000ms, cleared on unmount

3. **Update textarea** (line 274): change `placeholder="What's been on your mind?..."` to `placeholder={HERO_PLACEHOLDERS[placeholderIndex]}`

No other changes to styling, form logic, or page structure.

