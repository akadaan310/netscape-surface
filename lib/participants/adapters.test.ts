import { describe, it, expect } from 'vitest';
import {
  sevenUSimulatedAdapter,
  searchSlotAdapter,
  localModelSlotAdapter,
  githubReadAdapter,
} from './adapters';
import type { SurfaceContext } from '../surface/types';

function ctx(over: Partial<SurfaceContext> = {}): SurfaceContext {
  return {
    capturedAt: new Date().toISOString(),
    author: 'Abed',
    surfaceId: 'surface-test',
    surfaceType: 'WEB',
    url: 'https://nasa.gov',
    title: 'NASA',
    artifactIds: [],
    stateSnapshot: {},
    ...over,
  };
}

describe('adapters', () => {
  it('simulated adapters: simulated:true and every summary contains "simulated"', async () => {
    const seven = sevenUSimulatedAdapter();
    const search = searchSlotAdapter();
    const local = localModelSlotAdapter();

    for (const adapter of [seven, search, local]) {
      expect(adapter.simulated).toBe(true);
      expect(adapter.participant.simulated).toBe(true);
    }

    const a = await seven.attach!(ctx());
    expect(a.simulated).toBe(true);
    expect(a.epistemic).toBe('SIMULATED');
    expect(a.summary).toContain('simulated');
    expect(a.summary).toContain('url'); // acknowledges the url item by name

    const s = await seven.send!(ctx({ title: 'Mars' }), 'hello 7u');
    expect(s.simulated).toBe(true);
    expect(s.summary.startsWith('[simulated]')).toBe(true);
    expect(s.summary).toContain('hello 7u'); // references the message
    expect(s.summary).toContain('Mars'); // references ctx title

    const ss = await search.send!(ctx(), 'mars rovers');
    expect(ss.simulated).toBe(true);
    expect(ss.summary).toContain('simulated');

    const la = await local.attach!(ctx());
    expect(la.simulated).toBe(true);
    expect(la.summary).toContain('simulated');

    const ls = await local.send!(ctx(), 'summarize');
    expect(ls.simulated).toBe(true);
    expect(ls.summary).toContain('simulated');
  });

  it('7u attach acknowledges each present context item by name', async () => {
    const adapter = sevenUSimulatedAdapter();
    const c = ctx({
      url: 'https://example.com',
      title: 'Example',
      message: 'hi',
      selection: {
        id: 'sel-1', kind: 'selection', sourceUrl: 'https://example.com',
        text: 'quoted text', timestamp: new Date().toISOString(), author: 'Abed',
      },
      artifactIds: ['art-1'],
    });
    const res = await adapter.attach!(c);
    for (const name of ['url', 'title', 'selection', 'message', 'artifacts']) {
      expect(res.summary).toContain(name);
    }
    expect(res.summary).not.toMatch(/live 7u (is|has)/i); // never claims liveness
  });

  it('github adapter is real (simulated:false) and fails gracefully on a non-github url', async () => {
    const adapter = githubReadAdapter();
    expect(adapter.simulated).toBe(false);
    expect(adapter.participant.simulated).toBe(false);
    const res = await adapter.observe!(ctx({ url: 'https://nasa.gov' }));
    expect(res.simulated).toBe(false);
    expect(res.ok).toBe(false);
    expect(res.epistemic).toBe('OBSERVED');
  });
});
