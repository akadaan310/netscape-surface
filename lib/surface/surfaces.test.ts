import { describe, it, expect } from 'vitest';
import {
  createSession,
  createSurface,
  addSurface,
  setActiveSurface,
  closeSurface,
  getActiveSurface,
} from './surfaces';
import { INVARIANTS, INVARIANT_RECORDS } from './constitution';
import type { Provenance } from './types';

const prov = (author = 'test'): Provenance => ({
  source: 'test',
  retrievedAt: new Date().toISOString(),
  author,
});

describe('surfaces', () => {
  it('create → add → switch → close round-trip', () => {
    let session = createSession('Abed');
    expect(session.surfaces).toHaveLength(0);
    expect(session.activeSurfaceId).toBeNull();

    const a = createSurface({ title: 'NASA', type: 'WEB', url: 'https://nasa.gov', provenance: prov() });
    const b = createSurface({ title: 'Repo', type: 'REPOSITORY', provenance: prov() });

    session = addSurface(session, a);
    expect(getActiveSurface(session)?.id).toBe(a.id); // first added becomes active

    session = addSurface(session, b);
    expect(session.surfaces).toHaveLength(2);
    expect(getActiveSurface(session)?.id).toBe(a.id); // active unchanged

    session = setActiveSurface(session, b.id);
    expect(getActiveSurface(session)?.id).toBe(b.id);

    session = closeSurface(session, b.id);
    expect(session.surfaces).toHaveLength(1);
    expect(getActiveSurface(session)?.id).toBe(a.id); // falls back to last remaining

    session = closeSurface(session, a.id);
    expect(session.surfaces).toHaveLength(0);
    expect(getActiveSurface(session)).toBeNull();
  });

  it('setActiveSurface on a missing id throws', () => {
    const session = createSession('Abed');
    expect(() => setActiveSurface(session, 'nope')).toThrow(/no surface with id/);
  });

  it('does not mutate inputs', () => {
    const session = createSession('Abed');
    const s = createSurface({ title: 'X', type: 'AI', provenance: prov() });
    const before = JSON.stringify(session);
    const next = addSurface(session, s);
    expect(JSON.stringify(session)).toBe(before);
    expect(next.surfaces).toHaveLength(1);
  });

  it('constitution: 10 invariants, INV-01..06 AXIOM, INV-07..10 DERIVED', () => {
    expect(INVARIANTS).toHaveLength(10);
    expect(INVARIANT_RECORDS.map((i) => i.id)).toEqual([
      'INV-01', 'INV-02', 'INV-03', 'INV-04', 'INV-05',
      'INV-06', 'INV-07', 'INV-08', 'INV-09', 'INV-10',
    ]);
    for (let n = 1; n <= 6; n++) {
      expect(INVARIANT_RECORDS[n - 1].epistemic).toBe('AXIOM');
    }
    for (let n = 7; n <= 10; n++) {
      expect(INVARIANT_RECORDS[n - 1].epistemic).toBe('DERIVED');
    }
    // string form carries the id prefix for rendering
    expect(INVARIANTS[0].startsWith('INV-01')).toBe(true);
  });

  it('external-site isolation: state of one surface never leaks into another', () => {
    let session = createSession('Abed');
    const a = createSurface({
      title: 'Site A', type: 'WEB', url: 'https://a.example',
      state: { aOnly: 'A-secret', shared: 'from-a' },
      provenance: prov(),
    });
    const b = createSurface({
      title: 'Site B', type: 'WEB', url: 'https://b.example',
      state: { bOnly: 'B-secret', shared: 'from-b' },
      provenance: prov(),
    });
    session = addSurface(session, b);
    session = addSurface(session, a);

    const evA = {
      id: 'evt-a', ts: new Date().toISOString(), actor: 'Abed',
      action: 'scrolled', surfaceId: a.id,
      detail: { stateRef: a.state }, epistemic: 'OBSERVED' as const,
    };
    const evB = {
      id: 'evt-b', ts: new Date().toISOString(), actor: 'Abed',
      action: 'scrolled', surfaceId: b.id,
      detail: { stateRef: b.state }, epistemic: 'OBSERVED' as const,
    };
    session = { ...session, events: [evA, evB] };

    const surfA = session.surfaces.find((s) => s.id === a.id)!;
    const surfB = session.surfaces.find((s) => s.id === b.id)!;
    expect(surfA.state).not.toHaveProperty('bOnly');
    expect(surfB.state).not.toHaveProperty('aOnly');
    expect(surfA.state.shared).toBe('from-a');
    expect(surfB.state.shared).toBe('from-b');

    const eventsForA = session.events.filter((e) => e.surfaceId === a.id);
    expect(eventsForA).toHaveLength(1);
    expect(eventsForA[0].detail).not.toHaveProperty('bOnly');
    expect((eventsForA[0].detail as Record<string, unknown>).stateRef).not.toHaveProperty('bOnly');
  });
});
