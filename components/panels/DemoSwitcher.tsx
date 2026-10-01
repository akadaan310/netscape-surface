'use client';

import React, { useState } from 'react';
import { useSurfaceStore } from '../store';
import UrlEntry from './UrlEntry';

const DEMOS = [
  { id: 'seed-nasa', letter: 'A', title: 'NASA — APOD' },
  { id: 'seed-7u', letter: 'B', title: '7u' },
  { id: 'seed-purl', letter: 'C', title: 'purl' },
  { id: 'seed-acsp', letter: 'D', title: 'ACSP/0.1' },
  { id: 'seed-recursive', letter: 'E', title: 'netscape ∞' },
];

export default function DemoSwitcher() {
  const { setActiveSurfaceId, activeSurface } = useSurfaceStore();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-full border border-white/10 bg-black/50 backdrop-blur-md text-zinc-500 hover:text-gold hover:border-gold/40 transition-all text-[13px]"
        title="new surface"
      >
        +
      </button>
      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-2xl border border-white/10 bg-black/85 backdrop-blur-md p-3 animate-slide-up z-30">
          <div className="text-[11px] tracking-widest uppercase text-zinc-500 mb-2 px-1">
            surfaces
          </div>
          <div className="space-y-1 mb-3">
            {DEMOS.map((d) => {
              const active = activeSurface?.id === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => {
                    setActiveSurfaceId(d.id);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[12.5px] text-left transition-colors ${
                    active ? 'bg-white/10 text-zinc-100' : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full border border-white/15 text-[10px] flex items-center justify-center text-zinc-500">
                    {d.letter}
                  </span>
                  {d.title}
                </button>
              );
            })}
          </div>
          <UrlEntry onOpened={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
