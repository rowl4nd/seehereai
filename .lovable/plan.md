

## Plan: Hold AI response until after email decision

### Change

When the 5th user message is sent and the guest limit is reached, **don't show the AI's response yet**. Instead, store it in state and only show the email prompt. After the user provides their email (or refuses twice), inject the held AI response back into the conversation before continuing.

### Technical detail

**File:** `src/pages/GuestChat.tsx`

1. **Add state:** `const [heldResponse, setHeldResponse] = useState<Message | null>(null)` (+ persist in sessionStorage as `sh_held_response`)

2. **At 5-message limit (lines 562–581):** Instead of adding `assistantMessage` to messages, store it:
   ```
   if (userCount >= MAX_GUEST_MESSAGES) {
     // Don't show AI response yet — hold it
     setHeldResponse(assistantMessage);
     sessionStorage.setItem("sh_held_response", JSON.stringify(assistantMessage));
     
     // Show only the email prompt (without the AI response)
     const withPrompt = [...updatedWithUser, emailPrompt];
     setMessages(withPrompt);
     ...
   }
   ```

3. **On successful email signup:** Before continuing the chat, inject the held response:
   ```
   const held = heldResponse;
   if (held) {
     setMessages(prev => [...prev, successMessage, held]);
     setHeldResponse(null);
     sessionStorage.removeItem("sh_held_response");
   }
   ```

4. **On final refusal (handleEmailRefusal):** Discard the held response (it's lost with the session anyway):
   ```
   setHeldResponse(null);
   sessionStorage.removeItem("sh_held_response");
   ```

5. **On init:** Restore `heldResponse` from sessionStorage if page is refreshed mid-prompt.

### Files
- `src/pages/GuestChat.tsx` — only file changed

