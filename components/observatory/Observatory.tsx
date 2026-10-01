'use client';

import React from 'react';
import { useSurfaceStore } from '../store';

function JsonBlock({ data }: { data: unknown }) {
  return (
    <pre className="text-[11px] font-mono text-zinc-400 whitespace-pre-wrap break-all max-h-56 overflow-auto bg-black/40 rounded-lg p-2.5 border border-white/5">
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[10px] tracking-[0.2em] uppercase text-gold/80 mb-1.5">{title}</div>
      {children}
    </div>
  );
}

export default function Observatory() {
  const { observatoryOpen, toggleObservatory, activeSurface, participants, lastCapture, session } =
    useSurfaceStore();

  return (
    <>
      {/* backdrop */}
      <div
        onClick={toggleObservatory}
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity ${
          observatoryOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />
      {/* drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-40 w-[min(420px,92vw)] border-l border-white/10 bg-[#0b0b0c]/95 backdrop-blur-md p-5 overflow-auto transition-transform duration-300 ${
          observatoryOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[14px] text-zinc-100 font-medium">Observatory</div>
            <div className="text-[11px] text-zinc-600 font-mono">toggle with `</div>
          </div>
          <button
            onClick={toggleObservatory}
            className="text-zinc-500 hover:text-zinc-200 text-lg"
          >
            ×
          </button>
        </div>

        <Panel title="current surface">
          <JsonBlock
            data={
              activeSurface
                ? { id: activeSurface.id, type: activeSurface.type, title: activeSurface.title, url: activeSurface.url }
                : null
            }
          />
        </Panel>

        <Panel title="url">
          <div className="text-[11px] font-mono text-zinc-400 break-all bg-black/40 rounded-lg p-2.5 border border-white/5">
            {activeSurface?.url ?? '—'}
          </div>
        </Panel>

        <Panel title="participants">
          <JsonBlock
            data={participants.map((p) => ({
              id: p.participant_id,
              kind: p.kind,
              capabilities: p.capabilities,
              simulated: p.simulated,
            }))}
          />
        </Panel>

        <Panel title="context — last captured">
          <JsonBlock data={lastCapture ?? 'none captured yet'} />
        </Panel>

        <Panel title="events">
          <div className="max-h-64 overflow-auto space-y-1.5 bg-black/40 rounded-lg p-2.5 border border-white/5">
            {session.events.length === 0 && (
              <div className="text-[11px] font-mono text-zinc-600">no events yet</div>
            )}
            {[...session.events].reverse().map((e) => (
              <div key={e.id} className="text-[11px] font-mono">
                <span className="text-zinc-600">{new Date(e.ts).toLocaleTimeString()}</span>{' '}
                <span className="text-zinc-300">{e.actor} · {e.action}</span>{' '}
                <span className="text-gold/70">[{e.epistemic}]</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="state">
          <JsonBlock data={activeSurface?.state ?? {}} />
        </Panel>

        <Panel title="provenance">
          <JsonBlock data={activeSurface?.provenance ?? {}} />
        </Panel>

        <Panel title="errors">
          <JsonBlock data={[]} />
        </Panel>
      </aside>
    </>
  );
}
