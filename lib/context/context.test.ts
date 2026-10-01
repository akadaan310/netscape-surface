import { describe, it, expect } from 'vitest';
import { createSession, createSurface, addSurface, getActiveSurface } from '../surface/surfaces';
import { captureContext, selectionAsObject, comeHere } from './context';
import type { Provenance } from '../surface/types';

const prov = (): Provenance => ({
  source: 'test', retrievedAt: new Date().toISOString(), author: 'test',
});

function twoSurfaceSession() {
  let session = createSession('Abed');
  const a = createSurface({ title: 'A', type: 'WEB', state: { onlyA: 1 }, provenance: prov() });
  const b = createSurface({ title: 'B', type: 'AI', state: { onlyB: 2 }, provenance: prov() });
  session = addSurface(session, a);
  session = addSurface(session, b);
  return { session, a, b };
}

describe('context', () => {
  it('captureContext throws when the surface is missing', () => {
    const { session } = twoSurfaceSession();
    expect(() => captureContext(session, 'missing')).toThrow(/no surface with id/);
  });

  it('captureContext for surface A contains no state keys of surface B', () => {
    const { session, a, b } = twoSurfaceSession();
    const ctxA = captureContext(session, a.id);
    const ctxB = captureContext(session, b.id);
    expect(ctxA.surfaceId).toBe(a.id);
    expect(ctxA.stateSnapshot).toEqual({ onlyA: 1 });
    expect(ctxA.stateSnapshot).not.toHaveProperty('onlyB');
    expect(ctxB.stateSnapshot).not.toHaveProperty('onlyA');
    // snapshots are copies, not aliases
    expect(ctxA.stateSnapshot).not.toBe(a.state);
  });

  it('selectionAsObject builds a well-formed selection', () => {
    const sel = selectionAsObject('https://x.example', 'some text', 'Abed');
    expect(sel.kind).toBe('selection');
    expect(sel.sourceUrl).toBe('https://x.example');
    expect(sel.text).toBe('some text');
    expect(sel.author).toBe('Abed');
  });

  it('comeHere attaches the participant, logs an event with actor, no duplicate attach', () => {
    let { session, a } = twoSurfaceSession();

    session = comeHere(session, '7u', a.id);
    const first = session.events[session.events.length - 1];
    expect(first.actor).toBe('Abed'); // INV-10: actor identified
    expect(first.action).toBe('come-here');
    expect(first.epistemic).toBe('DERIVED');
    expect(first.participantId).toBe('7u');
    expect(first.surfaceId).toBe(a.id);
    expect(session.events).toHaveLength(1);

    const surf = session.surfaces.find((s) => s.id === a.id)!;
    expect(surf.participantIds).toContain('7u');

    // second come-here with the same participant: no duplicate, but a new event is logged
    session = comeHere(session, '7u', a.id);
    const dup = session.surfaces
      .find((s) => s.id === a.id)!
      .participantIds.filter((id) => id === '7u');
    expect(dup).toHaveLength(1);
    expect(session.events).toHaveLength(2);
  });

  it('comeHere throws for an unknown surface id', () => {
    const { session } = twoSurfaceSession();
    expect(() => comeHere(session, '7u', 'nope')).toThrow(/no surface with id/);
  });

  it('captureContext accepts a surface object directly', () => {
    const { a } = twoSurfaceSession();
    const ctx = captureContext(a);
    expect(ctx.surfaceId).toBe(a.id);
    expect(ctx.author).toBe('test');
    expect(ctx.stateSnapshot).toEqual({ onlyA: 1 });
  });
});
