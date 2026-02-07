

# Encrypt Chat Messages in the Database

## Overview

Right now, conversation messages are stored as plaintext JSON in the `conversations` table. This plan adds **encryption at rest** so that messages are unreadable if the database were ever directly accessed, while still allowing the chatbot to read them for session continuity.

## How It Works

The approach uses **server-side encryption** with a secret key stored securely in your backend. Messages are encrypted before being written to the database and decrypted when read back -- either for displaying to the user or for providing context to the AI chatbot.

```text
User types message
       |
       v
Frontend sends message to backend function
       |
       v
Backend function encrypts message with secret key
       |
       v
Encrypted data stored in database
       |
       v
When needed, backend decrypts for display or AI context
```

## What Changes

### 1. New backend function: `encrypt-messages`

A new backend function that handles both encryption and decryption. The frontend will call this function instead of writing directly to the `conversations` table.

- **Encrypt endpoint**: Takes plaintext messages, encrypts them with AES-GCM using a secret key, and stores them in the database
- **Decrypt endpoint**: Reads encrypted messages from the database, decrypts them, and returns plaintext to the frontend

This keeps the encryption key entirely server-side -- it never reaches the browser.

### 2. Update the chat page (`Mirror.tsx`)

Instead of the frontend directly inserting/updating the `conversations` table:

- **Saving messages**: Call the `encrypt-messages` function with action `save`, passing the conversation ID and messages. The function encrypts and stores them.
- **Loading messages**: Call the `encrypt-messages` function with action `load`, passing the session ID. The function decrypts and returns them.
- **Past conversations for AI context**: Call the `encrypt-messages` function with action `load-history`. The function decrypts the last 5 conversations and returns them for use by the chatbot.

### 3. Update the chat backend function

The `chat` edge function already receives past conversations from the frontend. No change needed here -- it will continue to receive decrypted messages because the frontend will have already decrypted them via the `encrypt-messages` function.

### 4. Add an encryption secret

A new secret (`ENCRYPTION_KEY`) will be added to store the 256-bit encryption key. This key never leaves the server.

### 5. Database migration for existing data

A note: any existing conversations in the database are currently plaintext. After this change, new conversations will be encrypted. We can add a one-time migration step in the backend function that handles reading -- if data is not encrypted (valid JSON), it returns it as-is; if it is encrypted, it decrypts it. This ensures backward compatibility.

## Security Details

- **Algorithm**: AES-256-GCM (authenticated encryption -- tamper-proof)
- **Key storage**: Secret stored in backend environment, never exposed to the client
- **IV (initialisation vector)**: A unique random IV is generated for each encryption operation and stored alongside the ciphertext
- **Backward compatibility**: The decrypt function will detect whether data is already plaintext JSON (legacy) or encrypted, and handle both gracefully

## What Stays the Same

- The AI chatbot still receives decrypted conversation history for continuity
- The user experience is completely unchanged
- Row Level Security policies remain in place as an additional layer
- The database schema stays the same (the `messages` column stores encrypted data instead of plaintext JSON)

## Technical Details

### New files
- `supabase/functions/encrypt-messages/index.ts` -- handles encrypt, decrypt, save, and load operations

### Modified files
- `src/pages/Mirror.tsx` -- replace direct Supabase table reads/writes with calls to the `encrypt-messages` function

### New secret required
- `ENCRYPTION_KEY` -- a 256-bit key for AES-GCM encryption

