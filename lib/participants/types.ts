/**
 * Netscape v0.1 — Infinite Surface
 * Participant domain types.
 */

import type { Provenance, SurfaceContext, EpistemicLabel } from '../surface/types';

export type ParticipantKind =
  | 'human'
  | 'ai'
  | 'website'
  | 'repository'
  | 'agent'
  | 'tool'
  | 'document'
  | 'local-model'
  | 'remote-model'
  | 'research-process'
  | 'build'
  | 'execution';

export type Capability =
  | 'discover'
  | 'open'
  | 'attach'
  | 'send'
  | 'receive'
  | 'observe'
  | 'disconnect';

export interface Participant {
  participant_id: string;
  kind: ParticipantKind;
  name: string;
  capabilities: Capability[];
  surface_capabilities: string[];
  provenance: Provenance;
  continuity: { sessionIds: string[] };
  simulated: boolean;
}

export interface AdapterResult {
  ok: boolean;
  simulated: boolean;
  epistemic: EpistemicLabel;
  summary: string;
  detail?: unknown;
}

export interface ParticipantAdapter {
  adapterId: string;
  participant: Participant;
  readonly simulated: boolean;
  discover?: () => Promise<Participant>;
  open?: (ctx: SurfaceContext) => Promise<AdapterResult>;
  attach?: (ctx: SurfaceContext) => Promise<AdapterResult>;
  send?: (ctx: SurfaceContext, message: string) => Promise<AdapterResult>;
  receive?: () => Promise<AdapterResult>;
  observe?: (ctx: SurfaceContext) => Promise<AdapterResult>;
  disconnect?: () => Promise<void>;
}
