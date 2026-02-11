

## Fix: Chat Messages Lost When Navigating Away and Returning

### Root Cause Analysis

There are **three bugs** working together to cause message loss:

**Bug 1 -- Silent failure when `conversationId` is null (MAIN ISSUE)**

The `saveMessagesToDb` helper (line 354-362) silently returns if `conversationId` is null:
```text
const saveMessagesToDb = async (updatedMessages: Message[]) => {
    if (!conversationId) return;  // <-- silently drops all saves
    ...
};
```

`conversationId` is set asynchronously after `createEncryptedConversation` completes. If a user sends their first message before the conversation record finishes being created, `conversationId` is still null, and **every subsequent save silently fails**. All messages are lost.

Additionally, `saveMessagesToDb` captures `conversationId` from a closure. Since `conversationId` is React state, the function always sees the value from the render when it was last defined. If the conversation ID was set *after* the function was created in a given render cycle, it won't see it.

**Bug 2 -- Timer-end save uses stale `messages` state**

When the timer hits zero (line 253-265), it saves using `messages` (state variable) instead of `messagesRef.current`. The timer runs inside a `setInterval` closure, so `messages` is stale and may only contain the greeting or an earlier snapshot.

**Bug 3 -- No retry or queue for failed saves**

If a save fails (network hiccup, edge function cold start), there is no retry. The messages are gone.

### Fix Details

**1. Use a ref for conversationId (fixes Bug 1)**

Store `conversationId` in a ref (`conversationIdRef`) alongside the state, similar to how `messagesRef` works. Update `saveMessagesToDb` to read from the ref instead of the closure-captured state value.

**2. Fix timer-end save to use `messagesRef.current` (fixes Bug 2)**

Change line 257 from `messages.map(...)` to `messagesRef.current.map(...)` so the timer always saves the latest messages.

**3. Add logging when conversationId is missing**

Add a `console.warn` in `saveMessagesToDb` when `conversationId` is null so this failure is no longer silent and can be debugged.

**4. Queue early messages until conversationId is ready**

If a message is sent before `conversationId` is available, queue it and flush once the ID is set. This prevents the window where messages can be lost.

### Files Changed

1. `src/pages/Mirror.tsx`
   - Add `conversationIdRef` ref, kept in sync with `conversationId` state
   - Update `saveMessagesToDb` to read from `conversationIdRef.current`
   - Fix timer-end save to use `messagesRef.current`
   - Add pending-save queue that flushes when `conversationId` becomes available
   - Add warning logs for missing conversationId

