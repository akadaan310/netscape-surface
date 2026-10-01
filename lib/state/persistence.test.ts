import { describe, it, expect, vi, afterEach } from 'vitest';
import { createSession, createSurface, addSurface } from '../surface/surfaces';
import {
  STORAGE_KEY,
  saveSession,
  loadSession,
  clearSavedSession,
  checkpoint,
} from './persistence';
import type { Provenance } from '../surface/types';

const prov = (): Provenance => ({
  source: 'test', retrievedAt: new Date().toISOString(), author: 'test',
});

function stubLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
      setItem: (k: string, v: string) => { store.set(k, v); },
      removeItem: (k: string) => { store.delete(k); },
    },
  });
  return store;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('persistence', () => {
  it('save/load round-trip via a localStorage stub', () => {
    const store = stubLocalStorage();
    let session = createSession('Abed');
    session = addSurface(session, createSurface({ title: 'NASA', type: 'WEB', provenance: prov() }));

    saveSession(session);
    expect(store.get(STORAGE_KEY)).toBeTruthy();

    const loaded = loadSession();
    expect(loaded).not.toBeNull();
    expect(loaded!.humanId).toBe('Abed');
    expect(loaded!.version).toBe(1);
    expect(loaded!.surfaces).toHaveLength(1);
    expect(loaded!.surfaces[0].title).toBe('NASA');

    clearSavedSession();
    expect(loadSession()).toBeNull();
  });

  it('loadSession returns null for invalid payloads', () => {
    const store = stubLocalStorage();
    store.set(STORAGE_KEY, 'not-json{{');
    expect(loadSession()).toBeNull();
    store.set(STORAGE_KEY, JSON.stringify({ version: 2, surfaces: [], humanId: 'x' }));
    expect(loadSession()).toBeNull();
    store.set(STORAGE_KEY, JSON.stringify({ version: 1, humanId: 'x' })); // no surfaces array
    expect(loadSession()).toBeNull();
  });

  it('checkpoint is epistemically PROPOSAL and ACSP-shaped', () => {
    let session = createSession('Abed');
    session = addSurface(session, createSurface({ title: 'A', type: 'WEB', provenance: prov() }));
    const cp = checkpoint(session, 'demo-checkpoint', 'Abed');
    expect(cp.kind).toBe('checkpoint');
    expect(cp.epistemic).toBe('PROPOSAL');
    expect(cp.label).toBe('demo-checkpoint');
    expect(cp.actor).toBe('Abed');
    expect(cp.surfaceIds).toEqual(session.surfaces.map((s) => s.id));
    expect(cp.activeSurfaceId).toBe(session.activeSurfaceId);
    expect(cp.note).toContain('ACSP-shaped');
    expect(cp.note).toContain('not yet wired');
  });
});
