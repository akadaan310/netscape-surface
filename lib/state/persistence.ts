/**
 * Netscape v0.1 — Infinite Surface
 * Session persistence (localStorage) and checkpoint records.
 */

import type { SurfaceSession } from '../surface/types';
import { newId } from '../surface/surfaces';

export interface CheckpointRecord {
  kind: 'checkpoint';
  id: string;
  ts: string;
  actor: string;
  label: string;
  surfaceIds: string[];
  activeSurfaceId: string | null;
  epistemic: 'PROPOSAL';
  note: string;
}

export const STORAGE_KEY = 'netscape.surface.v1';

function storage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

/** Save the session to localStorage. No-op when there is no window (SSR/tests). */
export function saveSession(session: SurfaceSession): void {
  const store = storage();
  if (!store) return;
  store.setItem(STORAGE_KEY, JSON.stringify(session));
}

/** Load the saved session. Returns null when absent, unparseable, or invalid. */
export function loadSession(): SurfaceSession | null {
  const store = storage();
  if (!store) return null;
  const raw = store.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<SurfaceSession>;
    if (parsed.version !== 1) return null;
    if (!Array.isArray(parsed.surfaces)) return null;
    if (typeof parsed.humanId !== 'string') return null;
    return parsed as SurfaceSession;
  } catch {
    return null;
  }
}

/** Remove the saved session. No-op when there is no window. */
export function clearSavedSession(): void {
  const store = storage();
  if (!store) return;
  store.removeItem(STORAGE_KEY);
}

/**
 * Build an ACSP-shaped checkpoint record. The continuity provider is not
 * yet wired, so the record is epistemically a PROPOSAL.
 */
export function checkpoint(
  session: SurfaceSession,
  label: string,
  actor: string,
): CheckpointRecord {
  return {
    kind: 'checkpoint',
    id: newId('checkpoint'),
    ts: new Date().toISOString(),
    actor,
    label,
    surfaceIds: session.surfaces.map((s) => s.id),
    activeSurfaceId: session.activeSurfaceId,
    epistemic: 'PROPOSAL',
    note: 'ACSP-shaped continuity record; continuity provider not yet wired (PROPOSAL)',
  };
}
