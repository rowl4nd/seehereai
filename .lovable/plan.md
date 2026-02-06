

# Add Restrictive UPDATE Policy to Conversations Table

## What Changes

A single database migration to add a Row Level Security (RLS) UPDATE policy to the `conversations` table.

## SQL Migration

```sql
CREATE POLICY "Users can update own conversations"
  ON public.conversations
  FOR UPDATE
  USING (auth.uid() = user_id);
```

## What This Does

- Ensures that if anyone tries to update a conversation record via the API, they can only modify their own records (matched by `user_id`).
- This is a security safeguard only -- no app code changes are needed since the app never updates conversations.
- No performance impact.

