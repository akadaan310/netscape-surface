import { describe, it, expect } from 'vitest';
import { createSession } from '../surface/surfaces';
import { logEvent } from './events';

describe('observatory events', () => {
  it('logEvent requires an actor (INV-10)', () => {
    const session = createSession('Abed');
    expect(() =>
      logEvent(session, { actor: '', action: 'open', epistemic: 'OBSERVED' }),
    ).toThrow(/actor is required/);
  });

  it('logEvent appends an identified, timestamped event without mutating', () => {
    const session = createSession('Abed');
    const next = logEvent(session, {
      actor: 'Abed',
      action: 'surface-opened',
      surfaceId: 's-1',
      detail: { url: 'https://nasa.gov' },
      epistemic: 'OBSERVED',
    });
    expect(session.events).toHaveLength(0); // input untouched
    expect(next.events).toHaveLength(1);
    const event = next.events[0];
    expect(event.actor).toBe('Abed');
    expect(event.action).toBe('surface-opened');
    expect(event.id).toBeTruthy();
    expect(event.ts).toBeTruthy();
  });
});
