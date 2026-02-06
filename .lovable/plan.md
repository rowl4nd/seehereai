

# Fix Session Resume — Load Chat History

## The Problem

Two bugs are causing the chat history to disappear when you resume a session:

1. **Duplicate conversations**: The initialization effect has many dependencies (`profile`, `credits`, `canStartSession`, etc.) which change as data loads, causing it to fire multiple times before `sessionStarted` gets set. Each run creates a new conversation record. Your current session already has 5 conversation records — only one has the actual chat (5 messages), the rest are greeting-only duplicates.

2. **`.maybeSingle()` fails silently with multiple rows**: When the resume code queries for the conversation, `.maybeSingle()` returns an error (not data) if more than one row matches. So the code thinks there's no conversation and creates yet another greeting-only one.

## What Changes

### File: `src/pages/Mirror.tsx`

**Fix 1 — Use `.order().limit(1)` instead of `.maybeSingle()`**

When loading an existing conversation for the active session, replace:

```ts
const { data: existingConvo } = await supabase
  .from("conversations")
  .select("id, messages")
  .eq("session_id", activeSession.id)
  .eq("user_id", user.id)
  .maybeSingle();
```

with a query that orders by `created_at` descending and takes the first result. This way, even if duplicates exist, it picks the most recent one (which will have the most messages):

```ts
const { data: existingConvos } = await supabase
  .from("conversations")
  .select("id, messages")
  .eq("session_id", activeSession.id)
  .eq("user_id", user.id)
  .order("created_at", { ascending: false });

const existingConvo = existingConvos?.find(c => 
  Array.isArray(c.messages) && c.messages.length > 1
) || existingConvos?.[0] || null;
```

This finds the conversation with actual chat content first, falling back to the most recent one.

**Fix 2 — Prevent duplicate effect runs**

Add a `useRef` flag to ensure the initialization logic only runs once, even if the effect fires multiple times due to dependency changes:

```ts
const initRef = useRef(false);
```

Then at the top of the effect:

```ts
if (!user || sessionStarted || sessionsLoading || initRef.current) return;
initRef.current = true;
```

This prevents multiple conversation records from being created.

**Fix 3 — Clean up the dependency array**

Remove unnecessary dependencies from the effect (`profile`, `credits`, `canStartSession`, `startSession`, `updateProfile`, `endSession`) that cause it to re-fire. These values are only read inside the function and don't need to trigger it. The key triggers are just `user`, `sessionsLoading`, and `sessionStarted`.

## Data Cleanup

The existing duplicate conversation records won't cause issues going forward since the new query picks the one with the most messages. No database migration needed.

