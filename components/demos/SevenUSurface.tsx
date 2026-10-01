'use client';

import React, { useState } from 'react';
import { useSurfaceStore } from '../store';

export default function SevenUSurface() {
  const { activeSurface, participants, threads, lastCapture, comeHere7u, adapters } = useSurfaceStore();
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const sevenU = participants.find((p) => p.participant_id === '7u');
  const adapter = adapters['7u'];
  const msgs = activeSurface ? threads[activeSurface.id] ?? [] : [];

  const send = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    await comeHere7u(text);
    setInput('');
    setSending(false);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 rounded-xl border border-white/10 bg-white/[0.02] animate-fade-in">
      {/* identity card */}
      <div className="shrink-0 px-5 pt-4 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <span className="text-gold text-lg">✦</span>
          <div>
            <div className="text-[15px] text-zinc-100 font-medium">7u</div>
            <div className="text-[11px] text-zinc-500 font-mono">{sevenU?.kind}</div>
          </div>
          <span className="ml-auto text-[10px] tracking-widest uppercase px-2 py-0.5 rounded border border-gold/40 text-gold">
            simulated
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2.5">
          {(sevenU?.capabilities ?? []).map((c) => (
            <span key={c} className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
              {c}
            </span>
          ))}
        </div>
        <p className="mt-2.5 text-[12.5px] text-zinc-500 leading-relaxed">
          {sevenU?.provenance.note}
        </p>
      </div>

      {/* thread */}
      <div className="flex-1 overflow-auto px-5 py-4 space-y-3">
        {msgs.length === 0 && (
          <div className="text-[12.5px] text-zinc-600">
            no messages yet — say something, and 7u answers through the simulated adapter.
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'abed' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.from === 'abed'
                  ? 'bg-gold/15 text-zinc-100 ring-1 ring-gold/25'
                  : 'bg-white/[0.04] text-zinc-300 ring-1 ring-white/10'
              }`}
            >
              <div className="text-[10px] tracking-widest uppercase text-zinc-600 mb-1">
                {m.from === 'abed' ? 'abed' : '✦ 7u · simulated'}
              </div>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* context attachment viewer */}
      {lastCapture && (
        <div className="shrink-0 mx-5 mb-3 rounded-lg border border-white/10 bg-black/30 p-3">
          <div className="text-[10px] tracking-widest uppercase text-zinc-600 mb-1.5">
            last captured context · {new Date(lastCapture.capturedAt).toLocaleTimeString()}
          </div>
          <div className="text-[11px] font-mono text-zinc-500 whitespace-pre-wrap max-h-24 overflow-auto">
            {JSON.stringify(
              {
                surfaceId: lastCapture.surfaceId,
                type: lastCapture.surfaceType,
                title: lastCapture.title,
                url: lastCapture.url,
                selection: lastCapture.selection?.text?.slice(0, 120),
              },
              null,
              1
            )}
          </div>
        </div>
      )}

      {/* composer */}
      <div className="shrink-0 px-5 pb-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') void send();
          }}
          placeholder="talk to 7u…"
          className="flex-1 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2.5 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/40 transition-all"
        />
        <button
          onClick={() => void send()}
          disabled={sending}
          className="px-4 rounded-full text-[13px] text-black bg-gold hover:bg-gold-bright transition-colors disabled:opacity-50"
        >
          {sending ? '…' : 'send'}
        </button>
      </div>

      <div className="px-5 pb-3 shrink-0 text-[10px] tracking-widest uppercase text-zinc-700">
        adapter {adapter?.adapterId ?? '7u'} · epistemic simulated
      </div>
    </div>
  );
}
