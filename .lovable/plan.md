

# Bypass Cooldown for Your Account

## Overview

Update the database cooldown function so that your account (`rowland.jack@outlook.com`) can always start a new session, regardless of the daily cooldown rule. All other users remain unaffected.

## What Changes

### Database function update (1 migration)

Modify the `has_cooldown_passed` function to check if the user's email matches yours. If it does, return `true` immediately (cooldown bypassed). Otherwise, run the normal cooldown logic.

This is the cleanest approach because:
- It's a single change in one place (the database)
- No frontend code changes needed
- All other users still get the normal cooldown
- Easy to add more bypass accounts later if needed

No other files need to change -- the frontend already reads `canStartSession` from this function, so it will just work.

