

## Fix: Restore Header Logo and Adjust Only Hero Height

The last edit accidentally removed the `<Logo />` component from the header (line 71) and changed the header padding. We need to:

1. **Restore the Logo** -- add `<Logo />` back as the first child inside the `<header>` tag
2. **Restore header padding** -- change `py-3` back to `py-5` (the header was not supposed to change)
3. **Keep the hero height reduction** -- `min-h-[70vh]` is already applied and is the only change we wanted

### Technical Detail

In `src/pages/Index.tsx`, the header (line 71) should become:

```
<header className="sticky top-0 z-20 flex justify-between items-center px-6 py-5 md:px-10 bg-background/80 backdrop-blur-md border-b border-border/20">
  <Logo />
  {!loading && ...
```

The hero section at line 89 stays as-is with `min-h-[70vh]`.
