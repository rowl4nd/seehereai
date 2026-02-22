

# Increase Guest Message Limit from 3 to 4

## Change

Update `src/pages/GuestChat.tsx` -- change the `MAX_GUEST_MESSAGES` constant from `3` to `4`.

That single constant controls the guest message limit throughout the file (it's used for both the count check after sending and the initial load check), so no other changes are needed.

