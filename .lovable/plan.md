
# Add sliding tab indicator to Auth page

## What changes

Replace the default Radix tab highlight (which snaps instantly) with a smooth sliding indicator that animates left/right when toggling between "Sign in" and "Create account".

### Approach

Instead of modifying the shared `TabsList`/`TabsTrigger` components (which are used elsewhere), build a custom tab bar directly in `src/pages/Auth.tsx`:

- Replace the `<Tabs>` / `<TabsList>` / `<TabsTrigger>` usage with a custom container that has two buttons and an absolutely-positioned sliding background pill
- The pill uses CSS `transition-all duration-300` and shifts its `left` position based on the current mode (`login` = left half, `signup` = right half)
- Active tab text stays visually distinct; inactive tab is muted
- The sliding pill gets rounded corners and a subtle shadow to match the cozy design

### Technical details

- The sliding indicator is a `<div>` with `absolute top-0 left-0 w-1/2 h-full` plus `transition-all duration-300 ease-in-out`
- When `tabValue === "signup"`, add `translate-x-full` to slide it right
- The parent container keeps `relative overflow-hidden rounded-lg bg-popover p-1` to match the current TabsList style
- No new dependencies needed -- pure Tailwind CSS transitions
- Only `src/pages/Auth.tsx` is modified; the shared tab components remain untouched
