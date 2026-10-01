'use client';

import React, { useState } from 'react';
import { useSurfaceStore } from '../store';

export default function ParticipantRail() {
  const { participants, adapters, comeHere7u, activeSurface } = useSurfaceStore();
  const [collapsed, setCollapsed] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const sevenU = participants.find((p) => p.participant_id === '7u');
  const slots = participants.filter((p) => p.participant_id !== '7u' && p.participant_id !== 'abed');
  const attached = activeSurface?.participantIds.includes('7u') ?? false;

  const comeHere = async () => {
    if (busy) return;
    setBusy(true);
    await comeHere7u(message.trim() || undefined);
    setMessage('');
    setBusy(false);
  };

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-16 rounded-full border border-white/10 bg-black/60 backdrop-blur-md text-gold hover:border-gold/40 transition-all"
        title="open participants"
      >
        ✦
      </button>
    );
  }

  return (
    <aside className="absolute right-3 top-16 bottom-20 z-20 w-64 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-md p-4 flex flex-col gap-4 overflow-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="text-[11px] tracking-widest uppercase text-zinc-500">participants</div>
        <button
          onClick={() => setCollapsed(true)}
          className="text-zinc-600 hover:text-zinc-300 text-sm"
          title="collapse"
        >
          →
        </button>
      </div>

      {/* 7u card */}
      {sevenU && (
        <div className="rounded-xl border border-gold/25 bg-gold/[0.04] p-3.5">
          <div className="flex items-center gap-2">
            <span className="text-gold">✦</span>
            <span className="text-[14px] text-zinc-100 font-medium">7u</span>
            <span className="ml-auto text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded border border-gold/40 text-gold">
              simulated
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {sevenU.capabilities.map((c) => (
              <span key={c} className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400">
                {c}
              </span>
            ))}
          </div>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void comeHere();
            }}
            placeholder="message (optional)…"
            className="mt-2.5 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-[12.5px] text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-gold/50 transition-all"
          />
          <button
            onClick={() => void comeHere()}
            disabled={busy}
            className="mt-2 w-full px-3 py-2 rounded-full text-[13px] text-black bg-gold hover:bg-gold-bright transition-colors disabled:opacity-50"
          >
            {busy ? '…' : attached ? 'come here again' : 'Come here'}
          </button>
          {attached && (
            <div className="mt-1.5 text-[10.5px] text-gold/80 text-center">7u is in this surface</div>
          )}
        </div>
      )}

      {/* adapter slots */}
      <div>
        <div className="text-[11px] tracking-widest uppercase text-zinc-500 mb-2">adapter slots</div>
        <div className="space-y-2">
          {slots.map((p) => {
            const ad = adapters[p.participant_id];
            return (
              <div key={p.participant_id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-zinc-200">{p.name}</span>
                  <span className="text-[10px] font-mono text-zinc-600">{p.kind}</span>
                  {p.simulated && (
                    <span className="ml-auto text-[9px] tracking-widest uppercase px-1.5 py-0.5 rounded border border-gold/40 text-gold">
                      simulated
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {p.capabilities.map((c) => (
                    <span key={c} className="text-[10.5px] px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-500">
                      {c}
                    </span>
                  ))}
                </div>
                {ad && (
                  <div className="mt-1.5 text-[10.5px] font-mono text-zinc-600">
                    {ad.adapterId} · {ad.simulated ? 'simulated' : 'live'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
