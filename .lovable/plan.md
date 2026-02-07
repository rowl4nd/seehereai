

# Auto-Generate Encryption Key and Complete Implementation

## Overview

Generate a secure 256-bit encryption key automatically and proceed with the full encryption implementation as previously approved.

## Step 1: Generate and store the encryption key

A cryptographically secure 256-bit key will be generated and stored as a backend secret called `ENCRYPTION_KEY`. This will be done using the secret management tool -- no manual input needed from you.

## Step 2: Create the `encrypt-messages` backend function

A new backend function (`supabase/functions/encrypt-messages/index.ts`) that handles:

- **`save` action**: Encrypts messages with AES-256-GCM and stores them in the `conversations` table
- **`load` action**: Reads encrypted messages from a session, decrypts them, and returns plaintext
- **`load-history` action**: Decrypts the last 5 past conversations for AI context
- **`create` action**: Creates a new conversation record with encrypted messages
- **Backward compatibility**: Detects legacy plaintext JSON and returns it as-is without attempting decryption

## Step 3: Update the chat page (`Mirror.tsx`)

Replace all direct database reads/writes on the `conversations` table with calls to the `encrypt-messages` function:

- **Saving messages** -- calls `save` action instead of `supabase.from("conversations").update(...)`
- **Loading session messages** -- calls `load` action instead of `supabase.from("conversations").select(...)`
- **Creating conversations** -- calls `create` action instead of `supabase.from("conversations").insert(...)`
- **Fetching past conversations** -- calls `load-history` action instead of direct query

## Step 4: Update `supabase/config.toml`

Add the new function configuration with `verify_jwt = false` (authentication is validated in code).

## What stays the same

- The AI chatbot still receives decrypted conversation history for session continuity
- The user experience is completely unchanged
- Row Level Security policies remain in place as an additional layer
- The database schema stays the same -- the `messages` column simply stores encrypted data instead of plaintext
- The `chat` edge function needs no changes

