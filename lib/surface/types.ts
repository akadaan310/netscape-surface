/**
 * Netscape v0.1 — Infinite Surface
 * Core surface domain types. Pure TypeScript, no React.
 */

export type SurfaceType =
  | 'WEB'
  | 'AI'
  | 'CODE'
  | 'REPOSITORY'
  | 'DOCUMENT'
  | 'RESEARCH'
  | 'TERMINAL'
  | 'RESOURCE'
  | 'SESSION'
  | 'ARTIFACT'
  | 'CONFERENCE';

export type EpistemicLabel =
  | 'AXIOM'
  | 'DERIVED'
  | 'ESTABLISHED'
  | 'OBSERVED'
  | 'SIMULATED'
  | 'INFERRED'
  | 'HYPOTHESIS'
  | 'UNRESOLVED'
  | 'DISPROVEN';

export interface Provenance {
  source: string;
  retrievedAt: string;
  author: string;
  note?: string;
}

export interface SelectionObject {
  id: string;
  kind: 'selection';
  sourceUrl: string;
  text: string;
  timestamp: string;
  author: string;
}

export interface Surface {
  id: string;
  type: SurfaceType;
  title: string;
  url?: string;
  state: Record<string, unknown>;
  participantIds: string[];
  provenance: Provenance;
  createdAt: string;
  updatedAt: string;
}

export interface SurfaceEvent {
  id: string;
  ts: string;
  actor: string;
  action: string;
  surfaceId?: string;
  participantId?: string;
  detail?: Record<string, unknown>;
  epistemic: EpistemicLabel;
}

export interface SurfaceSession {
  id: string;
  humanId: string;
  surfaces: Surface[];
  activeSurfaceId: string | null;
  events: SurfaceEvent[];
  createdAt: string;
  updatedAt: string;
  version: 1;
}

export interface SurfaceContext {
  capturedAt: string;
  author: string;
  surfaceId: string;
  surfaceType: SurfaceType;
  url?: string;
  title?: string;
  selection?: SelectionObject;
  message?: string;
  artifactIds: string[];
  stateSnapshot: Record<string, unknown>;
}
