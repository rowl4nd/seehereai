
## Re-add the "Why SeeHere?" FAQ Question

The "Why SeeHere?" accordion item was accidentally removed when the contact form changes were applied. It needs to be added back as the first FAQ question.

### What will be done

Add a new `AccordionItem` with value `"why"` as the first item in the FAQ Accordion (before "Is this therapy?"), containing:

- **Question**: "Why SeeHere?"
- **Answer**: A bulleted list with three points comparing SeeHere to generic AI, traditional therapy, and mental health apps

### Technical details

- **File**: `src/pages/Index.tsx`
- **Location**: Inside the `<Accordion>` component, insert before the existing `"therapy"` AccordionItem (line 331)
- The markup will match the existing accordion item styling (`border-b border-border/40 pb-4`, same trigger/content classes)
- The answer will use `<ul className="list-disc pl-5 space-y-3">` with three `<li>` items, matching the format that was previously implemented
