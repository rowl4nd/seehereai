

## Plan: Switch Chat Model to Gemini 2.5 Pro

Change the `model` field in `supabase/functions/chat/index.ts` from `google/gemini-3-flash-preview` to `google/gemini-2.5-pro`.

### Change

**`supabase/functions/chat/index.ts`** (line ~126): Update the model string in the fetch body.

