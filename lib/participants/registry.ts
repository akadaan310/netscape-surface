/**
 * Netscape v0.1 — Infinite Surface
 * Participant registry. Serializability-friendly: a plain Record map, not a Map.
 */

import type { Capability, Participant } from './types';

export const KNOWN_CAPABILITIES: readonly Capability[] = [
  'discover',
  'open',
  'attach',
  'send',
  'receive',
  'observe',
  'disconnect',
] as const;

export interface ParticipantRegistry {
  participants: Record<string, Participant>;
}

/** Create an empty registry. */
export function createRegistry(): ParticipantRegistry {
  return { participants: {} };
}

/**
 * Register a participant. Throws on unknown capability or duplicate id.
 * Returns a NEW registry; the input is not mutated.
 */
export function registerParticipant(
  reg: ParticipantRegistry,
  p: Participant,
): ParticipantRegistry {
  for (const cap of p.capabilities) {
    if (!KNOWN_CAPABILITIES.includes(cap)) {
      throw new Error(
        `registerParticipant: unknown capability "${cap}" on participant "${p.participant_id}"`,
      );
    }
  }
  if (reg.participants[p.participant_id]) {
    throw new Error(
      `registerParticipant: duplicate participant id "${p.participant_id}"`,
    );
  }
  return {
    participants: { ...reg.participants, [p.participant_id]: p },
  };
}

/** Look up a participant by id. */
export function getParticipant(
  reg: ParticipantRegistry,
  id: string,
): Participant | undefined {
  return reg.participants[id];
}

/** List all participants exposing the given capability. */
export function listByCapability(
  reg: ParticipantRegistry,
  cap: Capability,
): Participant[] {
  return Object.values(reg.participants).filter((p) =>
    p.capabilities.includes(cap),
  );
}
