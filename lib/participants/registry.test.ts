import { describe, it, expect } from 'vitest';
import { createRegistry, registerParticipant, getParticipant, listByCapability } from './registry';
import type { Participant, Capability } from './types';

function makeParticipant(id: string, caps: Capability[]): Participant {
  return {
    participant_id: id,
    kind: 'tool',
    name: id,
    capabilities: caps,
    surface_capabilities: [],
    provenance: { source: 'test', retrievedAt: new Date().toISOString(), author: 'test' },
    continuity: { sessionIds: [] },
    simulated: true,
  };
}

describe('registry', () => {
  it('registers and looks up participants', () => {
    let reg = createRegistry();
    reg = registerParticipant(reg, makeParticipant('p1', ['send', 'receive']));
    expect(getParticipant(reg, 'p1')?.name).toBe('p1');
    expect(listByCapability(reg, 'send')).toHaveLength(1);
    expect(listByCapability(reg, 'observe')).toHaveLength(0);
  });

  it('rejects an unknown capability', () => {
    const reg = createRegistry();
    expect(() =>
      registerParticipant(reg, makeParticipant('bad', ['teleport' as Capability])),
    ).toThrow(/unknown capability/);
  });

  it('rejects a duplicate id', () => {
    let reg = createRegistry();
    reg = registerParticipant(reg, makeParticipant('dup', ['send']));
    expect(() => registerParticipant(reg, makeParticipant('dup', ['send']))).toThrow(/duplicate/);
  });

  it('does not mutate the input registry', () => {
    const reg = createRegistry();
    const before = JSON.stringify(reg);
    registerParticipant(reg, makeParticipant('p2', ['open']));
    expect(JSON.stringify(reg)).toBe(before);
  });
});
