/**
 * Netscape v0.1 — Infinite Surface
 * Pure surface-session operations. Every function returns a NEW object;
 * inputs are never mutated.
 */

import type { Surface, SurfaceSession, SurfaceType, Provenance } from './types';

let idCounter = 0;

/** Generate a unique id with the given prefix. */
export function newId(prefix = 'id'): string {
  idCounter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now().toString(36)}-${idCounter.toString(36)}-${rand}`;
}

export interface CreateSurfaceInput {
  title: string;
  type: SurfaceType;
  url?: string;
  state?: Record<string, unknown>;
  participantIds?: string[];
  provenance: Provenance;
}

/** Create a new human session. */
export function createSession(humanName: string): SurfaceSession {
  const now = new Date().toISOString();
  return {
    id: newId('session'),
    humanId: humanName,
    surfaces: [],
    activeSurfaceId: null,
    events: [],
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

/** Build a standalone Surface (not yet attached to a session). */
export function createSurface(input: CreateSurfaceInput): Surface;
export function createSurface(type: SurfaceType, title: string, url?: string): Surface;
export function createSurface(
  inputOrType: CreateSurfaceInput | SurfaceType,
  title?: string,
  url?: string,
): Surface {
  const now = new Date().toISOString();
  if (typeof inputOrType === 'string') {
    return {
      id: newId('surface'),
      type: inputOrType,
      title: title ?? 'untitled',
      url,
      state: {},
      participantIds: [],
      provenance: { source: 'netscape-surface', retrievedAt: now, author: 'abed' },
      createdAt: now,
      updatedAt: now,
    };
  }
  const input = inputOrType;
  return {
    id: newId('surface'),
    type: input.type,
    title: input.title,
    url: input.url,
    state: input.state ? { ...input.state } : {},
    participantIds: input.participantIds ? [...input.participantIds] : [],
    provenance: { ...input.provenance },
    createdAt: now,
    updatedAt: now,
  };
}

/** Append a surface to the session. New session objects; no mutation. */
export function addSurface(session: SurfaceSession, surface: Surface): SurfaceSession {
  return {
    ...session,
    surfaces: [...session.surfaces, surface],
    // First surface added becomes active by default.
    activeSurfaceId: session.activeSurfaceId ?? surface.id,
    updatedAt: new Date().toISOString(),
  };
}

/** Switch the active surface. Throws if the id is not in the session. */
export function setActiveSurface(session: SurfaceSession, id: string): SurfaceSession {
  const found = session.surfaces.some((s) => s.id === id);
  if (!found) {
    throw new Error(`setActiveSurface: no surface with id "${id}" in session`);
  }
  return {
    ...session,
    activeSurfaceId: id,
    updatedAt: new Date().toISOString(),
  };
}

/** Remove a surface. If it was active, fall back to the last remaining surface, else null. */
export function closeSurface(session: SurfaceSession, id: string): SurfaceSession {
  const remaining = session.surfaces.filter((s) => s.id !== id);
  let activeSurfaceId = session.activeSurfaceId;
  if (activeSurfaceId === id) {
    activeSurfaceId = remaining.length > 0 ? remaining[remaining.length - 1].id : null;
  }
  return {
    ...session,
    surfaces: remaining,
    activeSurfaceId,
    updatedAt: new Date().toISOString(),
  };
}

/** Return the active surface, or null when none is active. */
export function getActiveSurface(session: SurfaceSession): Surface | null {
  if (!session.activeSurfaceId) return null;
  return session.surfaces.find((s) => s.id === session.activeSurfaceId) ?? null;
}
