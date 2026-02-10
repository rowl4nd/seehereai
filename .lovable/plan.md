

## Add Cooldown Bypass for cecilia@seehere.ai

A single database migration to update the `has_cooldown_passed` function so that `cecilia@seehere.ai` also bypasses the one-session-per-day cooldown, matching the existing bypass for `rowland.jack@outlook.com`.

### What changes

**Database migration** -- update the `has_cooldown_passed` function:

Change the developer bypass check from:

```sql
SELECT 1 FROM auth.users WHERE id = _user_id AND email = 'rowland.jack@outlook.com'
```

to:

```sql
SELECT 1 FROM auth.users WHERE id = _user_id AND email IN ('rowland.jack@outlook.com', 'cecilia@seehere.ai')
```

No other files or frontend code need to change -- the bypass is handled entirely in this database function.

