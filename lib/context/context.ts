/**
 * Netscape v0.1 — Infinite Surface
 * Context capture and the "come here" contextual attachment primitive.
 */

import type {
  Surface,
  SurfaceContext,
  SelectionObject,
  SurfaceEvent,
  SurfaceSession,
} from '../surface/types';
import { newId } from '../surface/surfaces';

/** Deep-copy a JSON-shaped state snapshot so contexts never alias surface state. */
function deepCopyState(state: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(state)) as Record<string, unknown>;
}

export interface CaptureExtras {
  selection?: SelectionObject;
  message?: string;
}

/**
 * Capture the context of a surface as an immutable handoff object.
 * Accepts either (session, surfaceId) or (surface) directly.
 * Throws if the surface is not in the session (session form) or nullish (surface form).
 */
export function captureContext(
  session: SurfaceSession,
  surfaceId: string,
  extras?: CaptureExtras,
): SurfaceContext;
export function captureContext(
  surface: Surface,
  extras?: CaptureExtras,
): SurfaceContext;
export function captureContext(
  sessionOrSurface: SurfaceSession | Surface,
  surfaceIdOrExtras?: string | CaptureExtras,
  maybeExtras?: CaptureExtras,
): SurfaceContext {
  let surface: Surface | undefined;
  let extras: CaptureExtras | undefined;
  let author: string;
  if (
    typeof sessionOrSurface === 'object' &&
    sessionOrSurface !== null &&
    'surfaces' in sessionOrSurface
  ) {
    const session = sessionOrSurface as SurfaceSession;
    const surfaceId = surfaceIdOrExtras as string;
    surface = session.surfaces.find((s) => s.id === surfaceId);
    extras = maybeExtras;
    author = session.humanId;
    if (!surface) {
      throw new Error(`captureContext: no surface with id "${surfaceId}" in session`);
    }
  } else {
    surface = sessionOrSurface as Surface | undefined;
    extras = surfaceIdOrExtras as CaptureExtras | undefined;
    if (!surface || typeof surface.id !== 'string') {
      throw new Error('captureContext: surface is required');
    }
    author = surface.provenance.author;
  }
  return {
    capturedAt: new Date().toISOString(),
    author,
    surfaceId: surface.id,
    surfaceType: surface.type,
    url: surface.url,
    title: surface.title,
    selection: extras?.selection,
    message: extras?.message,
    artifactIds: [],
    stateSnapshot: deepCopyState(surface.state),
  };
}

/** Build a SelectionObject from a quoted text span. */
export function selectionAsObject(
  sourceUrl: string,
  text: string,
  author: string,
): SelectionObject {
  return {
    id: newId('selection'),
    kind: 'selection',
    sourceUrl,
    text,
    timestamp: new Date().toISOString(),
    author,
  };
}

/**
 * "Come here": attach a participant to the given surface and log the act.
 * Returns the updated session; inputs are not mutated.
 * Throws if the surface id is not in the session. Attaching the same
 * participant twice is a no-op for membership (the event is still logged).
 */
export function comeHere(
  session: SurfaceSession,
  participantId: string,
  surfaceId: string,
): SurfaceSession {
  const target = session.surfaces.find((s) => s.id === surfaceId);
  if (!target) {
    throw new Error(`comeHere: no surface with id "${surfaceId}" in session`);
  }

  const alreadyAttached = target.participantIds.includes(participantId);
  const updatedSurfaces = session.surfaces.map((s) =>
    s.id === surfaceId && !alreadyAttached
      ? { ...s, participantIds: [...s.participantIds, participantId], updatedAt: new Date().toISOString() }
      : s,
  );

  const event: SurfaceEvent = {
    id: newId('event'),
    ts: new Date().toISOString(),
    actor: session.humanId,
    action: 'come-here',
    surfaceId,
    participantId,
    detail: undefined,
    epistemic: 'DERIVED',
  };

  return {
    ...session,
    surfaces: updatedSurfaces,
    events: [...session.events, event],
    updatedAt: new Date().toISOString(),
  };
}
