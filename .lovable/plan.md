

## Add Beta Access Banner Below Header

Add the provided beta testing banner markup directly below the `<header>` element on the homepage.

### Technical Details

**File: `src/pages/Index.tsx`**

Insert the following block immediately after the closing `</header>` tag (after line 57):

```jsx
{/* Beta Access Banner */}
<div className="relative z-10 bg-gradient-to-r from-[#cbb7ef]/20 to-[#b1cfac]/20 border-b border-border/30 py-3 px-6 text-center">
  <p className="text-sm text-foreground">
    <span className="font-medium">Beta Testing Phase</span> — We're limiting early access to ensure quality.
    <a href="#beta-signup" className="underline underline-offset-2 hover:text-[#4a7a4f] transition-colors font-medium ml-1">
      Join our first 50 testers
    </a>
    {" "}and receive 16 free sessions.
  </p>
</div>
```

No other files need to change.

