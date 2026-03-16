

## Plan: Replace second headline metric with three-line breakdown

**File: `src/pages/Admin.tsx`** — Update the `HeadlineMetrics` component (lines 389-394).

Replace the single "Returned for second session" line with three separate lines:

```
<p>1st session started: <bold>{accountCreated}</bold></p>
<p>2nd session started: <bold>{secondFreeSessionCount}</bold></p>
<p>Free session return rate: <bold>{pct}</bold></p>
```

Where `pct` = `(secondFreeSessionCount / accountCreated) * 100`, displayed as percentage (e.g. "50.0%"), or "—" if `accountCreated` is 0.

Same `text-sm text-muted-foreground` styling with `font-semibold text-foreground` for the values. The other two metrics (New user conversion, Second session to purchase) remain unchanged.

