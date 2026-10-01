'use client';

import React from 'react';
import { useSurfaceStore } from '../store';

export default function RecursiveSurface() {
  const { session, participants } = useSurfaceStore();

  const nest = [
    { level: 'surface →', text: 'this very canvas — a SESSION surface titled “netscape-surface ∞”' },
    { level: 'surface → surface →', text: 'the session holding it, and the surfaces inside the session' },
    { level: 'surface → surface → surface', text: 'the model that describes the model describing the model' },
  ];

  return (
    <div className="flex-1 overflow-auto rounded-xl border border-white/10 bg-white/[0.02] p-6 animate-fade-in">
      <div className="max-w-2xl">
        <div className="text-[11px] font-mono text-zinc-600 mb-1.5 tracking-widest uppercase">
          session · recursive
        </div>
        <h2 className="text-[18px] font-medium text-zinc-100 mb-4">the surface looking at itself</h2>

        <div className="space-y-2.5 mb-6">
          {nest.map((n, i) => (
            <div
              key={i}
              className="rounded-xl border border-gold/25 bg-gold/[0.04] px-4 py-3"
              style={{ marginLeft: `${i * 20}px` }}
            >
              <div className="text-[11px] font-mono text-gold/80 mb-1">{n.level}</div>
              <div className="text-[13px] text-zinc-300">{n.text}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-6">
          <ModelCard title="surfaces" value={String(session.surfaces.length)} note="open in this session" />
          <ModelCard title="participants" value={String(participants.length)} note="registered in the registry" />
          <ModelCard title="events" value={String(session.events.length)} note="logged so far" />
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4 mb-4">
          <div className="text-[12px] tracking-widest uppercase text-gold mb-2">the model, in brief</div>
          <ul className="text-[12.5px] font-mono text-zinc-500 space-y-1">
            <li><span className="text-zinc-300">Surface</span> — typed container: id, type, title, url, state, participantIds, provenance</li>
            <li><span className="text-zinc-300">Participant</span> — human / ai / tool: capabilities, continuity, simulated flag</li>
            <li><span className="text-zinc-300">Context</span> — captured slice of a surface, attachable to a participant</li>
            <li><span className="text-zinc-300">come here</span> — capture → attach → add participant → send → event</li>
          </ul>
        </div>

        <div className="text-[10px] tracking-widest uppercase text-zinc-700">
          epistemic · axiom — this description is the model asserting itself
        </div>
      </div>
    </div>
  );
}

function ModelCard({ title, value, note }: { title: string; value: string; note: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-3.5">
      <div className="text-[10px] tracking-widest uppercase text-zinc-600">{title}</div>
      <div className="text-[22px] text-gold font-medium">{value}</div>
      <div className="text-[11px] text-zinc-600">{note}</div>
    </div>
  );
}
