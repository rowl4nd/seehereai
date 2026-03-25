

## Plan: Style "Two free sessions" to match other hero badges

**File:** `src/pages/Index.tsx`, line 250

Change:
```tsx
<span className="font-bold text-[#3d3a35]">Two free sessions</span>
```

To:
```tsx
<span className="flex items-center gap-1.5">
  <Check className="w-3 h-3 text-[#4a7a4f]" /> Two free sessions
</span>
```

This gives it the same green tick icon, flex layout, and default text weight as the other three badges.

