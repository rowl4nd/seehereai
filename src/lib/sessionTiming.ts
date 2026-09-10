/**
 * Single source of truth for when a session ends.
 *
 * Normal length is 25 minutes (free) or 45 minutes (paid). If the person used
 * the one-time accessibility extension, the server stores the new end time on
 * `extended_until`, and that always wins. Every timer / auto-end check must use
 * this helper so a refresh or a background sweep can't cut an extended session short.
 */

export const EXTENSION_MINUTES = 10;

export interface TimedSession {
  session_type: string;
  started_at: string;
  extended_until?: string | null;
}

/** Base session length in seconds, ignoring any extension. */
export function baseSessionDurationSeconds(sessionType: string): number {
  return sessionType === "paid" ? 45 * 60 : 25 * 60;
}

/** Effective end time (ms epoch), honouring a stored extension. */
export function getSessionEndTime(session: TimedSession): number {
  if (session.extended_until) {
    return new Date(session.extended_until).getTime();
  }
  return (
    new Date(session.started_at).getTime() + baseSessionDurationSeconds(session.session_type) * 1000
  );
}

/** Total session length in seconds, honouring a stored extension. */
export function getSessionDurationSeconds(session: TimedSession): number {
  return Math.max(
    1,
    Math.round((getSessionEndTime(session) - new Date(session.started_at).getTime()) / 1000),
  );
}

/** Seconds left on a session right now (never negative). */
export function getSecondsRemaining(session: TimedSession): number {
  return Math.max(0, Math.floor((getSessionEndTime(session) - Date.now()) / 1000));
}

export const ACCOMMODATION_NOTE =
  "Need more time because of a disability? Email hello@seehere.ai";
