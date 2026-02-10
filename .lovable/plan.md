

## Add FAQ Section to Homepage

Add an accordion-style FAQ section near the bottom of the homepage with 5 questions, each expandable via a "+" icon.

### Questions and Answers

1. **Is this therapy?** -- No. SeeHere is a reflective companion, not a substitute for professional therapy. It offers a space to think out loud, grounded in psychological principles, but it is not a clinical service and does not provide diagnoses or treatment.

2. **Are my conversations confidential?** -- Yes. Your conversations are encrypted and private. We do not share your data with third parties, and sessions are designed to be a safe, confidential space.

3. **How much does it cost?** -- You get 2 free sessions to try SeeHere with no commitment. After that, sessions can be purchased in credit packs starting from £5. Credits never expire.

4. **Who is this for?** -- Anyone looking for a quiet, judgement-free space to reflect. Whether you're navigating a difficult time, working through everyday stress, or simply want to understand yourself better.

5. **What if I'm struggling or in crisis?** -- SeeHere is not a crisis service. If you are in immediate danger or experiencing a mental health crisis, please contact the Samaritans on 116 123 (24/7), text SHOUT to 85258, or call 999.

### Technical Details

**Modified file: `src/pages/Index.tsx`**

- Import `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` from `@/components/ui/accordion`
- Add a new FAQ section between the Final CTA section and the Footer
- Include a `WaveDivider` above/below to match the existing flow
- Use the same `ScrollSection` wrapper and warm gradient background pattern as other sections
- The Accordion component already renders a chevron icon that rotates on open -- consistent with the "+" expand pattern

**No other files need to change** -- the accordion UI component and all styling tokens already exist.

