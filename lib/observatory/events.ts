/**
 * Netscape v0.1 — Infinite Surface
 * Observatory event log. INV-10: every act identifies its author.
 */

import type { SurfaceEvent, SurfaceSession } from '../surface/types';
import { newId } from '../surface/surfaces';

/**
 * Append an event to the session log. The actor field is required (INV-10);
 * throws when it is missing or empty. Returns the new session; no mutation.
 */
export function logEvent(
  session: SurfaceSession,
  partial: Omit<SurfaceEvent, 'id' | 'ts'>,
): SurfaceSession {
  if (!partial.actor || partial.actor.trim() === '') {
    throw new Error('logEvent: actor is required (INV-10)');
  }
  const event: SurfaceEvent = {
    ...partial,
    id: newId('event'),
    ts: new Date().toISOString(),
  };
  return {
    ...session,
    events: [...session.events, event],
    updatedAt: new Date().toISOString(),
  };
}
