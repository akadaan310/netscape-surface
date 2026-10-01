/**
 * Netscape v0.1 — Infinite Surface
 * The constitution: invariants inherited as axioms, derived as derived.
 */

import type { EpistemicLabel } from './types';

export interface Invariant {
  id: string;
  statement: string;
  epistemic: Extract<EpistemicLabel, 'AXIOM' | 'DERIVED'>;
}

export const INVARIANT_RECORDS: readonly Invariant[] = [
  { id: 'INV-01', statement: 'Continuity does not imply identity.', epistemic: 'AXIOM' },
  { id: 'INV-02', statement: 'Reference does not imply ownership.', epistemic: 'AXIOM' },
  { id: 'INV-03', statement: 'Awareness does not imply authority.', epistemic: 'AXIOM' },
  {
    id: 'INV-04',
    statement: 'Access does not imply control — opening a surface never mutates the underlying resource.',
    epistemic: 'AXIOM',
  },
  { id: 'INV-05', statement: 'Handoff does not imply merger.', epistemic: 'AXIOM' },
  { id: 'INV-06', statement: 'Observation does not imply interpretation.', epistemic: 'AXIOM' },
  {
    id: 'INV-07',
    statement: 'Simulation is labeled — no simulated adapter ever presents as live.',
    epistemic: 'DERIVED',
  },
  {
    id: 'INV-08',
    statement: 'The web security model is never weakened for a demo.',
    epistemic: 'DERIVED',
  },
  {
    id: 'INV-09',
    statement: 'No secrets in the repo or client state, ever.',
    epistemic: 'DERIVED',
  },
  {
    id: 'INV-10',
    statement: 'Every act identifies its author — surface events carry actor.',
    epistemic: 'DERIVED',
  },
] as const;

/** String form of the invariants, for direct rendering. */
export const INVARIANTS: readonly string[] = INVARIANT_RECORDS.map(
  (inv) => `${inv.id} — ${inv.statement}`,
);

export function getInvariant(id: string): Invariant | undefined {
  return INVARIANT_RECORDS.find((inv) => inv.id === id);
}
