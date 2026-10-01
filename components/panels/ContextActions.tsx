'use client';

import React, { useState } from 'react';
import { useSurfaceStore } from '../store';

interface ActionDef {
  id: string;
  label: string;
  target?: string;
  glyph?: string;
}

const ACTIONS: Record<string, ActionDef[]> = {
  WEB: [
    { id: 'ask-7u', label: 'Ask 7u', glyph: '✦' },
    { id: 'save', label: 'Save' },
    { id: 'observe', label: 'Observe' },
    { id: 'open-external', label: 'Open external', glyph: '↗' },
  ],
  REPOSITORY: [
    { id: 'github-tab', label: 'Files', target: 'files' },
    { id: 'github-tab', label: 'Commits', target: 'commits' },
    { id: 'ask-7u', label: 'Ask 7u', glyph: '✦' },
    { id: 'observe', label: 'Observe' },
  ],
  DOCUMENT: [
    { id: 'focus-sources', label: 'Sources' },
    { id: 'focus-claims', label: 'Claims' },
    { id: 'ask-7u', label: 'Ask 7u', glyph: '✦' },
    { id: 'save', label: 'Save' },
  ],
  RESEARCH: [
    { id: 'focus-sources', label: 'Sources' },
    { id: 'focus-claims', label: 'Claims' },
    { id: 'ask-7u', label: 'Ask 7u', glyph: '✦' },
    { id: 'save', label: 'Save' },
  ],
  AI: [
    { id: 'ask-7u', label: 'Talk', glyph: '✦' },
    { id: 'ask-7u', label: 'Attach' },
    { id: 'observe', label: 'Observe' },
  ],
  SESSION: [
    { id: 'observe', label: 'Inspect' },
    { id: 'ask-7u', label: 'Ask 7u', glyph: '✦' },
  ],
  ARTIFACT: [
    { id: 'open-external', label: 'Open', glyph: '↗' },
    { id: 'observe', label: 'Observe' },
  ],
};

export default function ContextActions() {
  const { activeSurface, dispatchAction } = useSurfaceStore();
  const [askOpen, setAskOpen] = useState(false);
  const [askText, setAskText] = useState('');

  if (!activeSurface) return null;
  const defs = ACTIONS[activeSurface.type] ?? [
    { id: 'observe', label: 'Observe' },
    { id: 'ask-7u', label: 'Ask 7u', glyph: '✦' },
  ];

  const run = (a: ActionDef) => {
    if (a.id === 'ask-7u') {
      setAskOpen(true);
      return;
    }
    dispatchAction(a.id, a.target);
  };

  const submitAsk = () => {
    dispatchAction('ask-7u', askText.trim() || undefined);
    setAskText('');
    setAskOpen(false);
  };

  return (
    <div className="shrink-0 relative">
      <div className="flex items-center justify-center gap-2 py-2.5 px-4">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-2 py-1.5">
          <span className="text-[10px] tracking-widest uppercase text-zinc-600 pl-2 pr-1 hidden sm:inline">
            {activeSurface.type}
          </span>
          {defs.map((a, i) => (
            <button
              key={`${a.id}-${i}`}
              onClick={() => run(a)}
              className="px-3.5 py-1.5 rounded-full text-[12.5px] text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-all"
            >
              {a.glyph && <span className="text-gold mr-1">{a.glyph}</span>}
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {askOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[min(420px,90vw)] rounded-2xl border border-gold/30 bg-black/85 backdrop-blur-md p-3.5 animate-slide-up z-30">
          <div className="text-[11px] tracking-widest uppercase text-zinc-500 mb-2">
            ✦ ask 7u — context of this surface attaches
          </div>
          <div className="flex gap-2">
            <input
              autoFocus
              value={askText}
              onChange={(e) => setAskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitAsk();
                if (e.key === 'Escape') setAskOpen(false);
              }}
              placeholder="your question…"
              className="flex-1 rounded-full bg-white/[0.04] border border-white/10 px-4 py-2 text-[13px] text-zinc-200 placeholder:text-zinc-600 outline-none focus:border-gold/50 transition-all"
            />
            <button
              onClick={submitAsk}
              className="px-4 rounded-full text-[13px] text-black bg-gold hover:bg-gold-bright transition-colors"
            >
              send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
